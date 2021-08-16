<template>
  <div id="analysisIndex">
    <!-- 搜索框 -->
    <div class="search">
      <el-row :gutter="10">
        <el-col :span='9'>
          <div class="fl"><span>关键词 :</span></div>
          <div class="fr w9"><el-input size='mini' placeholder="输入关键字进行智能搜索" v-model="keyword" clearable></el-input></div>
        </el-col>
        <el-col :span='2' style="line-height: 32px;">
          <el-button type='primary' size='mini' class="mini" @click="getList"><span>搜索</span></el-button>
        </el-col>
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
        <el-table-column label="#" type="index" width="45" align='center'></el-table-column>
        <el-table-column label="样本姓名" prop='name' align='center'></el-table-column>
        <el-table-column label="样本编号" prop='code' align='center'></el-table-column>
        <el-table-column label="编码数量" prop='codeCount' align='center'>
          <template slot-scope="scope">
            <span class="fs12">{{scope.row.codeCount || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="标注数量" prop='markCount' align='center'>
          <template slot-scope="scope">
            <span class="fs12">{{scope.row.markCount || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop='modifyTime' align='center' width='190'></el-table-column>
        <el-table-column label="状态" prop='status' align='center' width='90'>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" class="fs10 init-btn">初始化</span>
            <span v-if="scope.row.status == 1" class="fs10 dispath-btn">已分配</span>
            <span v-if="scope.row.status == 2" class="fs10 pending-btn">进行中</span>
            <span v-if="scope.row.status == 3" class="fs10 success-btn">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' fixed="right" width='100'>
          <template slot-scope="scope">
            <el-button type='primary' @click="check(scope.row.id, scope.row.name)" plain size='mini' class="mini"><span>查看</span></el-button>
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
  </div>
</template>

<script>
export default {
  props: ['userId'],
  data () {
    return {
      projectId: null,
      uId: null,
      breadcrumbList: [
        {
          name: '质性分析',
          path: '/analysis/index'
        },
        {
          name: '分析首页',
        }
      ],
      activeIndex: '1',
      keyword: '',
      workerList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
    }
  },
  created () {
    this.$emit('getSamllChild', {
      breadcrumbList: this.breadcrumbList,
      link: null
    })
    this.projectId = this.$route.query.id
    this.getList();
  },
  methods: {
    // 切换tab
    handleSelect () {
    },
    // 点击查看
    check (id, name) {
      this.$router.push({path: '/analysis/text', query: {id: this.projectId, sId: id, name: name}})
    },
    // 获取列表
    getList () {
      this.httpPost('/analyze/list/page', {
        "keyword": this.keyword,
        "userId": this.uId,
        "projectId": this.projectId,
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

    // 列表选择状态改变
    handleSelectionChange(val) {
      this.interviewIdArr = []
      val.forEach(item => {
        this.interviewIdArr.push(item.id)
      })
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList()
    },
  }
}
</script>

<style scoped>
  #analysisIndex>>>.el-table th, .el-table td {
    padding: 7px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
}
  #analysisIndex>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #eee;
  }
  #analysisIndex>>>.el-table th>.cell {
    color: #888;
  }
  #analysisIndex>>>.el-table th, .el-table tr {
    background-color: #eee;
  }
  #analysisIndex>>>.el-pagination span{
    font-size: 12px;
  }
  #analysisIndex>>>.el-table .cell {
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
</style>
<style lang="scss" scoped>
  #analysisIndex{
    .search{
      margin: 20px 0 20px 0;
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
      .w9{
        width: 85%;
      }
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
  }
</style>
