<template>
  <div id="team">
    <!-- 搜索框 -->
    <div class="search">
      <el-row :gutter="10">
        <el-col :span='4'>
          <div class="fl">分 组 :</div>
          <div class="fr w5">
            <el-select size='mini' v-model="group" clearable placeholder="请选择分组">
              <el-option v-for="item in groupList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='4'>
          <div class="fl"><span>角 色 :</span></div>
          <div class="fr w5">
            <el-select size='mini' v-model="role" clearable placeholder="请选择角色">
              <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='4'>
          <div class="fl"><span>状 态 :</span></div>
          <div class="fr w5">
            <el-select size='mini' v-model="status" clearable placeholder="请选择状态">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='7'>
          <div class="fl"><span>关键词 :</span></div>
          <div class="fr w9"><el-input size='mini' placeholder="输入账号、姓名、邮箱、手机号" v-model="inputVaule" clearable></el-input></div>
        </el-col>
        <el-col :span='2'>
          <el-button type='primary' size='mini' class='mini'><span>搜索</span></el-button>
        </el-col>
        <el-col :span='3'>
          <div class="searchHeight fr"><span class="text">高级搜索</span><span>/</span><span class="text">基本搜索</span></div>
        </el-col>
      </el-row>
    </div>

    <!-- 创建框 -->
    <div>
      <el-row>
        <el-col :span='3'><div class="add" @click="addTeamItem"><span class="iconfont fw">&#xe612;</span><span> 添加团队成员</span></div></el-col>
        <el-col :span='4'><div class="add" @click="batchAdd"><span class="iconfont fw">&#xe641;</span><span> 批量添加团队成员</span></div></el-col>
        <el-col :span='2'><div class="add" @click="exportTeam"><span class="iconfont fw">&#xe629;</span><span> 导出</span></div></el-col>
        <el-col :span='2'><div class="add" ><span class="iconfont fw">&#xe606;</span><span> 删除</span></div></el-col>
        <el-col :span='3'><div class="add" ><span class="iconfont fw">&#xe62c;</span><span> 添加到组</span></div></el-col>
        <el-col :span='3'><div class="add" @click="groupManage"><span class="iconfont fw">&#xe60d;</span><span> 分组管理</span></div></el-col>
      </el-row>
    </div>

    <!-- 列表 -->
    <div class="nav">
      <el-table ref="workerList"
      :data="workerList"
      class="workerForm"
      size='small'
      v-loading='loading'
      @selection-change="handleSelectionChange()"
      style="width: 100%">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column label="用户名" prop='userName' align='center' width='85'></el-table-column>
        <el-table-column label="电子邮箱" prop='email' align='center'></el-table-column>
        <el-table-column label="手机号" prop='phone' align='center' width='115'></el-table-column>
        <el-table-column label="访谈对象" prop='interviewees' align='center' width='80'></el-table-column>
        <el-table-column label="角色" prop='role' align='center' width='180'></el-table-column>
        <el-table-column label="加入日期" prop='joinTime' align='center' width='100'></el-table-column>
        <el-table-column label="有效日期" prop='validity' align='center' width='100'></el-table-column>
        <el-table-column label="状态" prop='status' width='75' align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="tag1">有效</span>
            <span v-if="scope.row.status == 2" class="tag2">无效</span>
            <span v-if="scope.row.status == 3" class="tag3">申请中</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' width='100'>
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link cao">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><span>同意申请</span></el-dropdown-item>
                <el-dropdown-item><span>编辑</span></el-dropdown-item>
                <el-dropdown-item><span>禁止</span></el-dropdown-item>
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
          name: '团队',
          // path: ''
        }
      ],
      group: 1,
      role: 1,
      status: 1,
      inputVaule: '',
      groupList: [{value: 1,label: '全部'}, {value: 2,label: '分组1'}, {value: 3,label: '分组2'}],
      roleList:[{value: 1,label: '全部'}, {value: 2,label: '访问员'}, {value: 3,label: '质检员'}, {value: 4,label: '分析员'}, {value: 5,label: '管理员'}],
      statusList: [{value: 1,label: '全部'}, {value: 2,label: '有效(1)'}, {value: 3,label: '申请中(3)'}, {value: 4,label: '无效(4)'}],
      workerList: [
        {userName: 'admin', email: 'test@whu.edu.cn', phone: '18918813081', interviewees: '1', role: '访问员, 管理员', joinTime: '2020-02-01', validity: '永久', status: 1},
        {userName: 'admin', email: 'test@whu.edu.cn', phone: '18918813081', interviewees: '1', role: '访问员, 管理员', joinTime: '2020-02-01', validity: '永久', status: 2},
        {userName: 'admin', email: 'test@whu.edu.cn', phone: '18918813081', interviewees: '1', role: '访问员, 管理员', joinTime: '2020-02-01', validity: '2020-12-31', status: 3},
        {userName: 'admin', email: 'test@whu.edu.cn', phone: '18918813081', interviewees: '1', role: '访问员, 管理员', joinTime: '2020-02-01', validity: '2020-12-31', status: 2},
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
      link: null,
      backTitle: ''
    })
  },
  methods: {
    // 添加团队成员
    addTeamItem () {
      this.$router.push('/team/add')
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

  }
}
</script>

<style scoped>
  .nav>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
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
    background-color: #3e4b6b33;
  }
  .nav>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang="scss" scoped>
  #team{
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
