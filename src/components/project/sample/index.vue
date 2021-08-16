<!-- 访谈对象 -->
<template>
  <div id="smybelCreate">
    <div class="top-filter">
      <div class="filter-item">
        <label>状态：</label>
        <el-select v-model="status" size="mini" style="width: 120px;" @change="getList" clearable>
          <el-option v-for="(item, index) in principalList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <label>负责人：</label>
        <el-input v-model="managerName" size="mini" style="width: 150px;"></el-input>
      </div>
      <div class="filter-item">
        <label>关键词：</label>
        <el-input v-model="keyword" placeholder="输入关键字进行智能搜索" size="mini" style="width: 350px;"></el-input>
      </div>
      <div class="filter-item" v-if="!checked">
        <el-button type="primary" size="mini" class="mini" @click="getList"><span>搜索</span></el-button>
      </div>
      <div class="filter-item">
        <el-checkbox v-model="checked">样本筛选</el-checkbox>
      </div>
    </div>
    <!-- 样本筛选 -->
    <div v-if="checked" style="overflow:hidden;margin-top: 10px">
      <el-row>
        <el-form :hide-required-asterisk='true' label-position="left" size='mini' :model="searchForm" ref="searchForm" label-width="68px" class="demo-ruleForm">
          <el-col :span='24'>
            <el-form-item label="样本筛选 :">
              <div v-for="(cond,index) in sampleConditions" :key="index">
                <el-row style="margin-bottom: 10px">
                  <el-col :span="10">
                    <el-select v-model="cond.type" clearable placeholder="请选择样本属性" size="mini" style="width: 98%;">
                      <el-option v-for="(item, index) in sampleList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <el-select v-model="cond.option" placeholder="请选择关系" size="mini" clearable style="width: 98%;">
                      <el-option v-for="item in relativeList" :key="'re'+item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-input :maxlength="20" v-model="cond.content" placeholder="请输入" style="width: 98%;" size="mini" clearable></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-select @change="selectAndOr(cond, index, 'sample')" style="width: 100%;" v-model="cond.andOr" placeholder="请选择" size="mini" clearable v-if="cond.show">
                      <el-option
                        v-for="item in andOrs"
                        :key="'and'+item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span='2' style="margin: 0px 0 0 68px">
          <el-button type='primary' size='mini' class="mini" @click="getList" style="width: 100%"><span>搜索</span></el-button>
        </el-col>
        <el-col :span='2' style="margin: 0px 0 0 20px">
          <el-button type='primary' plain size='mini' class="mini" @click="clearText" style="width: 100%"><span>清空</span></el-button>
        </el-col>
      </el-row>
    </div>
    <div class="operation-wrapper">
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_ADD}" @click="addSample">
        <i class="iconfont">&#xe612;</i>
        <span>创建样本</span>
      </div>
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_ADD}" @click="batchAddtion">
        <i class="iconfont">&#xe641;</i>
        <span>批量添加</span>
      </div>
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_DELETE}" @click="batchDelSample && !isSample">
        <i class="iconfont">&#xe606;</i>
        <span>批量删除</span>
      </div>
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_EXPORT}" @click="exportSample">
        <i class="iconfont">&#xe629;</i>
        <span>批量导出</span>
      </div>
      <div @click="batchAssign">
        <i class="iconfont">&#xe6e9;</i>
        <span>批量分派</span>
      </div>
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_ASSIGN_ADMIN}" @click="assignAdmin">
        <i class="iconfont">&#xe600;</i>
        <span>分派给团队成员</span>
      </div>
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_ADD}" @click="combinedInterview">
        <i class="iconfont">&#xe60f;</i>
        <span>新建访谈</span>
      </div>
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_PROPERTY_ADMIN}" @click="propertyAdmin">
        <i class="iconfont">&#xe727;</i>
        <span>属性管理</span>
      </div>
    </div>
    <div class="search-wrapper">
      <el-table
        :data="memberData"
        size='small'
        v-loading='loading'
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align='center'></el-table-column>
        <el-table-column v-for="(item) in allPropertyNeed" min-width='140' :prop="item.key" :label="item.label" :key="item.key" :show-overflow-tooltip='true' align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[scope.column.property] }}</span>
            <!-- <span class="fs12">{{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '--'}}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" fixed="right" width='80'>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" class="fs10 init-btn">待分派</span>
            <span v-if="scope.row.status == 1" class="fs10 dispath-btn">待访谈</span>
            <span v-if="scope.row.status == 2" class="fs10 pending-btn">访谈中</span>
            <span v-if="scope.row.status == 3" class="fs10 success-btn">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width='100'>
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand" placement="bottom">
              <span class="fs12 cao">操作<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_VIEW}"><el-dropdown-item :command="{ type: 'detail', sId: scope.row.id }">详情</el-dropdown-item></span>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_EDIT}"><el-dropdown-item :command="{ type: 'edit', sId: scope.row.id }">编辑</el-dropdown-item></span>
                <span v-if="scope.row.status == 0" v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_ASSIGN_ADMIN}"><el-dropdown-item :command="{ type: 'dispatch', sId: scope.row.id }">分派</el-dropdown-item></span>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_ADD}"><el-dropdown-item command="new"><div @click="goCreateInterview(scope.row.id)">访谈列表</div></el-dropdown-item></span>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_DELETE}"><el-dropdown-item command="delete"><div @click="delSample(scope.row)" v-if="!isSample">删除</div></el-dropdown-item></span>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination" v-if="memberData.length > 0">
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
          name: '样本'
        }
      ],
      principalList: [
        {
          label: '待分派',
          value: '0'
        },
        {
          label: '待访谈',
          value: '1'
        },
        {
          label: '访谈中',
          value: '2'
        },
        {
          label: '已完成',
          value: '3'
        }
      ],
      checked: false,
      searchForm: {},
      // 样本筛选
      sampleConditions: [
        {                                               //筛选条件值集合
          type: '',                                     //字段值
          option: '',                                   //操作值
          andOr: '',                                    //逻辑值
          content:'',
          show: true
        }
      ],
      andOrs: [                                        //筛选条件逻辑属性
        {value:'and', label:'并且'},
        {value:'or', label:'或者'}
      ],
      sampleList: [],
      relativeList: [
        {value: '=', label: '等于'},
        {value: '>', label: '大于'},
        {value: '<', label: '小于'},
        {value: '!=', label: '不等于'},
        {value: 'like', label: '包含'},
        {value: 'not like', label: '不包含'}
      ],
      status: '',
      selectCollaborator: 'all',
      managerName:'',
      keyword: '',
      memberData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      selectIds:[],
      // allProperty: [], //全部属性
      listPorperty: null
    }
  },
  async created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '访谈对象',
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
    await this.getPropertyCheck()
    this.getMark()
  },
  computed: {
    ...mapState(['allProperty']),
    allPropertyNeed: function () {
      let list = []
      if (this.listPorperty == null) {
        list = this.allProperty
      } else if (this.listPorperty != null) {
        list = this.allProperty.filter(item => {
          return this.listPorperty.indexOf(item.key) != -1
        })
      }
      return list
    }
  },
  methods: {
    /*待分派筛选条件*/
    initCondition () {
      let cond = {
        type: '',
        option: '',
        andOr: '',
        content:'',
        show: true
      }
      return cond;
    },
    /*筛选条件动态增减*/
    selectAndOr (cond, index, item) {
      var tempList;
      tempList = this.sampleConditions
      if (cond.andOr != '') {
        for (let i = 0; i < tempList.length; i++){
            if (tempList[i].type == '' || tempList[i].option == '' || tempList[i].content == '') {
              if (index + 1 == tempList.length) {
                cond.andOr = '';
                this.$message.info('请完整填写第'+ (i+1) +'条筛选条件后可继续添加筛选条件！');
              }
              return;
            }
        }
        if (index < 3 && index != 1) {
          if (index + 1 == tempList.length) {
            this.sampleConditions.push(this.initCondition())
          }
        } else if (index == 1) {
          var condItem = {
            type: '',
            option: '',
            andOr: '',
            content:'',
            show: false
          }
          if (index + 1 == tempList.length) {
            this.sampleConditions.push(condItem)
          }
        }
      } else {
        for (let i = index + 1; i < tempList.length; i++){
          tempList.splice(i, 1);
          i--;
        }
      }
    },
    /*转换信息及筛选条件*/
    exchangeCondition (tempList){
      let condition = ''
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].content == '') {
          if (i != 0 && i + 1 == tempList.length){
            condition = condition.substring(0, condition.lastIndexOf(tempList[i-1].andOr));
          }
          continue;
        }
        if (tempList[i].type == '' || tempList[i].option == '') continue;
          condition += 's.'+tempList[i].type + " " + tempList[i].option;
        if (tempList[i].option == 'like' || tempList[i].option == 'not like') {
          condition += " '%" + tempList[i].content + "%' " + tempList[i].andOr + " ";
        } else {
          condition += " '" + tempList[i].content + "' " + tempList[i].andOr + " ";
        }
      }
      return condition
    },
    //获取样本属性
    getMark () {
      this.sampleList = []
      let _this = this
      this.httpPost(`/sample/property/get/${this.projectId}`).then(res => {
        if (res.code == 0) {
          if (res.data != null) {
            var mark = JSON.parse(res.data.markProperty)
            this.allProperty.forEach(item => {
              mark.forEach(ma => {
                if (item.key == ma && item.key != 'managerName') {
                  let obj = {}
                  obj.id = item.key
                  obj.name = item.label
                  this.sampleList.push(obj)
                }
              })
            })
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 清空
    clearText () {
      this.keyword = null
      this.status = null
      this.managerName = null
      this.sampleConditions = [
        {                                               //筛选条件值集合
          type: '',                                     //字段值
          option: '',                                   //操作值
          andOr: '',                                    //逻辑值
          content:'',
          show: true
        }
      ]
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
    // 查询协助者和负责人
    // getManager () {
      //   this.principalList = []
      //   this.xieList = []
      //   // this.httpPost('/sample/manager/'+ this.projectId).then(res => {
      //   this.httpPost('/sample/manager/1').then(res => {
      //     if (res.code == 0) {
      //       res.data.forEach(item => {
      //         if (item.type == 1) {
      //           let obj = {}
      //           obj.value = item.id
      //           obj.label = item.memberName
      //           this.principalList.push(obj)
      //         } else if (item.type == 2) {
      //           let obj = {}
      //           obj.value = item.id
      //           obj.label = item.memberName
      //           this.xieList.push(obj)
      //         }
      //       })
      //     } else {
      //       this.$message({type: 'error', message: res.message})
      //     }
      //   }).catch(error => {
      //     this.$message({type: 'error', message: error})
      //   })
    // },
    // 查询列表
    getList () {
      var sCon = null
      if (this.sampleConditions.length > 0) {
        sCon = this.exchangeCondition(this.sampleConditions)
      }
      this.loading = true
      let params = {
        "sampleCondition": sCon,
        "status": this.status,
        "keyword": this.keyword,
        "managerName": this.managerName,
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
        "projectId": this.projectId
      }
      let _this = this
      setTimeout(() => {
        _this.loading = false
      }, 100)
      this.httpPost('/sample/list', params).then(res => {
        if (res.code == 0) {
          this.memberData = res.data.data
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.pageNum = res.data.pageNum
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    //获取属性管理自定义的来展示表头
    getPropertyCheck () {
      this.httpPost(`/sample/property/check/${this.projectId}`).then(res => {
        if (res.code == 0) {
          this.listPorperty = JSON.parse(res.data.listProperty)
          this.getList()
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 创建研究对象
    addSample () {
      this.$router.push(`/sample/info?id=${this.projectId}`)
    },
    // 分派给团队成员
    assignAdmin () {
      let sIds = []
      let opt = 'A'
      let search = {};
      if (this.selectIds.length > 0) {
        opt = "C"
        this.selectIds.forEach(item => {
          sIds.push(item.id)
        })
      } else {
        search = {
          "status": this.status,
          "keyword": this.keyword,
          "managerName": this.managerName,
          "projectId": this.projectId
        }
      }
      this.$router.push({
        path: '/sample/assign',
        query: {
          id: this.projectId,
          sIds: JSON.stringify(sIds),
          opt: opt,
          search: search
        }
      })
    },
    // 批量导出
    exportSample () {
      let sIds = []
      let opt = 'A'
      let search = {};
      if (this.selectIds.length > 0) {
        opt = "C"
        this.selectIds.forEach(item => {
          sIds.push(item.id)
        })
      }
      this.$router.push({
        path: '/sample/export',
        name: 'SampleExport',
        query: {
          id: this.projectId,
          sIds: JSON.stringify(sIds),
          opt: opt
        },
        // TODO
        params: {
          status: this.status,
          keyword: this.keyword,
          managerName: this.managerName,
          projectId: this.projectId
        }
      })
    },
    // 批量分派
    batchAssign () {
      this.$router.push({
        path: '/sample/batch/assign',
        query: {
          id: this.projectId,
        }
      })
    },
    // 批量上传分派
    updateAssign () {
      this.$router.push(`/sample/assign/import?id=${this.projectId}`)
    },
    // 批量添加
    batchAddtion () {
      this.$router.push(`/sample/import?id=${this.projectId}`)
    },
    // 属性管理
    propertyAdmin () {
      this.$router.push(`/sample/property?id=${this.projectId}`)
    },
    // 新建小组访谈
    combinedInterview () {
      if (this.selectIds.length <= 0) {
        this.$router.push({
          path: '/talk/create',
          query: {
            id: this.projectId,
          }
        })
      } else {
        var sIds = []
        var mId = this.selectIds[0].managerId
        for (let index = 0; index < this.selectIds.length; index++) {
          if ((this.selectIds[index].status == 0 || this.selectIds[index].status == 2) || !this.selectIds[index].managerId || this.selectIds[index].managerId != mId) {
            this.$message({type: 'warning', message: '样本需分派后才能创建访谈，多个样本同时创建须负责人一致'})
            return
          } else {
            sIds.push(this.selectIds[index].id)
          }
        }
        this.$router.push({
          path: '/talk/create',
          query: {
            id: this.projectId,
            sIds: JSON.stringify(sIds),
          }
        })
      }
    },

    // 查看访谈列表
    goCreateInterview (id) {
      this.$router.push({path: '/talk', query: {id: this.projectId, sId: id}})
    },

    //下拉点击事件
    handleCommand (command) {
      let type = command.type
      let id = this.projectId
      //详情
      if (type == 'detail') {
        this.$router.push({
          path: '/sample/info',
          query: {
            type: 'v',
            sId: command.sId,
            id: id
          }
        })
      }
      //编辑
      if (type == 'edit') {
        this.$router.push({
          path: '/sample/info',
          query: {
            type: 'e',
            sId: command.sId,
            id: id
          }
        })
      }
      //分派
      if (type == 'dispatch') {
        let sIds = []
        sIds.push(command.sId)
        let opt = 'C'
        this.$router.push({
          path: '/sample/assign',
          query: {
            id: this.projectId,
            sIds: JSON.stringify(sIds),
            opt: opt
          }
        })
      }
    },

    batchDelSample() {
      let sIds = []
      if (this.selectIds.length == 0) {
        // 弹出错误信息
        return;
      }
      for(let i = 0; i < this.selectIds.length; i++) {
        sIds.push(this.selectIds[i].id)
      }
      this.$confirm('确定移除样本吗？, 是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          sampleIds: sIds,
          projectId: this.projectId
        }
        this.httpPost('/sample/delete', params).then(res => {
          if (res.code === 0) {
            this.getList()
            this.$message({
              type: 'success',
              message: '移除成功!'
            });
          }
        })
      })
    },

    // 删除
    delSample(row) {
      let sIds = []
      sIds.push(row.id)
      this.$confirm('确定移除样本吗？, 是否移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          sampleIds: sIds,
          projectId: this.projectId
        }
        this.httpPost('/sample/delete', params).then(res => {
          if (res.code === 0) {
            this.getList()
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
    //列表选择
    handleSelectionChange(val) {
      this.selectIds = val;
    }
  }
}
</script>

<style scoped>
  #smybelCreate>>>.el-table th, .el-table tr {
    background-color: #eee;
  }
  #smybelCreate>>>.el-table .cell.el-tooltip span{
    font-size: 12px;
  }
  #smybelCreate>>>.el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 32px;
    font-size: 12px;
  }
  #smybelCreate>>>.el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
  #smybelCreate>>>.el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px;
  }
  #smybelCreate>>>.el-pagination span{
    font-size: 12px;
  }
  #smybelCreate>>>.el-button--mini {
    padding: 6.5px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 3px;
  }
  #smybelCreate>>>.el-select .el-input .el-select__caret {
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
  #smybelCreate>>>.el-table th, .el-table td {
    padding: 7px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
}
  #smybelCreate>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #eee;
  }
  #smybelCreate>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang='scss' scoped>
.top-filter {
  display: flex;
}
.cao{
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  cursor: pointer;
}
.filter-item {
  margin-right: 10px;
  display: flex;
  align-items: center;
  label {
    color: #444;
    font-size: 12px;
    width: 68px;
    min-width: 50px;
  }
}
.serach-text {
  color: #1486c6;
}
.operation-wrapper {
  color: #2e83d3;
  display: flex;
  div {
    margin-right: 25px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      margin-right: 8px;
    }
    span {
      font-weight: 500
    }
    .iconfont {
      font-weight: bold
    }
  }
}
.search-wrapper {
  margin-top: 30px;
}
.init-btn {
  padding: 4px 8px;
  color: #ffffff;
  font-size: 12px;
  background: #4b8ac5;
}
.pending-btn {
  @extend .init-btn;
  background: #ea913a;
}
.dispath-btn {
  @extend .init-btn;
  background: #1db0cf;
}
.success-btn {
  @extend .init-btn;
  background: #77b936;
}
</style>
