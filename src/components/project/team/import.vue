<template>
  <div id="batchAdd">
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
          <el-button slot="trigger" size="mini" class="mini" type="primary"><span>选取文件</span></el-button>
          <div slot="tip" class="el-upload__tip">注意:根据模板选取相符合的文件进行上传，标题必须一样！只能上传Excel文件且不能大于10M</div>
        </el-upload>
      </div>
      <div class="nav" v-if = "showNav">
        <div class="item"><span>成功上传 {{ successUpload }} 条记录， {{ no }} 个用户未找到<span class="color"> (下载无效名单) </span></span></div>
        <div class="item" v-if = " no != '' ">
          <el-row>
            <el-col :span='4'>{{ no }} 个无效名单包括 ：</el-col>
            <el-col :span='20'>
              <div v-for="item in errorList">[<span>用户名：{{item.userName}}</span>] </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="addBtn">
        <el-button icon="el-icon-upload" size="mini" class="uploadStyle mini" type="primary" @click.prevent="downloadExcel" ><span>下载模板</span></el-button>
        <el-button v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_ADD}" type='primary' size='mini' class="mini" @click="batchSave"><span>确定批量添加</span></el-button>
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
      breadcrumbList: [
        {
          name: '团队',
          path: '/team'
        }, {
          name: '批量添加团队组员',
        }
      ],
      successUpload: 12,
      all: 3,
      no: 22,
      tHeader: ['用户名', '邮箱', '手机', '授权日期'],
      filterVal: ['userName', 'email', 'telephone', 'authDate'],
      fileList: [],
      tableData:[],
      errorList: [],
      showNav: false
    }
  },
  mounted(){
    this.$refs.upload.$el.addEventListener('change', e => {//绑定监听表格导入事件
      this.fileList = [];
      this.readExcel(e);
    })
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/team',
      backTitle: '团队列表'
    })
  },
  methods: {
    batchSave () {
      if(this.tableData.length == 0) {
        return;
      }
      this.loading = true
      let params = {
        "userInfos": this.tableData,
        "projectId": this.$route.query.id
      }
      this.httpPost('/team/batch/import', params).then(res => {
        if (res.code == 0) {
          this.showNav = true
          this.successUpload = this.tableData.length - res.data.length
          this.no = res.data.length
          if (res.data.length < 20) {
            this.errorList = res.data
          } else {
            this.errorList = res.data.splice(0,20)
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
          // console.log(this.tableData)
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
    downloadExcel: function () {
      const tHeader = this.tHeader;
      const filterVal = [];
      const list = [];
      const fileName = '团队成员导入模板';
      export2Excel(tHeader, filterVal, list, fileName);
    },

    /*删除文件*/
    handleRemove() {
      this.fileList = [];
      this.tableData = [];
      this.ws = [];
    },

    // 返回团队列表
    goteamList () {
      this.$router.push('/team')
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
  }
}
</script>
<style scoped>
#batchAdd >>> i.el-icon-upload {
  font-size: 12px !important;
}
</style>
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
      margin-right: 10px;
    }
    .upload-demo{
      margin: 20px 0;
    }
    .el-upload__tip{
      margin-bottom: 10px;
      white-space: nowrap;
    }
  }
</style>
