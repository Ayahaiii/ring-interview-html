<!-- 首页 -->
<template>
  <div id="indexBox">
    <!-- 提示文案 -->
    <el-alert v-if="ifRenew" title="您的云访谈研究工具使用权限还有30天即将到期，您可以点此续费。" type="warning" effect="dark" class="tip hidden-xs-only"></el-alert>
    <!-- 筛选条件 -->
    <!-- 面包屑 -->
    <div class="brand hidden-xs-only">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><span class="iconfont">&#xe605;</span>我的访谈</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="nav">
      <el-row style="margin-bottom: 20px" class="mobel-search">
        <el-col :xs="7" :sm="4" :md="4" :lg="4" :xl="4" class="mr10">
          <el-select size='small' v-model="userType" placeholder="请选择项目" @change="submitForm(null)">
            <el-option v-for="item in userTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="16" :sm="9" :md="9" :lg="9" :xl="9" class="mr10 mr0">
          <el-input class="mobel-input" size='small' placeholder="输入关键字进行智能搜索" v-model="keyword" @change='submitForm(null)'><template slot="append"><i class="el-icon-search" @click='submitForm(null)'></i></template></el-input>
        </el-col>
        <el-col :span='4' class="hidden-xs-only">
          <div class="searchHeight">
            <span class="text" @click="checkSearchType">{{ searchText }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px" v-if="searchType == 'advanced'">
        <el-form :hide-required-asterisk='true' label-position="left" size='small' :model="searchForm" ref="searchForm" label-width="80px" class="demo-ruleForm">
          <el-row>
            <el-col :span='8'>
              <el-form-item label="项目名称 :">
                <el-input v-model="searchForm.name" placeholder="请输入项目名称" style="width: 90%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label="项目类型 :">
                <el-select v-model="searchForm.type" placeholder="请选择项目类型" style="width: 90%;">
                  <el-option label="个案访谈" value="1"></el-option>
                  <el-option label="焦点小组" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label="项目状态 :">
                <el-select size='small' v-model="searchForm.status" clearable placeholder="请选择项目状态" style="width: 90%;">
                  <el-option v-for="item in projectStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <el-form-item label="项目标签 :">
                <el-input v-model="searchForm.labelText" style="width: 90%;" placeholder="请输入项目标签"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8' style="height: 44.5px">
              <el-form-item label="创建者 :">
                <el-input v-model="searchForm.userName" size='small' placeholder="请输入创建者" style="width: 90%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label="创建时间 :">
                <el-date-picker  v-model="searchForm.createTime"  type="daterange"  range-separator="-"  start-placeholder="开始日期"  end-placeholder="结束日期" style="width: 90%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <el-form-item label="启动时间 :">
                <el-date-picker  v-model="searchForm.beginDate"  type="daterange"  range-separator="-"  start-placeholder="开始日期"  end-placeholder="结束日期" style="width: 90%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label="停止时间 :">
                <el-date-picker  v-model="searchForm.endDate"  type="daterange"  range-separator="-"  start-placeholder="开始日期"  end-placeholder="结束日期" style="width: 90%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='24'>
              <el-form-item>
                <el-button type="primary" class='mini' size='mini' @click="submitForm('searchForm')"><span class='mini'>搜索</span></el-button>
                <el-button size='mini' class='mini' @click="clearForm('searchForm')"><span class='mini'>清空</span></el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <!-- 新建访谈项目/项目标签管理 -->
      <div class="hidden-xs-only">
        <el-row>
          <el-col :xs="6" :sm="4" :md="4" :lg="3" :xl="3"><div class="add"><span class="iconfont fw">&#xe64b;</span><span @click="goAddProject">创建访谈项目</span></div></el-col>
          <el-col :xs="6" :sm="4" :md="4" :lg="3" :xl="3"><div class="add"><span class="iconfont fw">&#xe633;</span><span @click="dialogVisible = true">申请参与访谈项目</span></div></el-col>
          <el-col v-if="false" :xs="12" :sm="16" :md="16" :lg="18" :xl="18"><div class="add right" @click="goDeleted"><span class="iconfont fw">&#xe606;</span><span>回收站</span></div></el-col>
        </el-row>
      </div>
      <!-- 列表 -->
      <div>
        <el-table ref="workerList"
        :data="workerList"
        class="workerForm hidden-xs-only"
        size='small'
        :cell-style='cellStyle'
        :header-cell-style='headerCellStyle'
        v-loading='loading'
        style="width: 100%">
          <el-table-column label="项目名称" prop='name' align='left' width='150'>
            <template slot-scope="scope">
              <div style="text-align: left;"><span class="fs12">{{ scope.row.name }}</span></div>
            </template>
          </el-table-column>
          <el-table-column label="项目类型" prop='typeId' align='center' width='110'>
            <template slot-scope="scope">
              <span class="fs12" v-if="scope.row.typeId == 1">个案访谈</span>
              <span class="fs12" v-else>焦点小组</span>
            </template>
          </el-table-column>
          <el-table-column label="项目标签" prop='labelText' align='center' width='160'>
            <template slot-scope="scope">
              <div v-if="scope.row.labelText"><span class="fs12">{{ scope.row.labelText }}</span></div>
              <div v-else><span>--</span></div>
            </template>
          </el-table-column>
          <el-table-column label="我的角色" prop='roleName' align='center' width='130'>
            <template slot-scope="scope">
              <div style="text-align: left">
                <span v-if="scope.row.roleName.indexOf('管理员') != -1" class="fs12 dao2">管</span>
                <span v-if="scope.row.roleName.indexOf('督导员') != -1" class="fs12 dao3">督</span>
                <span v-if="scope.row.roleName.indexOf('分析员') != -1" class="fs12 dao4">析</span>
                <span v-if="scope.row.roleName.indexOf('访问员') != -1" class="fs12 dao1">访</span>
                <span v-if="scope.row.roleName.indexOf('管理员') == -1 && scope.row.roleName.indexOf('督导员') == -1 && scope.row.roleName.indexOf('分析员') == -1 && scope.row.roleName.indexOf('访问员') == -1">--</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建者" prop='userName' align='center' width='90'></el-table-column>
          <el-table-column label="创建时间" align='center' width='140'>
            <template slot-scope="scope">
              <span class="fs12">{{ scope.row.createTimeStr || scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align='center' width='140'>
            <template slot-scope="scope">
              <span class="fs12">{{ scope.row.updateTimeStr || scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop='status' align='center' width='80'>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0" class="tag1">准备中</span>
              <span v-if="scope.row.status == 1" class="tag2">已启动</span>
              <span v-if="scope.row.status == 2" class="tag3">已暂停</span>
              <span v-if="scope.row.status == 3" class="tag3">已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align='center' width='180'>
            <template slot-scope="scope">
              <span class="cao" v-if="scope.row.role.indexOf('PROJECT_VIEW') != -1 || scope.row.role == Constant.R_ALL" @click="goProjectDetail(scope.row.id)">详情</span>
              <span class="cao" v-if="scope.row.role.indexOf('INTERVIEW_LIST') != -1 || scope.row.role == Constant.R_ALL" @click="goInterview(scope.row.id)">访谈</span>
              <el-dropdown placement="bottom">
                <span class="el-dropdown-link cao">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><div v-if="scope.row.role.indexOf('SAMPLE_LIST') != -1 || scope.row.role == Constant.R_ALL" @click="goSample(scope.row.id)">样本</div></el-dropdown-item>
                  <el-dropdown-item><div v-if="scope.row.role.indexOf('MEMBER_LIST') != -1 || scope.row.role == Constant.R_ALL" @click="goTeam(scope.row.id)">团队</div></el-dropdown-item>
                  <el-dropdown-item><div v-if="scope.row.role.indexOf('STAT_LIST') != -1 || scope.row.role == Constant.R_ALL" @click="goAnalyst(scope.row.id)">分析</div></el-dropdown-item>
                  <el-dropdown-item><div v-if="scope.row.role.indexOf('MONITOR_LIST') != -1 || scope.row.role == Constant.R_ALL" @click="goMonitor(scope.row.id)">报表</div></el-dropdown-item>
                  <el-dropdown-item><div v-if="scope.row.role == Constant.R_ALL" @click="doDelete(scope.row.id)">删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <!-- 手机列表 -->
        <div class="mobel-list hidden-sm-and-up">
          <div class="mobel-Box" v-for="(item, index) in workerList" :key="'work'+index">
            <el-row>
              <el-col :span='20'>
                <div class="mobel-left">
                  <div class="li tit">{{ item.name }}</div>
                  <div class="li col">{{ item.labelText }}</div>
                </div>
              </el-col>
              <el-col :span='4'>
                <div class="mobel-right">
                  <div>
                    <span v-if="item.status == 0" class="tag1">准备中</span>
                    <span v-if="item.status == 1" class="tag2">已启动</span>
                    <span v-if="item.status == 2" class="tag3">已暂停</span>
                    <span v-if="item.status == 3" class="tag3">已结束</span>
                    <i v-if="item.role.indexOf('PROJECT_VIEW') != -1 || item.role == Constant.R_ALL" @click="goProjectDetail(item.id)" class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <div class="mobel-bottom">
                <el-col :span='8'><div><span class="col">角色：{{ item.roleName}}</span></div></el-col>
                <el-col :span='6'><div><span class="col">创建者：{{ item.userName }}</span></div></el-col>
                <el-col :span='10'><div class="time"><span class="col">创建时间：{{ item.createTimeStr || item.createTime }}</span></div></el-col>
              </div>
            </el-row>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="workerList.length > 0" >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="currentSize"
            layout="total, sizes, prev, pager, next"
            :total='total'
            hide-on-single-page
          >
          </el-pagination>
        </div>

        <!-- 对话框 -->
        <el-dialog title="申请加入项目" width='30%' :visible.sync="dialogVisible">
          <div>
            <el-form>
              <el-form-item label="项目邀请码 :">
                <el-input v-model="invitedCode" style="width: 70%;" placeholder="请输入项目邀请码" size="mini"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button size='mini' class="mini" @click="dialogVisible = false"><span>取 消</span></el-button>
            <el-button size='mini' class="mini" type="primary" @click="applyProject"><span>确 定</span></el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      searchType: 'base',
      searchText: '高级搜索',
      ifRenew: false,   //是否续费
      userType: 0,
      projectType: null,
      keyword: '',
      userTypeList: [{value: 0,label: '所有项目'}, {value: 1,label: '我创建的项目'}, {value: 2,label: '我参与的项目'}],
      projectTypeList:[{value: 1,label: '个案访谈'}, {value: 2,label: '焦点小组'}],
      projectStatusList: [{value: 0,label: '准备中'}, {value: 1,label: '已启动'}, {value: 2,label: '已暂停'}, {value: 3,label: '已结束'}],
      searchForm: {
        name: null,
        status: null,
        labelText: null,
        userName: null,
        createTime: null,
        beginDate: null,
        endDate: null
      },
      workerList: [],
      currentPage: 1,
      currentSize: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      invitedCode:''
    }
  },
  created () {
    this.getProjectList()
  },
  computed: {
    ...mapState(['permission'])
  },
  methods: {
    ...mapMutations(['setPermission']),
    // 获取项目列表
    getProjectList () {
      this.httpPost('/project/list/page', {
        "pageNum": this.currentPage,
        "pageSize": this.currentSize,
      }).then(res => {
        if (res.code == 0) {
          this.workerList = res.data.data
          this.currentPage = res.data.pageNum
          this.currentSize = res.data.pageSize
          this.total = res.data.total
        }
      })
    },

    // 删除项目
    doDelete (id) {
      this.$confirm('确定删除项目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.httpPost('/project/delete/' + id).then(res => {
          if (res.code === 0) {
            this.getProjectList()
            this.$message({
              type: 'success',
              message: '删除成功!'
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

    goAddProject () {
      this.$router.push('/project/create')
    },
    goDeleted () {

    },
    goProjectDetail (id) {
      this.$router.push(`/project/info?id=${id}`)
    },
    goSample (id) {
      this.$router.push(`/sample?id=${id}`)
    },
    goTeam (id) {
      this.$router.push(`/team?id=${id}`)
    },
    goInterview (id) {
      this.$router.push(`/talk?id=${id}`)
    },
    goAnalyst (id) {
      this.$router.push(`/analysis/index?id=${id}`)
    },
    goMonitor (id) {
      this.$router.push(`/report?id=${id}`)
    },
    // 切换高级搜索类型
    checkSearchType () {
      if (this.searchText == '高级搜索') {
        this.searchType = 'advanced'
        this.searchText = '基本搜索'
      } else if (this.searchText == '基本搜索') {
        this.searchType = 'base'
        this.searchText = '高级搜索'
      }

    },

    // 申请项目
    applyProject() {
      if (this.invitedCode == '') {
        // 错误信息
        return
      }
      let params = {
        projectId: '',
        inviteCode: this.invitedCode
      }
      this.httpPost('/project/apply', params).then(res => {
        if (res.code === 0) {
          this.getProjectList()
          this.$message({
            type: 'success',
            message: '申请成功，项目拥有者审核通过后项目可见'
          });
          this.dialogVisible = false;
        }
      })
    },


    submitForm(formName) {
      if (!formName) {
        var params;
        params = {
          userType: this.userType,
          keyword: this.keyword,
        }
      } else {
        params = this.searchForm
        params.pageNum = this.currentPage
        params.pageSize = this.currentSize
      }
      params.searchType = this.searchType
      this.httpPost('/project/list/page', params).then(res => {
        if (res.code == 0) {
          this.workerList = res.data.data
          this.currentPage = res.data.pageNum
          this.currentSize = res.data.pageSize
          this.total = res.data.total
        }
      })
    },
    clearForm(formName) {
      this.searchForm = {
        name: null,
        status: null,
        labelText: null,
        userName: null,
        createTime: null,
        beginDate: null,
        endDate: null
      }
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.currentSize = val
      this.getProjectList()
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProjectList()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return `padding: 0 0 0 10px`;
      } else {
        return ''
      }
    },
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return `padding: 0 0 0 10px`;
      } else {
        return ''
      }
    },
  }
}
</script>

<style scoped>
  .nav>>>.el-table th, .el-table tr {
    background-color: #eee;
  }
  .nav>>>.el-button+.el-button {
    margin-left: 0px;
  }
  .nav>>>.el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
  }
  .workerForm>>>.el-button--mini {
    padding: 5px 15px;
    font-size: 12px;
    border-radius: 3px;
  }
  .nav>>>.el-form-item--small .el-form-item__label {
    line-height: 32px;
    font-size: 12px;
  }
  .nav>>>.el-form-item--small.el-form-item {
    margin-bottom: 12px;
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
  .dao{
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
  .dao1{
    @extend .dao;
    background-color: #8ed7f0;
  }
  .dao2{
    @extend .dao;
    background-color: #8fb8f0;
  }
  .dao3{
    @extend .dao;
    background-color: #d3abec;
  }
  .dao4{
    @extend .dao;
    background-color: #f7a4bb;
  }
</style>
