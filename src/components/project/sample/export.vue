<!-- 样本批量导出 -->
<template>
  <div id="exportSample">
    <div class="export" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="tit">导出数据范围</div>
      <div class="check">
        <el-radio-group v-model="radio">
            <div class="radio"><el-radio :disabled = "disabled1" :label="0">全部结果样本</el-radio></div>
            <div class="radio"><el-radio :disabled = "disabled1" :label="1">检索结果样本</el-radio></div>
            <div class="radio"><el-radio :disabled = "disabled2" :label="2">选中结果样本</el-radio></div>
        </el-radio-group>
      </div>
      <!-- 属性 -->
      <div class="tit">全部属性</div>
      <div class="exportBox">
        <el-transfer :titles="['全部属性', '导出属性']" v-model="properties" :data="allProperty"></el-transfer>
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
        <!-- <el-row class="li">
          <el-col :span='2'><span class="fw">导出标题 :</span></el-col>
          <el-col :span='22'>
            <el-input type='text' size="mini" v-model="title"></el-input>
          </el-col>
        </el-row> -->
        <el-row class="li">
          <el-col :span='2'><span class="fw">导出备注 :</span></el-col>
          <el-col :span='22'>
            <el-input type='textarea' v-model="description" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
          </el-col>
        </el-row>

        <el-row class="li" v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_EXPORT}">
          <el-col :span='3'><el-button @click="batchExport" :disabled='isSample' type='primary' size='small' class="eBtn mini"><span>导出</span></el-button></el-col>
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
        style="width: 100%">
          <el-table-column label="导出时间" prop='createTime' align='center'></el-table-column>
          <el-table-column label="文件名" prop='name' align='center' ></el-table-column>
          <el-table-column label="备注" prop='description' align='center'></el-table-column>
          <el-table-column label="文件格式" prop='fileType' align='center' width='100'></el-table-column>
          <el-table-column label="操作"  align='center' width='200'>
            <template slot-scope="scope">
              <span v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_EXPORT}">
                <el-button @click="downloadFile(scope.row.id)" type='primary' plain size='mini' class="eBtn mini"><span>下载</span></el-button>
                <el-button @click="deleteFile(scope.row.id)"  type='danger' plain size='mini' class="eBtn mini"><span>删除</span></el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="resultList.length > 0">
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
import { mapState } from 'vuex'
export default {
  data () {
    return {
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: '样本',
          path: '/sample'
        }, {
          name: '批量导出',
        }
      ],
      fullscreenLoading: false,
      fileType: 1,
      radio: 0,
      properties: [],
      resultList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      disabled1: false,
      disabled2: false,
      disabled3: false,
      description: '',
      option:''
      // ALL, SEARCH, CHECK
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/sample',
      backTitle: '访谈列表'
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
  computed: {
    ...mapState(['allProperty']),
  },
  mounted () {
    this.allProperty.forEach(item => {
      if (item.key == 'name' || item.key == 'code') {
        item.disabled = false
        item.checked = false
      }
    })
  },
  methods: {
    batchExport () {
      if(this.properties.length == 0) {
        this.$message({type: 'warning', message: '请选择导出属性'})
        return;
      }
      this.fullscreenLoading = true
      let opt = this.radio == 0 ? 'ALL' : this.radio == 1 ? 'SEARCH' : this.radio == 2 ? 'CHECK' : 'ALL'
      let fileType = this.fileType == 1 ? "EXCEL" : this.fileType == 2 ? 'CSV' : this.fileType == 3 ? 'TXT' : 'EXCEL'
      let params = {
        "opt": opt,
        "fileType": fileType,
        "properties": this.properties,
        "projectId": this.$route.query.id,
        "description": this.description,
        "searchVO": this.$route.params,
        "sampleIds": JSON.parse(this.$route.query.sIds)
      }
      this.httpPost('/sample/batch/export', params).then(res => {
        if (res.code == 0) {
            this.$message({ type: 'success', message: res.message })
            this.getList()
            this.fullscreenLoading = false
        } else {
          this.fullscreenLoading = false
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
      this.httpPost('/sample/export/list', params).then(res => {
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
      window.location.href = this.baseUrl + "/sample/download?id=" + id;
    },
    deleteFile (id) {
      let params = {
        "id": id,
        "projectId": this.$route.query.id
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.httpPost('/sample/file/delete', params).then(res => {
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
        this.radio = 2
      } else {
        this.radio = 0
        this.disabled2 = true
      }
    },
  }
}
</script>

<style scoped>
  .history>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #exportSample>>>.el-pagination span{
    font-size: 12px;
  }
  #exportSample>>>.el-button--mini {
    padding: 3px 10px;
    font-size: 12px;
    border-radius: 3px;
  }
  .exportBox>>>.el-button {
    padding: 8px 8px;
    margin: 0;
  }
  #exportSample>>>.el-table .cell {
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
  #exportSample>>>.el-transfer-panel__item.el-checkbox .el-checkbox__label span{
    font-size: 12px !important;
  }
  #exportSample>>>.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 13px;
    color: #303133;
    font-weight: normal;
  }
  #exportSample>>>.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
    color: #fff;
    background-color: #acb9da;
    border-color: #acb9da;
    padding: 5px;
    margin: 3px;
  }
</style>
<style lang="scss" scoped>
  #exportSample{
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
