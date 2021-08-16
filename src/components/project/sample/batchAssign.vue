<!-- 批量添加 -->
<template>
  <div id="batchAssign">
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
          <div slot="tip"  class="el-upload__tip">注意:根据模板选取相符合的文件进行上传，标题必须一样！只能上传Excel文件且不能大于500kb</div>
        </el-upload>
      </div>
      <div class="nav" v-if="showNav">
        <div class="item"><span>成功上传 {{ successUpload }} 条记录， {{ no }} 个样本为无效<span class="color pointer" @click.prevent="downloadExcel('err')"> (下载无效名单) </span></span></div>
        <div class="item" v-if="no != ''">
          <el-row>
            <el-col :span='3'>{{ no }} 个无效名单包括 ：</el-col>
            <el-col :span='21'>
              <div v-for="item in errorList" :key="item.code">[ <span>样本编号: {{item.code}} </span> ] </div>
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

export default {
  data () {
    return {
      projectId: null,
      isSample: false,
      loading: false,
      showNav: false,
      breadcrumbList: [
        {
          name: '样本',
          path: '/sample'
        }, {
          name: '批量分派样本',
        }
      ],
      successUpload: '',
      no: '',
      tHeader: ['样本编号', '负责人', '协作者'],
      filterVal: ['code', 'managerName', 'assistantName'],
      fileList: [],
      tableData:[],
      errorList:[],
      useProperty: null
    }
  },
  mounted(){
    this.$refs.upload.$el.addEventListener('change', e => {//绑定监听表格导入事件
      this.fileList = [];
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
  },
  methods: {
    // 确认添加模板
    batchSave () {
      if(this.tableData.length == 0) {
        return;
      }
      this.loading = true
      let params = {
        "assignList": this.tableData,
        "projectId": +this.$route.query.id
      }
      this.httpPost('/sample/batch/assign', params).then(res => {
        if (res.code == 0) {
          this.showNav = true
          this.successUpload = res.data.correct.length
          this.no = res.data.error.length
          if (res.data.length < 20) {
            this.errorList = res.data.error
          } else {
            this.errorList = res.data.error.splice(0,20)
          }
          this.loading = false
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.loading = false
        this.$message({type: 'error', message: error})
      })
    },
    /*表格读取*/
    readExcel: function (e) {
      const files = e.target.files;
      if (files.length <= 0) {//如果没有文件名
        this.$message.error("请先选择文件再上传！");
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }else if((files[0].size)/1024/1024>10){
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
          for(let i = 0;i < ws.length;i++) {
            let temp = ws[i];
            let item = {};
            let key = '';
            for (let j in this.tHeader) {
              key = this.tHeader[j];
              if (temp.hasOwnProperty(key)) {
                item[this.filterVal[j]] = temp[key];
              } else {
                item[this.filterVal[j]] = null;
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
    },
    /*导出模板*/
    downloadExcel: function (data) {
      let tHeader = [];
      let filterVal = [];
      let list = [];
      let fileName = '';
      if (data == 'err') {
        tHeader = ['样本编号']
        filterVal = ['code']
        fileName = '无效名单'
        list = this.errorList
      } else {
        tHeader = this.tHeader
        fileName = '样本信息批量分派模板'
      }
      export2Excel(tHeader, filterVal, list, fileName);
    },
    /*删除文件*/
    handleRemove() {
      this.fileList = [];
      this.tableData = [];
      this.ws = [];
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
  }
}
</script>

<style scoped>
#batchAssign >>> i.el-icon-upload {
  font-size: 12px !important;
}
</style>
<style lang="scss" scoped>
  #batchAssign{
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
