<!-- 批量添加 -->
<template>
  <div id="batchAddtion" v-loading='loadingTab'>
    <div class="upload">
      <div>
        <el-upload
          ref="upload"
          action=""
          :limit="1"
          :on-remove="handleRemove"
          :file-list="fileList"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :auto-upload="false">
          <el-button slot="trigger" size="mini" type="primary" class="mini"><span>选取文件</span></el-button>
          <div slot="tip"  class="el-upload__tip">注意:根据模板选取相符合的文件进行上传，标题必须一样！只能上传Excel文件且不能大于10M</div>
        </el-upload>
      </div>
      <div class="nav" v-if="showNav">
        <div class="item"><span>成功上传 {{ successUpload }} 条记录， {{ no }} 个样本为无效<span class="color pointer" @click.prevent="downloadExcel('err')"> (下载无效名单) </span></span></div>
        <div class="item" v-if="no != ''">
          <el-row>
            <el-col :span='4'>{{ no }} 个无效名单包括 ：</el-col>
            <el-col :span='20'>
              <div v-for="item in errorList" :key="item.code">[<span>姓名：{{item.name}}，</span><span>样本编号：{{item.code}}</span>] </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="addBtn" v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_ADD}">
        <el-button icon="el-icon-upload" size="mini" class="uploadStyle mini" type="primary" @click.prevent="downloadExcel" :disabled='isSample'><span>下载模板</span></el-button>
        <el-button @click="batchSave" type='primary' size='mini' class="mini" :disabled='isSample'><span>确定批量添加</span></el-button>
      </div>

    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import {export2Excel} from '../../../utils/excel'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      loadingTab: false,
      projectId: null,
      isSample: false,
      loading: false,
      showNav: false,
      breadcrumbList: [
        {
          name: '样本',
          path: '/sample'
        }, {
          name: '批量添加样本',
        }
      ],
      errorData: [],
      successUpload: '',
      no: '',
      header: [],
      filter: [],
      fileList: [],
      tableData:[],
      errorList:[],
      useProperty: null
    }
  },
  computed: {
    ...mapState(['allProperty']),
  },
  mounted(){
    this.$refs.upload.$el.addEventListener('change', e => {//绑定监听表格导入事件
      this.fileList = [];
      this.loadingTab = true
      this.readExcel(e);
    })
  },
  created () {
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/sample',
      backTitle: '样本列表'
    })
    this.getPropertyCheck()
    this.header = []
    this.filter = []
    this.allProperty.forEach(item => {
      this.header.push(item.label)
      this.filter.push(item.key)
    })
  },
  methods: {
    batchSave () {
      this.loadingTab = true
      if(this.tableData.length == 0) {
        this.loadingTab = false
        return;
      }
      let params = {
        "sampleList": this.tableData,
        "projectId": this.$route.query.id
      }
      this.httpPost('/sample/batch/import', params).then(res => {
        if (res.code == 0) {
          this.showNav = true
          this.successUpload = this.tableData.length - res.data.length
          this.no = res.data.length
          this.errorData = JSON.parse(JSON.stringify(res.data))
          if (res.data.length < 20) {
            this.errorList = res.data
          } else {
            this.errorList = res.data.splice(0,20)
          }
          this.loadingTab = false
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.loadingTab = false
        this.$message({type: 'error', message: error})
      })
    },
    //获取属性管理自定义的来展示表头
    getPropertyCheck () {
      this.httpPost(`/sample/property/check/${this.projectId}`).then(res => {
        if (res.code == 0) {
          if (res.data.useProperty != null) {
            this.useProperty = JSON.parse(res.data.useProperty)
            let temp = []
            if (this.useProperty.length != 0) {
              for(let i = 0; i < this.useProperty.length; i++) {
                temp.push(this.header[this.filter.indexOf(this.useProperty[i])])
              }
              this.header = temp
            }
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    /*表格读取*/
    readExcel: function (e) {
      const files = e.target.files;
      if (files.length <= 0) {//如果没有文件名
      this.loadingTab = false
        this.$message.error("请先选择文件再上传！");
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.loadingTab = false
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }else if((files[0].size)/1024/1024>10){
        this.loadingTab = false
        this.$message.error("上传文件不能大于10M！");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          const wsname = workbook.SheetNames[0];//取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
          this.ws = ws;
          this.tableData = [];
          this.header = []
          this.filter = []
          this.allProperty.forEach(item => {
            this.header.push(item.label)
            this.filter.push(item.key)
          })
          for(let i = 0;i < ws.length;i++) {
            let temp = ws[i];
            let item = {};
            let key = '';
            for (let j in this.header) {
              key = this.header[j];
              if (temp.hasOwnProperty(key)) {
                item[this.filter[j]] = temp[key];
              } else {
                item[this.filter[j]] = null;
              }
            }
            this.tableData.push(item);
          }
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
      let fileName = {
        name: files[0].name,
        url: ''
      }
      this.fileList.push(fileName);
      this.loadingTab = false
    },

    /*导出模板*/
    downloadExcel: function (data) {
      var header = [];
      var filter = [];
      var list = [];
      var fileName = '';
      if (data == 'err') {
        header = this.header
        filter = this.filter
        fileName = '无效名单'
        list = this.errorData
      } else {
        header = this.header
        filter = this.filter
        fileName = '样本信息批量导入模板'
      }
      export2Excel(header, filter, list, fileName);
    },

    /*删除文件*/
    handleRemove() {
      this.fileList = [];
      this.tableData = [];
      this.ws = [];
    },

    // 返回样本列表
    goSampleList () {
      this.$router.push('/sample')
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
  }
}
</script>

<style scoped>
#batchAddtion >>> i.el-icon-upload {
  font-size: 12px !important;
}
</style>
<style lang="scss" scoped>
  #batchAddtion{
    div{
      overflow: hidden;
    }
    .pointer {
      cursor: pointer;
    }
    .upload{
      margin: 20px 0 20px 0;
      .nav{
        border: 1px solid #9ecdde;
        background-color: #E1EFF4;
        padding: 10px 20px;
        .color{
          color: #2e83d3;
          cursor: pointer;
        }
        .item{
          line-height: 40px;
          span{
            font-size: 12px;
          }
          div{
            font-size: 12px;
          }
        }
      }
      .addBtn{
        margin-top: 20px;
      }
    }
    .uploadStyle {
      margin-right: 20px;
    }
    .upload-demo{
      margin: 20px 0;
    }
    .el-upload__tip {
      margin-bottom: 10px;
      white-space: nowrap;
    }
  }
</style>
