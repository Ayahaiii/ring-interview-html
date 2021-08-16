<template>
  <div id="batchAdd" v-loading='loadingTab'>
    <div style="color: #2e83d3">从文件导入对话文本</div>
    <div class="upload">
      <div>
        <el-upload
          ref="upload"
          action=""
          :limit="1"
          :on-remove="handleRemove"
          :file-list="fileList"
          accept=".xlsx,.xls,.excel,.doc,.docx"
          :auto-upload="false">
          <el-button slot="trigger" size="mini" type="primary" class="mini"><span>选取文件</span></el-button>
          <div slot="tip"  class="el-upload__tip">注意 : 根据模板选取相符合的文件进行上传，标题必须一样！只能上传Excel和word文件且不能大于10M</div>
        </el-upload>
      </div>
      <div class="nav" v-if="showNav">
        <div class="item"><span>成功上传 {{ successUpload }} 条记录， {{ no }} 个样本为无效<span class="color" @click="downLoadExcel(1)"> (下载无效名单) </span></span></div>
        <div class="item" v-if="no != ''">
          <el-row>
            <el-col :span='4'>{{ no }} 个无效名单包括 ：</el-col>
            <el-col :span='20'>
              <div v-for="item in errorList">[<span>讲话者：{{item.name}}</span>] </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="addBtn" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_ADD}">
        <el-button icon="el-icon-upload" size="mini" class="uploadStyle mini" type="primary" @click.prevent="downLoadExcel(null)" ><span>下载excel模板</span></el-button>
        <el-button icon="el-icon-upload" size="mini" class="uploadStyle mini" type="primary" @click.prevent="downLoadWrod(null)" ><span>下载word模板</span></el-button>
        <el-button icon="el-icon-success" @click="batchSave" type='primary' size='mini' class="mini"><span>确定批量添加</span></el-button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import XLSX from 'xlsx'
import {export2Excel} from '../../../utils/excel'
export default {
  data () {
    return {
      breadcrumbList: [
        {
          name: '访谈',
          path: '/talk'
        }, {
          name: '对话文本',
          path: '/talk/text/edit'
        }, {
          name: '从文件导入',
        }
      ],
      loadingTab: false,
      errorData: [],
      projectId: null,
      interviewId: null,
      loading: false,
      showNav: false,
      successUpload: '',
      no: '',
      type: null,
      tHeader: ['讲话者', '文本内容'],
      filterVal: ['name', 'paragraph'],
      fileList: [],
      tableData:[],
      errorList:[],
      useProperty: null,
      files: null,
      fileId: null,
      interName: null,
    }
  },

  mounted(){
    this.$refs.upload.$el.addEventListener('change', e => {//绑定监听表格导入事件
    this.loadingTab = true
      this.readExcel(e);
    })
  },

  created () {
    this.interName = this.$route.query.ina
    this.projectId = this.$route.query.id
    this.interviewId = this.$route.query.inId
    this.fileId = +this.$route.query.fileId
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/talk/text/edit',
      interviewId: this.interviewId,
      interviewName: this.interName
    })
  },
  methods: {
    batchSave () {
      // debugger
      this.loadingTab = true
      if (this.type == 'excel') {
        if(this.tableData.length == 0) {
          this.loadingTab = false
          return;
        }
        let params = {
          "batchImport": this.tableData,
          "interviewId": +this.$route.query.inId,
          "fileId": +this.$route.query.fileId,
          "projectId": +this.projectId
        }
        this.httpPost('/interview/batch/import', params).then(res => {
          if (res.code == 0) {
            this.fileList = []
            this.showNav = true
            this.errorData = JSON.parse(JSON.stringify(res.data.error))
            if (res.data.correct.length > 0) {
              this.successUpload = res.data.correct.length
            } else {
              this.successUpload = 0
            }
            if (res.data.error.length > 0) {
              this.no = res.data.error.length
            } else {
              this.no = 0
            }
            if (res.data.error.length < 20) {
              this.errorList = res.data.error
            } else {
              this.errorList = res.data.error.splice(0,20)
            }
            this.loadingTab = false
          } else {
            this.fileList = []
            this.$message({type: 'error', message: res.message})
          }
        }).catch(error => {
          this.fileList = []
          this.loadingTab = false
          this.$message({type: 'error', message: error})
        })
      } else if (this.type == 'word') {
        var formData = new FormData();
        formData.append("interviewId", +this.interviewId);
        formData.append("projectId", +this.projectId);
        formData.append("file", this.files);
        formData.append("fileId", this.fileId);
        const config = {
          headers: {
            'Accept': 'application/json;charset=UTF-8',
            'Content-Type': 'multipart/form-data',
            'Authorization': this.$cookies.get("tokenWeb") ? 'Bearer ' + this.$cookies.get("tokenWeb") : ""
          },
          withCredentials: false,
        }
        axios.post(this.baseUrl + '/interview/batch/text/word', formData, config).then(res => {
          if (res.data.code == 0) {
            this.showNav = true
            var result = res.data.data
            this.errorData = JSON.parse(JSON.stringify(result.error))
            if (result.correct && result.correct.length > 0) {
              this.successUpload = result.correct.length
            } else {
              this.successUpload = 0
            }
            if (result.error.length > 0) {
              this.no = result.error.length
            } else {
              this.no = 0
            }
            if (result.error.length < 20) {
              this.errorList = result.error
            } else {
              this.errorList = result.error.splice(0,20)
            }
            this.loadingTab = false
            this.$message({type: 'success', message: res.data.message})
            this.fileList = []
          } else {
            this.$message({type: 'error', message: res.data.message})
            this.fileList = []
            this.loadingTab = false
          }
        }).catch(error => {
          this.$message({type: 'error', message: error})
          this.fileList = []
          this.loadingTab = false
        })
      }
    },
    /*excel表格读取*/
    readExcel: function (e) {
      const files = e.target.files;
      this.files = files[0]
      let excelReg = ''
      if (files.length <= 0) {//如果没有文件名
        this.loadingTab = false
        this.$message.error("请先选择文件再上传！");
        return false;
      } else if (!/\.(xls|xlsx|xlsl|doc|docx)$/.test(files[0].name.toLowerCase())) {
        this.loadingTab = false
        this.$message.error('上传格式不正确，请上传xls、xlsx、docx或doc格式');
        return false;
      } else if((files[0].size)/1024/1024>10){
        this.loadingTab = false
        this.$message.error("上传文件不能大于10M！");
        return false;
      }
      if (/\.(xls|xlsl|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.type = 'excel'
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
            for(var i = 0;i < ws.length;i++) {
              var temp = ws[i];
              var item = {};
              var key = '';
              for (var j in this.tHeader) {
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
        this.loadingTab = false
      } else if (/\.(doc|docx)$/.test(files[0].name.toLowerCase())) {
        this.type = 'word'
        this.loadingTab = false
      } else {
        this.type = null
        this.loadingTab = false
      }
    },
    /*删除文件*/
    handleRemove() {
      this.fileList = [];
      this.tableData = [];
      this.ws = [];
    },
    // 下载excel模板
    downLoadExcel (type) {
      if (type == 1) {
        this.filterVal = ['name', 'paragraph']
      } else {
        this.filterVal = []
        this.errorData = []
      }
      const tHeader = this.tHeader;
      const filterVal = this.filterVal;
      const list = this.errorData;
      const fileName = '对话文本模板文件';
      export2Excel(tHeader, filterVal, list, fileName);
    },
    // 下载word模板
    downLoadWrod () {
      window.location.href = this.baseUrl + '/interview/itwt/temp/download'
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
  }
}
</script>

<style lang="scss" scoped>
  #batchAdd{
    div{
      overflow: hidden;
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
