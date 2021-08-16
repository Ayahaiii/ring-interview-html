<template>
  <div id="exportT">
    <div class="export">
      <div class="tit">导出对话文本</div>
      <!-- 导出格式 -->
      <div>
        <el-row class="li">
          <el-col :span='2'><span class="fw fs12">导出格式 :</span></el-col>
          <el-col :span='22'>
            <div class="check">
              <el-radio-group v-model="fileType">
                <div class="radio"><el-radio :label="1">Excel格式</el-radio></div>
                <div class="radio"><el-radio :label="2">CSV格式</el-radio></div>
                <div class="radio"><el-radio :label="3">TXT格式</el-radio></div>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row class="li">
          <el-col :span='2'><span class="fw fs12">导出备注 :</span></el-col>
          <el-col :span='22'>
            <el-input type='textarea' v-model='remarks' :autosize="{ minRows: 3, maxRows: 5}" style="width: 50%"></el-input>
          </el-col>
        </el-row>

        <el-row class="li" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_EXPORT}">
          <el-col :span='2'><span class="fw fs12 box"></span></el-col>
          <el-col :span='3'><el-button @click='downLoadDialogue' type='primary' size='small' class="eBtn mini"><span>导出</span></el-button></el-col>
          <el-col :span='3'><el-button type='primary' size='small' class="eBtn mini"><span>取消</span></el-button></el-col>
        </el-row>

        <el-row class="li">
          <el-col :span='2'><span class="fw fs12">导出历史 :</span></el-col>
          <el-col :span='24'>

          </el-col>
        </el-row>
      </div>

      <!-- 导出历史 -->
      <div class="history">
        <el-table ref="resultList"
        :data="resultList"
        class="workerForm"
        size='mini'
        v-loading='loading'
        style="width: 100%">
          <el-table-column label="导出时间" prop='createTime' align='center' width='180'></el-table-column>
          <el-table-column label="文件名" prop='name' align='center'></el-table-column>
          <el-table-column label="备注" prop='description' align='center'></el-table-column>
          <el-table-column label="文件格式" prop='fileType' align='center' width='100'></el-table-column>
          <el-table-column label="操作" align='center' width='150'>
            <template slot-scope="scope">
              <el-button @click="downloadFile(scope.row.id)" type='primary' plain size='mini' class="eBtn mini"><span>下载</span></el-button>
              <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_EXPORT}">
                <el-button @click="deleteFile(scope.row.id)"  type='danger' plain size='mini' class="eBtn mini"><span>删除</span></el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="workerList.length > 0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total='total'
            hide-on-single-page>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectId: null,
      interviewId: null,
      breadcrumbList: [
        {
          name: '访谈',
          path: '/talk'
        }, {
          name: '对话文本',
          path: '/talk/text/info'
        },{
          name: '导出',
        }
      ],
      resultList: [],
      fileType: 1,
      value: '',
      remarks: '',
      workerList: [
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      interName: null,
    }
  },
  created () {
    this.interName = this.$route.query.ina
    this.projectId = this.$route.query.id
    this.interviewId = this.$route.query.inId
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/talk/text/info',
      interviewId: this.interviewId,
      interviewName: this.interName
    })
    this.getList()
  },
  methods: {
    downLoadDialogue () {
      let fileType = this.fileType == 1 ? "EXCEL" : this.fileType == 2 ? 'CSV' : this.fileType == 3 ? 'TXT' : 'EXCEL'
      let params = {
        "listVO":{
          "interviewId": +this.interviewId
          },
        "projectId": +this.projectId,
        "fileType": fileType,
        "description": this.remarks,
        "properties":['speakName', 'paragraph']
      }
      this.httpPost('/interview/export/itwt', params).then(res => {
        if (res.code == 0) {
          if (res.code == 0) {
            this.remarks = ''
            this.$message({type: 'success', message: res.message})
            this.getList()
          } else {
            this.$message({type: 'error', message: res.message})
          }
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    getList () {
      this.loading = true
      let params = {
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
        "projectId": +this.projectId,
        "interviewId": +this.interviewId
      }
      this.httpPost('/interview/export/itwt/list', params).then(res => {
        if (res.code == 0) {
          this.resultList = res.data.data
          this.total = res.data.total
          this.loading = false
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    downloadFile (id) {
      window.location.href = this.baseUrl + "/interview/itwt/download?id=" + id;
    },

    deleteFile (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "historyId": id,
          "projectId": this.projectId
        }
        this.httpPost('/interview/down/itwt/delete', params).then(res => {
          if (res.code == 0) {
            this.getList()
          } else {
            this.$message({type: 'error', message: res.message})
          }
        }).catch(error => {
          this.$message({type: 'error', message: error})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  }
}
</script>

<style scoped>
  .history>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #exportT>>>.el-button--mini {
    padding: 3px 10px;
    font-size: 12px;
    border-radius: 3px;
  }
  #exportT>>>.el-pagination .el-select .el-input .el-input__inner {
    padding-right: 25px;
    border-radius: 3px;
    font-size: 12px;
  }
  #exportT>>>.el-pagination span{
    font-size: 12px;
  }
  #exportT>>>.el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
  }
  .export>>>.el-radio__label {
    font-size: 12px;
    padding-left: 10px;
  }
  #exportT>>>.el-transfer-panel__item.el-checkbox .el-checkbox__label span{
    font-size: 12px !important;
  }
  #exportT>>>.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 13px;
    color: #303133;
    font-weight: normal;
  }
  #exportT>>>.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
    color: #fff;
    background-color: #acb9da;
    border-color: #acb9da;
    padding: 5px;
    margin: 3px;
  }
</style>
<style lang="scss" scoped>
  #exportT{
    div{
      overflow: hidden;
    }
    .export{
      .tit{
        margin: 0px 0 20px;
        font-size: 14px;
        color: #444;
      }
      .check{
        .radio{
          margin-bottom: 20px;
          float: left;
          margin-right: 20px;
        }
      }
      .li{
        margin: 30px 0;
        font-size: 14px;
        color: #444;

        .eBtn{
          width: 70%;
        }
      }
    }
    .box{
      display: inline-block;
      width: 100%;
      height: 10px;
    }
  }
</style>
