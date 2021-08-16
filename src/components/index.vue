<!-- 首页 -->
<template>
  <div id="indexBox">
    <!-- 提示文案 -->
    <el-alert v-if="ifRenew" title="您的云访谈研究工具使用权限还有30天即将到期，您可以点此续费。" type="warning" effect="dark" class="tip"></el-alert>
    <!-- 筛选条件 -->
    <div class="nav">
      <el-row :gutter="10">
        <el-col :span='4'>
          <el-select size='small' v-model="project" clearable placeholder="请选择项目">
            <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span='3'>
          <el-select size='small' v-model="projectType" clearable placeholder="请选择项目类型">
            <el-option v-for="item in projectTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span='3'>
          <el-select size='small' v-model="projectStatus" clearable placeholder="请选择项目状态">
            <el-option v-for="item in projectStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span='7'>
          <el-input size='small' placeholder="输入项目ID、名称、标签或创建者进行智能搜索" v-model="inputVaule" clearable></el-input>
        </el-col>
        <el-col :span='2'>
          <el-button type='primary' size='mini' class='mini'><span class='mini'>搜索</span></el-button>
        </el-col>
        <el-col :span='4'>
          <div class="searchHeight"><span class="text">高级搜索</span><span> / </span><span class="text">基本搜索</span></div>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px">
        <el-form :hide-required-asterisk='true' label-position="left" size='small' :model="searchForm" :rules="rules" ref="searchForm" label-width="80px" class="demo-ruleForm">
          <el-col :span='8'>
            <el-form-item label="项目名称 :" prop="name">
              <el-input v-model="searchForm.name" style="width: 90%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="项目类型 :" prop="type">
              <el-select v-model="searchForm.type" placeholder="请选择项目类型" style="width: 90%;">
                <el-option label="个案访谈" value="1"></el-option>
                <el-option label="焦点小组" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="项目状态 :" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择项目状态" style="width: 100%;">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="项目标签 :" prop="label">
              <el-select v-model="searchForm.label" placeholder="请选择项目标签" style="width: 90%;">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="创建者 :" prop="createUser">
              <el-input v-model="searchForm.createUser" style="width: 90%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="创建时间 :" prop="createDate">
              <el-date-picker type="date" placeholder="请选择创建时间" v-model="searchForm.createDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="启动时间 :" prop="startDate">
              <el-date-picker type="date" placeholder="请选择启动时间" v-model="searchForm.startDate" style="width: 90%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="停止时间 :" prop="stopDate">
              <el-date-picker type="date" placeholder="请选择停止时间" v-model="searchForm.stopDate" style="width: 90%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="更新时间 :" prop="pushDate">
              <el-date-picker type="date" placeholder="请选择更新时间" v-model="searchForm.pushDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item>
              <el-button type="primary" class='mini' size='mini' @click="submitForm('searchForm')"><span class='mini'>搜索</span></el-button>
              <el-button size='mini' class='mini' @click="resetForm('searchForm')"><span class='mini'>清空</span></el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!-- 新建访谈项目/项目标签管理 -->
      <div>
        <el-row>
          <el-col :span='3'><div class="add" @click="goAddProject"><span class="iconfont fw">&#xe64b;</span><span>新建访谈项目</span></div></el-col>
          <el-col :span='3'><div class="add" @click="goLabelManage"><span class="iconfont fw">&#xe6bf;</span><span>项目标签管理</span></div></el-col>
          <el-col :span='3'><div class="add" @click="goProjectType"><span class="iconfont fw">&#xe662;</span><span>新建项目类型</span></div></el-col>
          <el-col :span='15'><div class="add right" @click="goDeleted"><span class="iconfont fw">&#xe606;</span><span>回收站</span></div></el-col>
        </el-row>
      </div>
      <!-- 列表 -->
      <div>
        <el-table ref="workerList"
        :data="workerList"
        class="workerForm"
        v-loading='loading'
        style="width: 100%">
          <el-table-column label="项目名称" prop='name' align='center'></el-table-column>
          <el-table-column label="项目类型" prop='type' align='center' width='130'>
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">个案访谈</span>
              <span v-else>焦点小组</span>
            </template>
          </el-table-column>
          <el-table-column label="创建者" prop='createUser' align='center' width='150'></el-table-column>
          <el-table-column label="创建时间" prop='createTime' align='center' width='150'></el-table-column>
          <el-table-column label="更新时间" prop='pushTime' align='center' width='150'></el-table-column>
          <el-table-column label="状态" prop='status' align='center' width='130'>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1" class="tag1">准备中</span>
              <span v-if="scope.row.status == 2" class="tag2">已启动</span>
              <span v-if="scope.row.status == 3" class="tag3">已停止</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align='center' width='120'>
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link cao">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><div @click="goProjectDetail()">项目中心</div></el-dropdown-item>
                  <el-dropdown-item><div>删除</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
            :page-size="currentSize"
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
      ifRenew: false,   //是否续费
      project: null,
      projectType: null,
      projectStatus: null,
      inputVaule: '',
      projectList: [{value: 1,label: '所有项目'}, {value: 2,label: '我创建的项目'}, {value: 3,label: '我参与的项目'}],
      projectTypeList:[{value: 1,label: '个案访谈'}, {value: 2,label: '焦点小组'}],
      projectStatusList: [{value: 1,label: '准备中'}, {value: 2,label: '已启动'}, {value: 3,label: '已结束'}],
      searchForm: {
        name: null,
        type: null,
        status: null,
        createUser: '',
        createDate: '',
      },
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        createUser: [{ required: true, message: '请输入创建者', trigger: 'blur' }],
        type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        status: [{ required: true, message: '请选择项目状态', trigger: 'change' }],
        createDate: [{ type: 'date', required: true, message: '请选择创建时间', trigger: 'change' }],
        startDate: [{ type: 'date', required: true, message: '请选择启动时间', trigger: 'change' }],
        stopDate: [{ type: 'date', required: true, message: '请选择停止时间', trigger: 'change' }],
        pushDate: [{ type: 'date', required: true, message: '请选择更新时间', trigger: 'change' }],
      },
      workerList: [
        {name: '关于中国经济特别报道访谈现场', type: 1, createUser: 'admin', createTime: '2020-01-20', pushTime: '2020-01-20', status: 1},
        {name: '关于中国经济特别报道访谈现场', type: 2, createUser: 'admin', createTime: '2020-01-20', pushTime: '2020-01-20', status: 2},
        {name: '关于中国经济特别报道访谈现场', type: 1, createUser: 'admin', createTime: '2020-01-20', pushTime: '2020-01-20', status: 3},
        {name: '关于中国经济特别报道访谈现场', type: 2, createUser: 'admin', createTime: '2020-01-20', pushTime: '2020-01-20', status: 2},
      ],
      currentPage: 1,
      currentSize: 10,
      total: 0,
      loading: false,
    }
  },
  computed: {
  },
  methods: {
    goAddProject () {
      this.$router.push('/create/project')
    },
    goLabelManage () {
      // this.$router.push('/labelManage')
    },
    goProjectType () {

    },
    goDeleted () {

    },
    goProjectDetail () {
      this.$router.push('/project/detail')
    },
    goTeam () {
      this.$router.push('/team')
    },
    goTarget () {
      this.$router.push('/target')
    },
    gointerviewees () {
      this.$router.push('/interviewees')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.currentSize = val
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  }
}
</script>

<style scoped>
  .nav>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  .nav>>>.el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
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
    background-color: #3e4b6b33;
  }
  .nav>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang="scss" scoped>
  #indexBox{
    width: 1200px;
    margin: 0 auto;
    .tip{
      margin-top: 10px;
    }
    .nav{
      margin: 20px 0;
      .searchHeight{
        line-height: 28px;
        .text{
          cursor: pointer;
          font-size: 12px;
        }
        span{
          color: #1486c6;
        }
      }
      .add{
        margin: 0px 0 20px;
        .fw{
          font-size: 15px;
          font-weight: bold;
        }
        span{
          color: #5873b4;
          padding-right: 5px;
          font-weight: 500;
          cursor: pointer;
        }
      }
      .right{
        float: right;
      }
      .tag1{
        display: inline-block;
        padding: 1px 8px;
        background-color: #ff9800;
        color: #fff;
        font-size: 12px;
      }
      .tag2{
        display: inline-block;
        padding: 1px 8px;
        background-color: #628e2e;
        color: #fff;
        font-size: 12px;
      }
      .tag3{
        display: inline-block;
        padding: 1px 8px;
        background-color: #cc4757;
        color: #fff;
        font-size: 12px;
      }
      .cao{
        display: inline-block;
        width: 70px;
        border: 1px solid #ccc;
        padding: 1px 0;
        background-color: #f1f1f1;
        font-size: 12px;
      }
      .pagination{
        margin: 20px 0;
      }
    }
    .mini{
      span{
        font-size: 12px !important;
      }
    }
  }

</style>
