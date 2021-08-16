<template>
  <div id="exportTeam">
    <div class="export" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="tit">导出数据范围</div>
      <div class="check">
        <el-radio-group v-model="radio">
          <div class="radio"><el-radio :disabled = "disabled1" :label="1">全部团队成员</el-radio></div>
          <div class="radio"><el-radio :disabled = "disabled1" :label="2">检索结果成员</el-radio></div>
          <div class="radio"><el-radio :disabled = "disabled2" :label="3">选中结果成员</el-radio></div>
        </el-radio-group>
      </div>
      <!-- 属性 -->
      <div class="tit">全部属性</div>
      <div class="exportBox">
        <el-transfer :titles="['全部属性', '导出属性']" v-model="value" :data="attributeList"></el-transfer>
      </div>
      <!-- 导出格式 -->
      <div>
        <el-row class="li">
          <el-col :span='2'><span class="fw">导出格式 :</span></el-col>
          <el-col :span='22'>
            <div class="check">
              <el-radio-group v-model="format">
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

        <el-row class="li">
          <el-col :span='3'><el-button :disabled='isSample' v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_EXPORT}" type='primary' size='small' class="eBtn mini" @click="batchExport"><span>导出</span></el-button></el-col>
        </el-row>

        <el-row class="li">
          <el-col :span='2'><span class="fw">导出历史 :</span></el-col>
          <el-col :span='24'>

          </el-col>
        </el-row>
      </div>

      <!-- 导出历史 -->
      <div class="history">
        <el-table ref="workerList"
        :data="workerList"
        class="workerForm"
        size='mini'
        style="width: 100%">
          <el-table-column label="导出时间" prop='createTime' align='center' width='180'></el-table-column>
          <el-table-column label="文件名" prop='name' align='center' width='100'></el-table-column>
          <el-table-column label="备注" prop='description' align='center'></el-table-column>
          <el-table-column label="格式" prop='fileType' align='center' width='100'></el-table-column>
          <el-table-column label="操作"  align='center'>
            <template slot-scope="scope">
              <el-button @click="downloadFile(scope.row.id)" type='primary' size='small' class="eBtn mini"><span>下载</span></el-button>
              <el-button @click="deleteFile(scope.row.id)"  type='primary' size='small' class="eBtn mini"><span>删除</span></el-button>
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
            hide-on-single-page
          >
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
      isSample: false,
      fullscreenLoading: false,
      breadcrumbList: [
        {
          name: '团队',
          path: '/team'
        }, {
          name: '导出',
        }
      ],
      format: 1,
      radio: 1,
      description: '',
      attributeList: [{ key: 'id', label: '团队成员ID', disabled: false },
                      { key: 'userName', label: '姓名', disabled: false },
                      { key: 'email', label: '邮箱', disabled: false },
                      { key: 'telephone', label: '手机', disabled: false },
                      { key: 'sampleNum', label: '样本数量', disabled: false },
                      { key: 'role', label: '角色', disabled: false },
                      { key: 'joinDate', label: '加入日期', disabled: false },
                      { key: 'validDate', label: '授权日期', disabled: false }
                    ],
      value: [],
      workerList: [
        {time: '2020-02-01 12:00:09', name: 'admin', export: 4, remarks: '那是肯定是哪来的', format: 'Excel格式', type: '[下载]'},
        {time: '2020-02-01 12:00:09', name: 'admin', export: 4, remarks: '那是肯定是哪来的', format: 'CSV格式', type: '[下载]'},
        {time: '2020-02-01 12:00:09', name: 'admin', export: 4, remarks: '那是肯定是哪来的', format: 'TXT格式', type: '[下载]'},
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      disabled1: false,
      disabled2: false
    }
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
      link: '/team',
      backTitle: '团队列表'
    })
    this.getRadioStatus()
    this.getList()
  },
  methods: {
    // 返回团队列表
    goteamList () {
      this.$router.push('/team')
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
    getRadioStatus () {
      let opt = this.$route.query.opt
      if (opt == 'C') {
        this.disabled1 = true
        this.radio = 3
      } else {
        this.radio = 1
        this.disabled2 = true
      }
    },
    batchExport () {
      this.fullscreenLoading = false
      if(this.value.length == 0) {
        return;
      }
      let optValue = this.radio == 1 ? 'ALL' : this.radio == 2 ? 'SEARCH' : this.radio == 3 ? 'CHECK' : 'ALL'
      let fileType = this.format == 1 ? "EXCEL" : this.format == 2 ? 'CSV' : this.format == 3 ? 'TXT' : 'EXCEL'
      let params = {
        "opt": optValue,
        "fileType": fileType,
        "properties": this.value,
        "projectId": this.$route.query.id,
        "description": this.description,
        "searchVO": this.$route.params,
        "teamUserIds": JSON.parse(this.$route.query.sIds)
      }
      this.httpPost('/team/batch/export', params).then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.getList()
            this.$message({ type: 'success', message: res.message })
          } else {
            this.$message({type: 'error', message: res.message})
          }
          this.fullscreenLoading = false
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.fullscreenLoading = false
        this.$message({type: 'error', message: error})
      })
    },
    getList () {
      let params = {
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
        "projectId": this.projectId
      }
      this.httpPost('/team/export/list', params).then(res => {
        if (res.code == 0) {
          this.workerList = res.data.data
          this.loading = false
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    downloadFile (id) {
      window.location.href = this.baseUrl + "/team/download?id=" + id;
    },

    deleteFile (id) {
      let params = {
        "id": id,
        "projectId": this.$route.query.id
      }
      this.httpPost('/team/file/delete', params).then(res => {
        if (res.code == 0) {
          this.getList()
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
  }
}
</script>

<style scoped>
  .history>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
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
