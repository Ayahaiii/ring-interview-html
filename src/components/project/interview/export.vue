<template>
  <div id="exportTeam">
    <div class="export">
      <div class="tit">导出数据范围</div>
      <div class="check">
        <el-radio-group v-model="radio">
          <div class="radio"><el-radio :disabled = "disabled1" :label="0">导出全部访谈</el-radio></div>
          <div class="radio"><el-radio :disabled = "disabled1" :label="1">导出检索访谈</el-radio></div>
          <div class="radio"><el-radio :disabled = "disabled2" :label="2">导出选中访谈</el-radio></div>
        </el-radio-group>
      </div>
      <!-- 属性 -->
      <div class="tit">全部属性</div>
      <div class="exportBox">
        <el-transfer :titles="['全部属性', '导出属性']" v-model="properties" :data="attributeList"></el-transfer>
      </div>
      <!-- 导出格式 -->
      <div>
        <el-row class="li">
          <el-col :span='2'><span class="fw">导出格式 :</span></el-col>
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
          <el-col :span='2'><span class="fw">导出备注 :</span></el-col>
          <el-col :span='22'>
            <el-input type='textarea' v-model="description" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
          </el-col>
        </el-row>

        <el-row class="li" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_EXPORT}">
          <el-col :span='3'><el-button  @click="batchExport" :disabled='isSample' type='primary' size='small' class="eBtn mini"><span>导出</span></el-button></el-col>
          <el-col :span='3'><el-button type='primary' size='small' class="eBtn mini"><span>取消</span></el-button></el-col>
        </el-row>

        <el-row class="li">
          <el-col :span='2'><span class="fw">导出历史 :</span></el-col>
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
              <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_EXPORT}">
                <el-button @click="deleteFile(scope.row.id)"  type='danger' plain size='mini' class="eBtn mini"><span>删除</span></el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="resultList.length > 0">
          <el-pagination
            @size-change="handleSizeChange()"
            @current-change="handleCurrentChange()"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'>
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
        interName: null,
        projectId: null,
        isSample: false,
        breadcrumbList: [
          {
            name: '访谈',
            path: '/talk'
          }, {
            name: '导出',
          }
        ],
        fileType: 1,
        radio: 1,
        description: '',
        attributeList: [
          { key: 'id', label: '访谈ID', disabled: false, checked: false },
          { key: 'sampleName', label: '研究对象', disabled: false, checked: false },
          { key: 'managerName', label: '负责人', disabled: false, checked: false },
          { key: 'assistantName', label: '协助者', disabled: false, checked: false },
          { key: 'interviewTimeLen', label: '访谈时长', disabled: false, checked: false },
          { key: 'fileSize', label: '信息量', disabled: false, checked: false },
          { key: 'planStartTime', label: '计划时间', disabled: false, checked: false },
          { key: 'beginTime', label: '执行时间', disabled: false, checked: false },
          { key: 'docEndTime', label: '整理时间', disabled: false, checked: false },
          { key: 'auditTime', label: '审核时间', disabled: false, checked: false },
        ],
        properties: [],
        resultList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        disabled1: false,
        disabled2: false,
        disabled3: false,
        loading: false,
      }
    },
    created () {
      this.interName = this.$route.query.ina
      this.$emit('getChild', {
        breadcrumbList: this.breadcrumbList,
        link: '/talk',
        interviewName: this.interName
      })
      this.projectId = this.$route.query.id
      this.httpPost('/project/get/visit/' + this.projectId).then(res => {
        console.log(res.data)
        if (res.data == 1) {
          this.isSample = true
        }
      })
      this.getRadioStatus()
      this.getList()
    },
    methods: {
      batchExport () {
        if(this.properties.length == 0) {
          return;
        }
        this.loading = true
        let opt = this.radio == 0 ? 'ALL' : this.radio == 1 ? 'SEARCH' : this.radio == 2 ? 'CHECK' : 'ALL'
        let fileType = this.fileType == 1 ? "EXCEL" : this.fileType == 2 ? 'CSV' : this.fileType == 3 ? 'TXT' : 'EXCEL'
        var interviewIdStr = this.$route.query.sIds
        if (interviewIdStr) {
          interviewIdStr = JSON.parse(this.$route.query.sIds)
        } else {
          interviewIdStr = null
        }
        let params = {
          "opt": opt,
          "fileType": fileType,
          "properties": this.properties,
          "projectId": this.$route.query.id,
          "description": this.description,
          "interviewVO": this.$route.params,
          "interviewId": interviewIdStr
        }
        // return
        this.httpPost('/interview/batch/export', params).then(res => {
          if (res.code == 0) {
              this.$message({ type: 'success', message: res.message })
              this.getList()
              this.loading = false
          } else {
            this.loading = false
          }
        }).catch(error => {
          this.loading = false
          this.$message({type: 'error', message: error})
        })
      },

      getList () {
        this.loading = true
        let params = {
          "pageNum": this.currentPage,
          "pageSize": this.pageSize,
          "projectId": +this.projectId
        }
        this.httpPost('/interview/export/list', params).then(res => {
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
        window.location.href = this.baseUrl + "/interview/download?id=" + id;
      },

      deleteFile (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.httpPost('interview/down/delete', {
            id: id,
            projectId: this.projectId
          }).then(res => {
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

      getRadioStatus () {
        let opt = this.$route.query.opt
        if (opt == 'C') {
          this.disabled1 = true
          this.radio = 2
        } else {
          this.radio = 0
          this.disabled2 = true
        }
      },

      // 改变当前页码
      handleSizeChange(val) {
        this.pageSize = val
        this.getList()
      },
      // 改变当前每页条数
      handleCurrentChange(val) {
        this.currentPage = val
        this.getList()
      },
    }
  }
</script>

<style scoped>
  .history>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #exportTeam>>>.el-button--mini {
    padding: 3px 10px;
    font-size: 12px;
    border-radius: 3px;
  }
  #exportTeam>>>.el-pagination span{
    font-size: 12px;
  }
  .exportBox>>>.el-button {
    padding: 8px 8px;
    margin: 0;
  }
  #exportTeam>>>.el-table .cell {
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
  #exportTeam>>>.el-transfer-panel__item.el-checkbox .el-checkbox__label span{
    font-size: 12px !important;
  }
  #exportTeam>>>.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 13px;
    color: #303133;
    font-weight: normal;
  }
  #exportTeam>>>.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
    color: #fff;
    background-color: #acb9da;
    border-color: #acb9da;
    padding: 5px;
    margin: 3px;
  }
</style>
<style lang="scss" scoped>
  #exportTeam{
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
  }
</style>
