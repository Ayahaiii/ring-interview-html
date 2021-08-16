<template>
  <div id="teamManage">
    <div class="manage">
      <el-row>
        <el-col :span='7'>
          <div class="group">
            <div>
              <el-input maxlength="6" v-model="groupName" placeholder='请输入组名' style="width: 65%" size='mini'></el-input><el-button class="btn mini" type='primary' size='mini' @click="addGroupItem(null, null)"><span>创建组</span></el-button>
            </div>
            <div class="teamTree">
              <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.id != editId" @click="openList(data)">{{ node.label }}({{treeValue[data.id]}})</span>
                  <span v-else><el-input maxlength="6" v-model="newName" size='small' @blur="editGroupName(node, data)"></el-input></span>
                  <span>
                    <el-button v-if="node.level < 3" type="text" size="mini" @click="() => append(node, data)"><span class="iconfont">&#xe64b;</span></el-button>
                    <el-button type="text" size="mini" @click="() => remove(node, data)"><span class="iconfont">&#xe606;</span></el-button>
                    <el-button type="text" size="mini" @click="openGroupName(node, data)"><span class="iconfont">&#xe63b;</span></el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span='17'>
          <div class="list">
            <!-- 批量删除 -->
            <div class='deBtn'>
              <div class="del"><span class="iconfont" @click="delUserToGroup('b', null)">&#xe606;</span>批量删除</div>
            </div>
            <el-table ref="workerList"
            :data="workerList"
            class="workerForm"
            size='small'
            v-loading='loading'
            @selection-change="handleSelectionChange()"
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="用户名" prop='name' align='center'></el-table-column>
              <el-table-column label="电子邮箱" prop='email' align='center'></el-table-column>
              <el-table-column label="手机号" prop='telephone' align='center'  width='130'></el-table-column>
              <el-table-column label="状态" prop='status' align='center' width='100'>
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1" class="tag3">申请中</span>
                  <span v-if="scope.row.status == 2" class="tag1">有效</span>
                  <span v-if="scope.row.status == 3" class="tag2">无效</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align='center' width='95'>
                <template slot-scope="scope">
                  <el-button class="mini" size="mini"  @click="delUserToGroup('', scope.row)"><span>删除</span></el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination" v-if="workerList.length > 0">
              <el-pagination
                @size-change="handleSizeChange()"
                @current-change="handleCurrentChange()"
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
let id = 1000;
export default {
  data () {
    return {
      projectId: null,
      breadcrumbList: [
        {
          name: '团队',
          path: '/team'
        }, {
          name: '分组管理',
        }
      ],
      groupName: '',
      newName: '',
      editId: null,
      data: [],
      treeValue: {},
      workerList: [],
      groupId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      multipleSelection: [],
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/team',
      backTitle: '团队列表'
    })
    this.projectId = this.$route.query.id
    this.getTreeGroup()
  },
  methods: {
    // 返回团队列表
    goteamList () {
      this.$router.push('/team')
    },
    // 添加组
    addGroupItem (id, parentId) {
      let params = {
        id: id,
        name: this.groupName,
        projectId: this.projectId,
        parentId: parentId
      }
      this.httpPost('/team/group/save', params).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.groupName = ''
          this.getTreeGroup()
        }
      })
    },
    // 获取树形组
    getTreeGroup () {
      this.httpPost('/team/group/tree/'+ this.projectId).then(res => {
        if (res.code === 0) {
          this.data = res.data.treeGroup
          this.treeValue = res.data.treeValue
        }
      })
    },
    // 打开编辑框
    openGroupName (node, data) {
      this.editId = data.id
      this.newName = data.label
    },
    // 修改组名
    editGroupName (node, data) {
      this.editId = null
      this.groupName = this.newName;
      this.addGroupItem(data.id, null)
      this.newName = ''
    },
    // 打开列表
    openList (data) {
      this.groupId = data.id;
      this.currentPage = 1;
      this.getResultList();
    },

    // 获取结果列表
    getResultList () {
      let params = {
        projectId: this.projectId,
        groupId: this.groupId,
        pageNum: this.currentPage,
        pageSize: this.currentSize,
      }
      this.httpPost('/team/group/user/list/page', params).then(res => {
        if (res.code == 0) {
          this.workerList = res.data.data
          this.currentPage = res.data.pageNum
          this.currentSize = res.data.pageSize
          this.total = res.data.total
        }
      })
    },

    delUserToGroup(opt, row) {
      let userToGroups = [];
      if (opt == 'b') {
        if (this.multipleSelection.length == 0) {
          // 提示错误信息
          return
        }
        userToGroups = this.multipleSelection;
      } else {
        userToGroups.push(row);
      }
      this.$confirm('确定移除成员吗？, 是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          userToGroups: userToGroups,
          projectId: this.projectId
        }
        this.httpPost('/team/group/user/delete', params).then(res => {
          if (res.code === 0) {
            this.getResultList()
            this.$message({
              type: 'success',
              message: '移除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },

    append(node, data) {
      this.groupName = '新建分组';
      this.addGroupItem(null, data.id)
    },
    remove(node, data) {
      this.$confirm('确定移除该组、子组和组内成员吗？, 是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        ids.push(data.id)
        if(data.children.length > 0) {
          this.getGroupId(data.children, ids);
        }
        let params = {
          ids: ids,
          projectId: this.projectId
        }
        this.httpPost('/team/group/delete', params).then(res => {
          if (res.code === 0) {
            this.getTreeGroup()
            this.$message({
              type: 'success',
              message: '移除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });


    },
    // 循环添加id
    getGroupId(children, ids) {
      for(let i = 0; i < children.length; i++) {
        ids.push(children[i].id);
        if (children[i].children.length > 0) {
          this.getGroupId(children[i].children, ids);
        }
      }
    },
    // 列表选择状态改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
  #teamManage>>>.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .manage>>>.el-pagination span{
    font-size: 12px;
  }
  #teamManage>>>.custom-tree-node span{
    font-size: 12px;
  }
  .manage>>>.el-table .cell {
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
  .manage>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #teamManage>>>.el-tree-node__content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 35px;
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  #teamManage{
    .manage{
      margin: 20px 0;
      .group{
        margin: 0px 20px 20px 0;
        height: 400px;
        .btn{
          margin-left: 10px;
          height: 27px;
        }
      }
      .list{
        margin: 0px 0 20px;
        padding: 0 0px 10px 10px;
        border-left: 1px solid #ccc;
        height: 500px;
        .deBtn{
          .del{
            width: 100px;
            float: right;
            margin-bottom: 20px;
            color: #2e83d3;
            text-align: right;
            cursor: pointer;
            span{
              padding-right: 5px;
            }
          }
        }
      }
      .teamTree{
        margin: 20px 0;
        height: 452px;
        overflow: auto;
      }
      /*滚动条样式*/
      .teamTree::-webkit-scrollbar {
        width: 5px;
      }
      .teamTree::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #ccc;
      }
      .teamTree::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: #eee;
      }
    }
    .iconfont{
      font-size: 14px !important;
    }
    .tag1{
      display: inline-block;
      padding: 1px 8px;
      background-color: #ff9800;
      color: #fff;
      font-size: 12px;
      width: 55px;
    }
    .tag2{
      display: inline-block;
      padding: 1px 8px;
      background-color: #628e2e;
      color: #fff;
      font-size: 12px;
      width: 55px;
    }
    .tag3{
      display: inline-block;
      padding: 1px 2px;
      background-color: #cc4757;
      color: #fff;
      font-size: 12px;
      width: 54px;
      box-sizing: border-box;
    }
    .cao{
      display: inline-block;
      width: 70px;
      border: 1px solid #ccc;
      padding: 1px 0;
      background-color: #f1f1f1;
      font-size: 12px;
    }
  }
</style>
