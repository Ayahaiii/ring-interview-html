<template>
  <div id="teamManage">
    <!-- <div class="add"><span class="base">团队分组管理</span><span class="back" @click="goteamList()">返回团队列表</span></div> -->
    <div class="manage">
      <el-row>
        <el-col :span='7'>
          <div class="group">
            <div>
              <el-input maxlength="6" v-model="groupName" placeholder='请输入组名' style="width: 65%" size='mini'></el-input><el-button class="btn mini" type='primary' size='mini' @click="addGroupItem"><span>创建组</span></el-button>
            </div>
            <div class="teamTree">
              <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.id != editId" @click="openList(data)">{{ node.label }}</span>
                  <span v-else><el-input maxlength="6" v-model="newName" size='small' @blur="editGroupName(node, data)"></el-input></span>
                  <span>
                    <el-button type="text" size="mini" @click="() => append(data)"><span class="iconfont">&#xe64b;</span></el-button>
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
              <div class="del"><span class="iconfont">&#xe606;</span>批量删除</div>
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
                  <span v-if="scope.row.status == 1" class="tag1">有效</span>
                  <span v-if="scope.row.status == 2" class="tag2">无效</span>
                  <span v-if="scope.row.status == 3" class="tag3">申请中</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align='center' width='95'>
                <template slot-scope="scope">
                  <el-dropdown>
                    <span class="el-dropdown-link cao">
                      操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item><span>删除</span></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
                layout="total, sizes, prev, pager, next, jumper"
                :total='total'>
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
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    },]
    return {
      breadcrumbList: [
        {
          name: '民营企业家应对新肺疫情深度访谈研究',
          path: '/index'
        }, {
          name: '团队',
          // path: ''
        }
      ],
      groupName: '',
      newName: '',
      editId: null,
      data: JSON.parse(JSON.stringify(data)),
      workerList: [
        {name: 'admin', email: '1945676543@qq.com', telephone: '12312312312', status: 1},
        {name: 'admin', email: '1945676543@qq.com', telephone: '12312312312', status: 2},
        {name: 'admin', email: '1945676543@qq.com', telephone: '12312312312', status: 3},
        {name: 'admin', email: '1945676543@qq.com', telephone: '12312312312', status: 1},
      ],
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
      title: '团队',
      link: '/team',
      backTitle: '团队列表'
    })
  },
  methods: {
    // 返回团队列表
    goteamList () {
      this.$router.push('/team')
    },
    // 添加组
    addGroupItem () {
      const newObj = { id: id++, label: this.groupName, children: [] };
      this.data.push(newObj)
      this.groupName = ''
    },
    // 打开编辑框
    openGroupName (node, data) {
      this.editId = data.id
      this.newName = data.label
    },
    // 修改组名
    editGroupName (node, data) {
      this.editId = null
      data.label = this.newName
      this.newName = ''
    },
    // 打开列表
    openList (data) {
    },
    append(data) {
      const newChild = { id: id++, label: '组名'+id, children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
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
        height: 400px;
        .deBtn{
          .del{
            width: 100px;
            float: right;
            margin-bottom: 20px;
            color: #5873b4;
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
