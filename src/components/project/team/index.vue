<template>
  <div id="team">
    <!-- 搜索框 -->
    <div class="search">
      <el-row :gutter="10">
        <el-col :span='4'>
          <div class="fl"><span>角 色 :</span></div>
          <div class="fr w5">
            <el-select size='mini' v-model="role" clearable placeholder="请选择角色">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='5'>
          <div class="fl"><span>状 态 :</span></div>
          <div class="fr w5">
            <el-select size='mini' v-model="status" clearable placeholder="请选择状态">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='5'>
          <div class="fl"><span>分 组 :</span></div>
          <div class="fr w5" style="margin-top: 2px">
            <el-cascader size='mini' :options="resultArr" :props="{ checkStrictly: true }" @change="getGroupKey" clearable></el-cascader>
          </div>
        </el-col>
        <el-col :span='7'>
          <div class="fl"><span>关键词 :</span></div>
          <div class="fr w9"><el-input size='mini' placeholder="输入关键字进行智能搜索" v-model="inputValue" clearable></el-input></div>
        </el-col>
        <el-col :span='2'>
          <el-button type='primary' size='mini' class='mini' @click="getResultList"><span>搜索</span></el-button>
        </el-col>

      </el-row>
    </div>

    <!-- 创建框 -->
    <div>
      <el-row>
        <div v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_ADD}" class="add" @click="addTeamItem"><span class="iconfont fw">&#xe612;</span><span> 添加团队成员</span></div>
        <!-- <div v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_ADD}" class="add" @click="batchAdd"><span class="iconfont fw">&#xe641;</span><span> 批量添加团队成员</span></div> -->
        <div v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_EXPORT}" class="add" @click="exportTeam"><span class="iconfont fw">&#xe629;</span><span> 批量导出</span></div>
        <div v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_DELETE}" class="add" ><span class="iconfont fw">&#xe606;</span><span @click="batchDelTeamUser && !isSample"> 批量删除</span></div>
        <div v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_GROUP_ADMIN}" class="add" @click="openGroup"><span class="iconfont fw">&#xe62c;</span><span> 添加到组</span></div>
        <div v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_GROUP_ADMIN}" class="add" @click="groupManage"><span class="iconfont fw">&#xe60d;</span><span> 分组管理</span></div>
      </el-row>
    </div>

    <!-- 列表 -->
    <div class="nav">
      <el-table ref="workerList"
      :data="workerList"
      class="workerForm"
      size='small'
      v-loading='loading'
      @selection-change="handleSelectionChange"
      style="width: 100%">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column label="用户名" prop='userName' align='center'></el-table-column>
        <el-table-column label="手机号" prop='telephone' width='130' align='center'></el-table-column>
        <el-table-column label="分派样本" prop='sampleNum' align='center'></el-table-column>
        <el-table-column label="分组" prop='groups' align='center'>
          <template slot-scope="scope">
            <span class="fs12" v-if="scope.row.groupName">{{ scope.row.groupName }}</span>
            <span class="fs12" v-else>未分组</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop='role' align='center' width='130'>
          <template slot-scope="scope">
            <div style="text-align: left">
              <span v-if="scope.row.role.indexOf('拥有者') != -1" class="lab4">拥</span>
              <span v-if="scope.row.role.indexOf('管理员') != -1" class="lab4">管</span>
              <span v-if="scope.row.role.indexOf('督导员') != -1" class="lab2">督</span>
              <span v-if="scope.row.role.indexOf('分析员') != -1" class="lab3">析</span>
              <span v-if="scope.row.role.indexOf('访问员') != -1" class="lab1">访</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="加入日期" prop='joinDate' width='150' align='center'></el-table-column>
        <el-table-column label="有效日期" prop='validDate' align='center' width='150'>
          <template slot-scope="scope">
            <span class="fs12" v-if="scope.row.authType == 2">{{scope.row.validDate}}</span>
            <span class="fs12" v-else>永久</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop='status' width='75' align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="tag3">申请中</span>
            <span v-if="scope.row.status == 2" class="tag1">有效</span>
            <span v-if="scope.row.status == 3" class="tag2">无效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' width='100'>
          <template slot-scope="scope">
            <div v-if="roleId != 2">
              暂无
            </div>
            <div v-else>
              <el-dropdown trigger='click' @click.native="getTrigger" placement="bottom" >
                <span class="el-dropdown-link cao">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" >
                  <span v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_EDIT}" v-if="scope.row.status == 1" @click="agreeTeamUser(scope.row)"><el-dropdown-item><span>同意</span></el-dropdown-item></span>
                  <span v-if="scope.row.status == 2">
                    <span  v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_EDIT}" @click="editTeamItem(scope.row)"><el-dropdown-item><span>编辑</span></el-dropdown-item></span>
                    <span  v-if="scope.row.userId != userId" v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_EDIT}" @click="disableTeamUser(scope.row)"><el-dropdown-item><span>禁止</span></el-dropdown-item></span>
                  </span>
                  <span  v-if="scope.row.userId != userId" v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_DELETE}" @click="delTeamUser(scope.row)"><el-dropdown-item><span>删除</span></el-dropdown-item></span>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
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

    <!-- 对话框 -->
    <el-dialog title="添加到组" width='40%' :visible.sync="dialogVisible">
      <div class="teamTree">
        <el-tree class="group" :data="groupData" show-checkbox node-key="id" :check-strictly='true' :default-expand-all='true' :props="defaultProps" @check-change="handleCheckChange"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size='mini' class="mini" @click="dialogVisible = false"><span>取 消</span></el-button>
        <el-button size='mini' class="mini" type="primary" @click="saveUserToGroup"><span>确 定</span></el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  props: [ 'roleId' ],
  data () {
    return {
      userId: 0,
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: '团队',
        }
      ],
      role: null,
      status: null,
      group: null,
      inputValue: '',
      roleList:[],
      statusList: [{value: 1,label: '申请中'}, {value: 2,label: '有效'}, {value: 3,label: '无效'}],
      resultArr: [],
      workerList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      multipleSelection: [],
      dialogVisible: false,
      groupId: [],
      groupData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: null,
      backTitle: ''
    })
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.userId = this.$cookies.get("userInfo").userId
    this.getRoles()
    this.getTreeGroup()
    this.getResultList()
  },
  methods: {
    // 获取所有角色
    getRoles () {
      this.httpPost('/team/role/list').then(res => {
        if (res.code === 0) {
          this.roleList = res.data
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    // 获取树形组
    getTreeGroup () {
      this.httpPost('/team/group/tree/'+ this.projectId).then(res => {
        if (res.code === 0) {
          this.groupData = res.data.treeGroup
          var treeValue = Object.keys(res.data.treeValue)
          this.groupData.forEach(item => {
            treeValue.forEach(tree => {
              if (item.id == +tree) {
                item.label = item.label + '('+ res.data.treeValue[tree] +')'
              }
            })
          })
          let resultArr = JSON.parse(JSON.stringify(this.groupData))
          resultArr.forEach(c1 => {
            c1.value = c1.id
            if (c1.children.length > 0) {
              c1.children.forEach(c2 => {
                c2.value = c2.id
                if (c2.children.length > 0) {
                  c2.children.forEach(c3 => {
                    c3.value = c3.id
                    c3.children = null
                  })
                } else {
                  c2.children = null
                }
              })
            } else {
              c1.children = null
            }
          })
          this.resultArr = resultArr
        }
      })
    },

    // 获取分组选中值
    getGroupKey (val) {
      this.group = val[val.length-1]
    },

    // 获取结果列表
    getResultList () {
      this.httpPost('/team/list/page', {
        "projectId": this.projectId,
        "role": this.role,
        "groupId": this.group,
        "status": this.status,
        "keyword": this.inputValue,
        "pageNum": this.currentPage,
        "pageSize": this.currentSize,
      }).then(res => {
        if (res.code == 0) {
          this.workerList = res.data.data
          this.currentPage = res.data.pageNum
          this.currentSize = res.data.pageSize
          this.total = res.data.total
          this.loading = false
        }
      })
    },

    // 同意
    agreeTeamUser(row) {
      this.$confirm('确定同意「'+ row.userName +'」加入团队吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          projectId: this.projectId
        }
        this.httpPost('/team/agree', params).then(res => {
          if (res.code === 0) {
            this.getResultList()
            this.$message({
              type: 'success',
              message: '同意成功!'
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

    // 禁用
    disableTeamUser(row) {
      this.$confirm('确定禁用「'+ row.userName +'」成员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          projectId: this.projectId
        }
        this.httpPost('/team/disable', params).then(res => {
          if (res.code === 0) {
            this.getResultList()
            this.$message({
              type: 'success',
              message: '同意成功!'
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
    //批量删除
    batchDelTeamUser() {
      let userIds = []
      if (this.multipleSelection.length == 0) {
        // 弹出错误信息
        this.$message.info("请选择移除的团队成员")
        return;
      }
      for(let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].userId == this.userId) {
          //  弹出错误信息
          this.$message.info("不可移除")
          return;
        }
        userIds.push(this.multipleSelection[i].userId)
      }
      this.$confirm('确定移除团队成员吗？, 是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          userIds: userIds,
          projectId: this.projectId
        }
        this.httpPost('/team/delete', params).then(res => {
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

    // 删除
    delTeamUser(row) {
      let userIds = []
      userIds.push(row.userId)
      this.$confirm('确定移除团队成员吗？, 是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          userIds: userIds,
          projectId: this.projectId
        }
        this.httpPost('/team/delete', params).then(res => {
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

    // 添加到组保存
    saveUserToGroup() {
      if (this.groupId.length <= 0) {
        this.$message({type: 'warning', message: '请选择分组'})
        return
      }
      let userToGroups = []
      for(let i = 0; i < this.multipleSelection.length; i++) {
        this.groupId.forEach((gItem, gIndex) => {
          let gObj = {}
          gObj.groupId = gItem
          gObj.id = null
          gObj.projectId = this.projectId
          gObj.userId = this.multipleSelection[i].userId
          userToGroups.push(gObj)
        })
      }
      let params = {
        projectId: this.projectId,
        userToGroups: userToGroups
      }
      this.httpPost('/team/group/user/save', params).then(res => {
        if (res.code === 0) {
          this.getResultList()
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.dialogVisible = false;
        }
      })

    },

    // 添加团队成员
    addTeamItem () {
      this.$router.push(`/team/create?id=${this.projectId}`)
    },
    // 编辑团队成员
    editTeamItem (row) {
      this.$router.push(`/team/create?id=${this.projectId}&tuId=${row.id}`)
    },
    // // 批量添加团队成员
    // batchAdd () {
    //   this.$router.push(`/team/import?id=${this.projectId}`)
    // },
    // 导出
    exportTeam () {
      this.$router.push(`/team/export?id=${this.projectId}`)
      let sIds = []
      let opt = 'A'
      let search = [];
      if (this.multipleSelection.length > 0) {
        opt = "C"
        this.multipleSelection.forEach(item => {
          sIds.push(item.id)
        })
      }
      this.$router.push({
        path: '/team/export',
        name: 'teamExport',
        query: {
          id: this.projectId,
          sIds: JSON.stringify(sIds),
          opt: opt,
          // search: JSON.stringify(search)
        },
        //TODO
        params: {
          status: this.status,
          groupId: this.group,
          role: this.role,
          keyword: this.inputValue,
          projectId: this.projectId
        }
      })
    },
    // 打开添加到组的弹框
    openGroup () {
      if (this.multipleSelection.length == 0) {
        // 弹出错误信息
        this.$message.info("请选择团队成员")
        return;
      }
      for(let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].groups > 0) {
          //  弹出错误信息
          this.$message.info("不可重复添加")
          return;
        }
      }
      this.dialogVisible = true
    },
    // 树形控件选中状态改变
    handleCheckChange (data, checked, indeterminate) {
      if (checked) {
        if (this.groupId.indexOf(data.id) == -1) {
          this.groupId.push(data.id)
        }
      } else if (!checked) {
        var index = this.groupId.indexOf(data.id)
        if (index > -1) {
          this.groupId.splice(index, 1);
        }
      }
    },
    // 分组管理
    groupManage () {
      this.$router.push(`/team/group?id=${this.projectId}`)
    },
    // 列表选择状态改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.currentSize = val
      this.getResultList()
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getResultList()
    },

  }
}
</script>

<style scoped>
  .nav>>>.el-table th, .el-table tr {
    background-color: #eee;
  }
  .nav>>>td {
    padding: 5px 0;
  }
  #team>>>.el-pagination span{
    font-size: 12px;
  }
  #team>>>.el-button--mini {
    padding: 6.5px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 3px;
  }
  #team>>>.el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 13px;
  }
  #team>>>.el-select .el-input .el-select__caret {
    color: #C0C4CC;
    font-size: 14px;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
    cursor: pointer;
    height: 29px;
  }
  .nav>>>.el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    font-size: 12px;
  }
  .nav>>>.el-form-item--small .el-form-item__label {
    line-height: 32px;
    font-size: 12px;
  }
  .workerForm>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #eee;
  }
  .nav>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang="scss" scoped>
  #team{
    div{
      overflow: hidden;
    }
    .lab{
      display: inline-block;
      width: 22px;
      line-height: 21px;
      text-align: center;
      height: 21px;
      margin-right: 2px;
      color: #fff;
      font-size: 12px;
      border-radius: 2px;
    }
    .lab1{
      @extend .lab;
      background-color: #8ed7f0;
    }
    .lab2{
      @extend .lab;
      background-color: #d3abec;
    }
    .lab3{
      @extend .lab;
      background-color: #f7a4bb;
    }
    .lab4{
      @extend .lab;
      background-color: #8fb8f0;
    }
    .teamTree{
      max-height: 360px;
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
    .add{
      margin: 0px 40px 20px 0;
      float: left;
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
    .fl{
      float: left;
      line-height: 32px;
      color: #555;
      font-size: 12px;
      span{
        font-size: 12px;
      }
    }
    .fr{
      float: right;
      line-height: 32px;
    }
    .w5{
      width: 73%;
    }
    .w9{
      width: 82%;
    }
    .search{
      margin: 0px 0 20px 0;
    }
    .searchHeight{
      line-height: 30px;
      .text{
        cursor: pointer;
        font-size: 12px;
      }
      span{
        color: #1486c6;
      }
    }
    .tag{
      display: inline-block;
      width: 54px;
      color: #fff;
      font-size: 11px;
      border-radius: 2px;
    }
    .tag1{
      @extend .tag;
      background-color: #77b936;
    }
    .tag2{
      @extend .tag;
      background-color: #ff7575;
    }
    .tag3{
      @extend .tag;
      background-color: #4b8ac5;
    }
    .cao{
      display: inline-block;
      margin-left: 8px;
      font-size: 12px;
      cursor: pointer;
    }
  }
</style>
