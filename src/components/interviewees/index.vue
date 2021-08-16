<template>
  <div id="inter">
    <!-- 搜索框 -->
    <div class="search">
      <el-row :gutter="10">
        <el-col :span='5'>
          <div class="fl">负责人 :</div>
          <div class="fr w5">
            <el-select size='mini' v-model="group" clearable placeholder="请选择负责人">
              <el-option v-for="item in groupList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='5'>
          <div class="fl"><span>协作者 :</span></div>
          <div class="fr w5">
            <el-select size='mini' v-model="role" clearable placeholder="请选择协作者">
              <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='9'>
          <div class="fl"><span>关键词 :</span></div>
          <div class="fr w9"><el-input size='mini' placeholder="输入账号、姓名、住址、邮箱、手机号" v-model="inputVaule" clearable></el-input></div>
        </el-col>
        <el-col :span='2'>
          <el-button type='primary' size='mini' class="mini"><span>搜索</span></el-button>
        </el-col>
        <el-col :span='3'>
          <div class="searchHeight fr"><span class="text">高级搜索</span><span>/</span><span class="text">基本搜索</span></div>
        </el-col>
      </el-row>
    </div>

    <!-- 创建框 -->
    <div>
      <el-row>
        <el-col :span='3'><div class="add" @click="addInterview"><span class="iconfont fw">&#xe612;</span><span>创建访谈</span></div></el-col>
        <el-col :span='3'><div class="add" @click="exportTeam"><span class="iconfont fw">&#xe629;</span><span>批量导出</span></div></el-col>
        <el-col :span='3'><div class="add" ><span class="iconfont fw">&#xe606;</span><span>删除</span></div></el-col>
      </el-row>
    </div>

    <!-- 列表 -->
    <div class="nav">
      <el-table ref="workerList"
      :data="workerList"
      size='small'
      class="workerForm"
      v-loading='loading'
      @selection-change="handleSelectionChange()"
      style="width: 100%">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="访谈对象" prop='interviewees' align='center' width='180'></el-table-column>
        <el-table-column label="负责人" prop='responsible' align='center' width='90'></el-table-column>
        <el-table-column label="协作者" prop='cooperation' align='center' width='90'></el-table-column>
        <el-table-column label="访谈时长" prop='intervieweesTime' align='center' width='110'></el-table-column>
        <el-table-column label="信息量" prop='message' align='center' width='100'></el-table-column>
        <el-table-column label="计划时间" prop='planTime' align='center' width='180'></el-table-column>
        <el-table-column label="执行时间" prop='carryOutTime' align='center' width='180'></el-table-column>
        <el-table-column label="整理时间" prop='arrangeTime' align='center' width='180'></el-table-column>
        <el-table-column label="审核时间" prop='auditingTime' align='center' width='180'></el-table-column>
        <el-table-column label="状态" prop='status' width='75' align='center'
        :filters="[{ text: '计划', value: 1 }, { text: '执行中', value: 2 }, { text: '整理中', value: 3 }, { text: '审核中', value: 4 }, { text: '已完成', value: 5 }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="tag1">计划</span>
            <span v-if="scope.row.status == 2" class="tag2">执行中</span>
            <span v-if="scope.row.status == 3" class="tag3">整理中</span>
            <span v-if="scope.row.status == 4" class="tag4">审核中</span>
            <span v-if="scope.row.status == 5" class="tag5">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' width='100'>
          <template slot-scope="scope">
            <el-dropdown trigger="click"  placement="bottom">
              <span class="el-dropdown-link cao">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span class="del">详情</span></el-dropdown-item>
                <el-dropdown-item><span class="del">对话文本</span></el-dropdown-item>
                <el-dropdown-item><span class="del">录音</span></el-dropdown-item>
                <el-dropdown-item><span class="del">附件</span></el-dropdown-item>
                <el-dropdown-item><span class="del">删除</span></el-dropdown-item>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadcrumbList: [
        {
          name: '民营企业家应对新肺疫情深度访谈研究',
          path: '/index'
        }, {
          name: '访谈',
          // path: ''
        }
      ],
      group: 1,
      role: 1,
      status: 1,
      inputVaule: '',
      groupList: [{value: 1,label: '全部'}, {value: 2,label: '访问员'}, {value: 3,label: '质检员'}, {value: 4,label: '分析员'}, {value: 5,label: '管理员'}],
      roleList:[{value: 1,label: '全部'}, {value: 2,label: '访问员'}, {value: 3,label: '质检员'}, {value: 4,label: '分析员'}, {value: 5,label: '管理员'}],
      workerList: [
        {interviewees: '张一山,胡珍', responsible: '王芳', cooperation: '王芳wan', intervieweesTime: '2h23m09s', message: '123K', planTime: '2020-01-02 00:09:45', carryOutTime: '2020-01-02 00:09:45', arrangeTime: '2020-01-02 00:09:45', auditingTime: '2020-01-02 00:09:45', status: 1},
        {interviewees: '张一山,胡珍', responsible: '王芳', cooperation: '王芳wan', intervieweesTime: '2h23m09s', message: '123K', planTime: '2020-01-02 00:09:45', carryOutTime: '2020-01-02 00:09:45', arrangeTime: '2020-01-02 00:09:45', auditingTime: '2020-01-02 00:09:45', status: 2},
        {interviewees: '张一山', responsible: '王芳', cooperation: '王芳wan', intervieweesTime: '2h23m09s', message: '123K', planTime: '2020-01-02 00:09:45', carryOutTime: '2020-01-02 00:09:45', arrangeTime: '2020-01-02 00:09:45', auditingTime: '2020-01-02 00:09:45', status: 3},
        {interviewees: '张一山', responsible: '王芳芳', cooperation: '王芳wan', intervieweesTime: '2h23m09s', message: '123K', planTime: '2020-01-02 00:09:45', carryOutTime: '2020-01-02 00:09:45', arrangeTime: '2020-01-02 00:09:45', auditingTime: '2020-01-02 00:09:45', status: 4},
        {interviewees: '张一山,胡珍', responsible: '王芳芳', cooperation: '王芳wan', intervieweesTime: '2h23m09s', message: '123K', planTime: '2020-01-02 00:09:45', carryOutTime: '2020-01-02 00:09:45', arrangeTime: '2020-01-02 00:09:45', auditingTime: '2020-01-02 00:09:45', status: 5},
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
      title: '访谈',
      backTitle: '',
      link: null
    })
  },
  methods: {
    // 创建访谈
    addInterview () {
      this.$router.push('/interviewees/create')
    },
    // 批量添加团队成员
    batchAdd () {
      this.$router.push('/team/batch/add')
    },
    // 导出
    exportTeam () {
      this.$router.push('/team/export')
    },
    // 分组管理
    groupManage () {
      this.$router.push('/team/manage')
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
    filterTag(value, row) {
      return row.tag === value;
    },
  }
}
</script>

<style scoped>
  .nav>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #inter>>>.el-table .cell {
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
  #inter>>>.el-pagination span{
    font-size: 12px;
  }
  #inter>>>.el-button--mini {
    padding: 6.5px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 3px;
  }
  #inter>>>.el-select .el-input .el-select__caret {
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
  .nav>>>.el-table th, .el-table td {
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
<style lang="scss" scoped>
  #inter{
    .fl{
      float: left;
      line-height: 32px;
      font-size: 12px;
      color: #555;
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
      width: 85%;
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
      width: 54px;
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
    .tag4{
      display: inline-block;
      padding: 1px 2px;
      background-color: #81C3E8;
      color: #fff;
      font-size: 12px;
      width: 54px;
      box-sizing: border-box;
    }
    .tag5{
      display: inline-block;
      padding: 1px 2px;
      background-color: #902e96e0;
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
