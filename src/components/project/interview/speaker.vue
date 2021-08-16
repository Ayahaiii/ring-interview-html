<template>
  <div id='manage'>
    <div>
      <!-- 创建框 -->
      <div>
        <el-row style="overflow: hidden" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_ADD}">
          <div class="add" @click="add"><span class="iconfont fw">&#xe612;</span><span>添加参与者</span></div>
          <div class="add" @click="deleteMore"><span class="iconfont fw">&#xe606;</span><span>批量删除</span></div>
        </el-row>
      </div>

      <!-- 列表 -->
      <div class="nav">
        <el-table ref="workerList"
        :data="workerList"
        size='small'
        class="workerForm"
        v-loading='loading'
        @selection-change="handleSelectionChange"
        style="width: 100%">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column label="#" type="index" width="45"></el-table-column>
          <el-table-column label="姓名" prop='name' align='center'></el-table-column>
          <el-table-column label="昵称" prop='petName' align='center'></el-table-column>
          <el-table-column label="身份" prop='type' align='center'>
            <template slot-scope="scope">
              <div class="cao">
                <span v-if="scope.row.type == 1">主持人</span>
                <span v-if="scope.row.type == 2">助理</span>
                <span v-if="scope.row.type == 3">受访者</span>
                <span v-if="scope.row.type == 4">关系人</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="归属样本" prop='code' align='center'></el-table-column>
          <el-table-column label="备注" prop='description' align='center'></el-table-column>
          <el-table-column label="操作" align='center'  width='120' v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_ADD}">
            <template slot-scope="scope">
              <div class="cao">
                <el-button @click="editor(scope.row.id)" size='mini' plain type='primary' class="mini"><span>编辑</span></el-button>
                <el-button @click="detail(scope.row.id)" size='mini' plain type='danger' class="mini"><span>删除</span></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
      status: null,
      interviewId: null,
      breadcrumbList: [
        {
          name: '访谈',
          path: '/talk'
        },{
          name: '对话文本',
          path: '/talk/text/edit'
        },{
          name: '讲话者管理',
        }
      ],
      workerList: [
      ],
      interviewIdArr: [],
      loading: false,
    }
  },
  created () {
    this.interName = this.$route.query.ina
    this.projectId = this.$route.query.id
    this.interviewId = this.$route.query.inId
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/talk/text/edit',
      interviewId: this.interviewId,
      interviewName: this.interName
    })
    this.getList()
  },
  methods: {
    // 获取录音列表
    getList () {
      this.loading = true
      let params = {
        interviewId: this.interviewId,
        projectId: this.projectId
      }
      this.httpPost('interview/list/speaker/', params).then(res => {
        if (res.code == 0) {
          this.workerList = res.data
          this.loading = false
        } else {
          this.$message({type: 'error', message: res.message})
          this.loading = false
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
        this.loading = false
      })
    },

    // 编辑
    editor (editorId) {
      this.$router.push({path: '/talk/speaker/create', query: {id: this.projectId, sta: this.status, inId: this.interviewId, editorId: editorId}})
    },

    // 删除方法
    deleteItem (item) {
      let params = {
        speakerIds: item,
        projectId: +this.projectId
      }
      this.httpPost('/interview/delete/speaker', params).then(res => {
        if (res.code == 0) {
          this.getList()
          this.$message({type: 'success', message: res.message})
          this.interviewIdArr = []
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 批量删除
    deleteMore () {
      if (this.interviewIdArr.length <= 0) {
        this.$message({type: 'warning', message: '请选择要删除的对话者'})
        return
      }
      this.$confirm('此操作将永久删除该对话者, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(this.interviewIdArr)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 单次删除
    detail (id) {
      this.$confirm('此操作将永久删除该对话者, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.interviewIdArr = []
        this.interviewIdArr[0] = id
        this.deleteItem(this.interviewIdArr)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加参与者
    add () {
      this.$router.push({path: '/talk/speaker/create', query: {id: this.projectId,sta: this.status, inId: this.interviewId}})
    },
    // 列表选择状态改变
    handleSelectionChange(val) {
      this.interviewIdArr = []
      val.forEach(item => {
        this.interviewIdArr.push(item.id)
      })
    },
  }
}
</script>


<style scoped>
  .nav>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #manage>>>.el-button--mini {
    padding: 3px 7px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 3px;
  }
  .manage>>>.el-table th, .el-table td {
    padding: 7px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
}
  .workerForm>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #3e4b6b33;
  }
  .nav>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang='scss' scoped>
  #manage{
    .add{
      margin: 0px 40px 20px 0;
      float: left;
      line-height: 28px;
      .fw{
        font-size: 15px;
        font-weight: bold;
      }
      span{
        color: #2e83d3;
        padding-right: 5px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .cao{
      overflow: hidden;
      .mini{
        float: left;
      }
    }
    .drop{
      float: right;
    }
  }
</style>
