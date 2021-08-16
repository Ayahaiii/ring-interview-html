<template>
  <div id="addTeam">
    <!-- 表单 -->
    <div class="teamList">
      <el-form :model="teamForm" size='mini' :hide-required-asterisk='true' label-position="left" :rules="rules" ref="teamForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="团队成员 :" prop="userList">
          <div v-if="opt == 'ADD'">
            <el-input v-model="keyword" style="width: 40%" @change="searchUser" placeholder='输入需要添加的成员名称、邮箱、手机号'></el-input>
            <span v-if="isShowMessage" style='color: #F56C6C; margin-left: 10px; font-size: 12px'>未找到此用户，对方可能尚未注册</span>
          </div>
          <ul class="list" v-if="userList.length > 0">
            <li v-for="(item, index) in userList" :key="'user'+index"><span class="iconfont">&#xe6de;</span>{{ item.name }}<span></span>
              <i v-if="opt == 'ADD'" class="el-icon-error" @click="delUser(item.id)"></i>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="角色 :" prop="roles">
          <el-checkbox-group v-model="teamForm.roles" @change='checkBoxChange'>
            <el-checkbox v-for="(item, index) in roleGroup" :key="'role'+index" :label='item.id' :name='""+item.id'>{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分组 :">
          <div style="width: 40%" v-if="groupData.length != 0">
            <el-tree class="group"
                     :check-strictly='true'
                     :default-expand-all='true'
                     :data="groupData"
                     show-checkbox
                     node-key="id"
                     :props="defaultProps"
                     :default-checked-keys="oldGroupId"
                     @check-change="handleCheckChange"></el-tree>
          </div>
          <div v-else class="no-data-tree">
            <span @click="goTeamManage">点击前往分组管理</span>
          </div>
        </el-form-item>
        <el-form-item label="授权类型 :" prop="authType">
          <el-select v-model="teamForm.authType" clearable placeholder="请选择授权类型" style="width: 30%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权日期 :" v-if="teamForm.authType == 2">
            <el-form-item prop="authDate">
              <el-date-picker type="date"
                              placeholder="选择授权日期"
                              v-model="teamForm.authDate"
                              format="yyyy-MM-dd"
                              style="width: 30%"
                              :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button :disabled='isSample' v-if="opt == 'ADD'" v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_ADD}" type="primary" @click="addForm('teamForm')" style="width: 100px" class="mini"><span>添加</span></el-button>
          <el-button :disabled='isSample' v-else v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_EDIT}" type="primary" @click="saveForm('teamForm')" style="width: 100px" class="mini"><span>保存</span></el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var validateUserList = (rule, value, callback) => {
      setTimeout(() => {
        if (!this.keyword) {
          callback()
        } else if (this.isShowMessage && this.userList.length <= 0) {
          return callback(new Error('请添加团队成员'));
        } else if (this.userList.length <= 0) {
          return callback(new Error('请添加团队成员'));
        } else {
          callback()
        }
      }, 500);
    };
    var validateRoleList = (rule, value, callback) => {
      setTimeout(() => {
        if (this.roleGroup.length <= 0) {
          return callback(new Error('请选择需要添加的分组'));
        } else {
          callback()
        }
      }, 500);
    };
    return {
      opt: "ADD",
      isShowMessage: false,
      teamUserId: null,
      projectId: null,
      isSample: false,
      keyword: null,
      groupId: [],
      oldGroupId: [],
      roleGroup: [],
      teamUsers: [],
      breadcrumbList: [{  name: '团队',  path: '/team'}, {  name: '添加团队成员',}],
      userList: [],
      options: [{value: 1,label: '永久'}, {value: 2,label: '指定有效期'}],
      oldRoles: [],
      teamForm: {
        userList: [],
        roles: [5],
        authType: null,
        authDate: '',
      },
      rules: {
        userList: [{ validator: validateUserList, trigger: 'blur'}],
        authType: [{ required: true, message: '请选择授权类型', trigger: 'change' }],
        roles: [{ validator: validateRoleList, trigger: 'change' }],
        authDate: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
      },
      groupData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pickerOptions:{
        disabledDate(time){
          let now = Date.now()
          let one = 24 * 60 * 60 * 1000
          return time.getTime() < (now - one)
        }
      }
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/team',
      backTitle: '团队列表'
    })
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.teamUserId = this.$route.query.tuId
    if (this.teamUserId) {
      this.opt = "EDIT"
      this.getUserInfo()
    } else {
      this.getTreeGroup()
    }
    this.getRoles()
  },
  methods: {

    // 返回团队列表
    goteamList () {
      this.$router.push('/team')
    },

    // 获取所有角色
    getUserInfo () {
      this.httpPost('/team/get', {
        id: this.teamUserId,
        projectId: this.projectId
      }).then(res => {
        if (res.code === 0) {
          let temp = res.data
          this.userList.push({
            id: temp.userId,
            name: temp.name
          })
          this.teamForm.roles = []
          for (let i = 0; i < temp.roles.length; i++) {
            this.teamForm.roles.push(temp.roles[i].roleId)
            this.oldRoles.push(temp.roles[i].roleId);
          }
          for (let i = 0; i < temp.groups.length; i++) {
            if (temp.groups[i] != null) {
              this.groupId.push(temp.groups[i].groupId)
              this.oldGroupId.push(temp.groups[i].groupId)
            }
          }
          this.teamForm.authType = temp.authType
          if (temp.authDate) {
            this.teamForm.authDate = new Date(temp.authDate)
          } else {
            this.teamForm.authDate = ''
          }
          this.getTreeGroup()
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    // 获取所有角色
    getRoles () {
      this.httpPost('/team/role/list').then(res => {
        if (res.code === 0) {
          this.roleGroup = res.data
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 查询团队用户
    searchUser () {
      if (this.keyword) {
        this.httpPost('/user/find', {keyword: this.keyword}).then(res => {
          if (res.code === 0) {
            if (res.data) {
              this.isShowMessage = false
              if (this.userList.length == 0){
                this.userList.push(res.data)
              } else {
                let ids = []
                this.userList.forEach(item => {
                  ids.push(item.id)
                })

                if (ids.indexOf(res.data.id) == -1) {
                  this.userList.push(res.data)
                } else {
                  this.$message({type: 'warning', message: '不可重复添加组员'})
                }
              }
            } else {
              this.isShowMessage = true
            }
          }
        }).catch(error => {
          this.$message({type: 'error', message: error})
        })
      } else {
        return
      }
    },
    // 获取树形组
    getTreeGroup () {
      this.httpPost('/team/group/tree/'+ this.projectId).then(res => {
        if (res.code === 0) {
          this.groupData = res.data.treeGroup
        }
      })
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
    // 多选框变化
    checkBoxChange (res) {
    },
    // 删除团队成员
    delUser (id) {
      let ids = []
      this.userList.forEach(item => {
       ids.push(item.id)
      })
      var index = ids.indexOf(id)
      if (index > -1) {
        this.userList.splice(index, 1);
      }
      this.keyword = null
    },
    // 添加
    addForm (formName) {
      if (this.userList.length <= 0) {
        this.$message({type: 'warning', message: '团队成员不能为空'})
        return
      }
      if (this.teamForm.roles.length <= 0) {
        this.$message({type: 'warning', message: '角色不能为空'})
        return
      }
      // if (this.groupId.length <= 0) {
      //   this.$message({type: 'warning', message: '分组不能为空'})
      //   return
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.teamUsers = []
          this.userList.forEach((item, index) => {
            let obj = {}
            obj.authDate = this.teamForm.authDate
            obj.authType = this.teamForm.authType
            if (this.teamForm.authType == 1) {
              obj.authDate = null
            }
            obj.delGroupIds = null
            obj.delRoleIds = null
            obj.id = null
            obj.projectId = this.projectId
            obj.userId = item.id
            obj.groups = []
            obj.roles = []
            this.groupId.forEach((gItem, gIndex) => {
              let gObj = {}
              gObj.groupId = gItem
              gObj.id = null
              gObj.projectId = this.projectId
              gObj.userId = item.id
              obj.groups.push(gObj)
            })
            this.teamForm.roles.forEach(rItem => {
              let rObj = {}
              rObj.id = null
              rObj.projectId = this.projectId
              rObj.roleId = rItem
              rObj.userId = item.id
              obj.roles.push(rObj)
            })
            this.teamUsers.push(obj)
          })
          let params = {
            teamUsers: this.teamUsers,
            projectId: this.projectId
          }
          this.httpPost('/team/save', params).then(res => {
            if (res.code === 0) {
              let resArr = res.data
              if (resArr.length <= 0) {
                this.$message({type: 'success', message: res.message})
                this.$router.push(`/team?id=${this.projectId}`)
              } else {
                let name = ""
                this.userList.forEach(item => {
                  resArr.forEach(a => {
                    if (item.id == a) {
                      name += item.name +"，"
                    }
                  })
                })
                this.$confirm(`成员${name}重复添加，是否跳转到团队列表`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push(`/team?id=${this.projectId}`)
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }
            } else {
              this.$message({type: 'error', message: res.message})
            }
          }).catch(error => {
            this.$message({type: 'error', message: error})
          })
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 保存
    saveForm(formName) {
      if (this.teamForm.roles.length <= 0) {
        this.$message({type: 'warning', message: '角色不能为空'})
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.teamUsers = []
          this.userList.forEach((item, index) => {
            let obj = {}
            obj.authDate = this.teamForm.authDate
            obj.authType = this.teamForm.authType
            if (this.teamForm.authType == 1) {
              obj.authDate = null
            }
            obj.delRoleIds = []
            this.oldRoles.forEach(rItem => {
              if (this.teamForm.roles.indexOf(rItem) == -1) {
                obj.delRoleIds.push(rItem)
              }
            })
            obj.delGroupIds = []
            this.oldGroupId.forEach((gItem, gIndex) => {
              if (this.groupId.indexOf(gItem) == -1) {
                obj.delGroupIds.push(gItem)
              }
            })
            obj.id = this.teamUserId
            obj.projectId = this.projectId
            obj.userId = item.id
            obj.groups = []
            obj.roles = []
            this.groupId.forEach((gItem, gIndex) => {
              if (this.oldGroupId.indexOf(gItem) == -1) {
                let gObj = {}
                gObj.groupId = gItem
                gObj.id = null
                gObj.projectId = this.projectId
                gObj.userId = item.id
                obj.groups.push(gObj)
              }
            })
            this.teamForm.roles.forEach(rItem => {
              if (this.oldRoles.indexOf(rItem) == -1) {
                let rObj = {}
                rObj.id = null
                rObj.projectId = this.projectId
                rObj.roleId = rItem
                rObj.userId = item.id
                obj.roles.push(rObj)
              }
            })
            this.teamUsers.push(obj)
          })
          let params = {
            teamUsers: this.teamUsers,
            projectId: this.projectId
          }
          this.httpPost('/team/save', params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.$router.push(`/team?id=${this.projectId}`)
            } else {
              this.$message({type: 'error', message: res.message})
            }
          }).catch(error => {
            this.$message({type: 'error', message: error})
          })
        } else {
          return false;
        }
      });
    },
    // 去分组管理
    goTeamManage () {
      this.$router.push(`/team/group?id=${this.projectId}`)
    }
  }
}
</script>

<style scoped>
  #addTeam>>>.el-button--mini {
    padding: 6px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 0px;
  }
  #addTeam>>>.el-form--label-left .el-form-item__label {
    text-align: left;
    font-size: 12px;
  }
  #addTeam>>>.el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 12px;
  }
  #addTeam>>>.el-tree-node__label{
    font-size: 12px;
  }
</style>
<style lang="scss" scoped>
  #addTeam{
    div{
      overflow: hidden;
    }
    .teamList{
      margin: 0px 0 20px 0px;
      .list{
        width: 100%;
        border: 1px solid #9ecdde;
        background-color: #E1EFF4;
        min-height: 50px;
        overflow: hidden;
        margin: 20px 0;
        padding: 0 10px 10px;
        li{
          float: left;
          padding: 1px 10px;
          margin-right: 30px;
          margin-top: 10px;
          position: relative;
          line-height: 30px;
          font-size: 12px;
          box-sizing: border-box;
          .iconfont{
            color: #9abfcc;
            display: inline-block;
            font-size: 20px;
            margin-right: 8px;
            vertical-align: middle;
          }
          i{
            position: absolute;
            right: -15px;
            top: 11px;
            font-size: 14px;
            width: 15px;
            height: 15px;
            color: #F96C6E;
          }
        }
      }
      .group{
        width: 100%;
        padding: 10px;
        max-height: 350px;
        overflow: auto;
        background-color: #f7f7f7;
        border: 1px solid #eee;
      }
      /*滚动条样式*/
      .group::-webkit-scrollbar {
        width: 5px;
      }
      .group::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #ccc;
      }
      .group::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: #eee;
      }
      .no-data-tree {
        width: 40%;
        height: 80px;
        background-color: #f7f7f7;
        border: 1px solid #eee;
        line-height: 80px;
        text-align: center;
        color: #909399;
        span {
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
</style>
