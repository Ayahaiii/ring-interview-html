<template>
  <div id="analysis">
    <!-- tab切换栏 -->
    <div class="tab" v-if="isCheck">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1"><span class="iconfont">&#xe630;</span> 分析首页</el-menu-item>
        <el-menu-item index="2"><span class="iconfont">&#xe62b;</span> 编码管理</el-menu-item>
        <el-menu-item index="3"><span class="iconfont bi">&#xe670;</span> 标注管理</el-menu-item>
        <el-menu-item index="4"><span class="iconfont">&#xe67a;</span> 词频统计</el-menu-item>
        <el-menu-item index="5"><span class="iconfont">&#xe652;</span> 编码图谱</el-menu-item>
      </el-menu>
      <div class="sel" v-if="options.length > 0">
        <el-select size='mini' v-model="userId" placeholder="选择分析员" clearable>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.userId">
          </el-option>
        </el-select>
      </div>
    </div>
    <div>
      <router-view @getSamllChild="getSamllChild" :userId='userId' />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectId: null,
      isCheck: true,
      activeIndex: '1',
      breadcrumbList: [],
      options: [],
      userId: ''
    }
  },
  created () {
    this.projectId = this.$route.query.id
    this.getAnalystUser();
    if (this.$route.path.indexOf('/analysis/text') != -1) {
      this.activeIndex = '1'
      this.isCheck = false
    } else {
      this.isCheck = true
    }
    if (this.$route.path.indexOf('/analysis/index') != -1) {
      this.activeIndex = '1'
    } else if (this.$route.path.indexOf('/analysis/code') != -1) {
      this.activeIndex = '2'
    } else if (this.$route.path.indexOf('/analysis/mark') != -1) {
      this.activeIndex = '3'
    } else if (this.$route.path.indexOf('/analysis/graph') != -1) {
      this.activeIndex = '5'
    } else if (this.$route.path.indexOf('/analysis/stat') != -1) {
      this.activeIndex = '4'
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.show = false
        if (val.path.indexOf('/analysis/text') != -1) {
          this.activeIndex = '1'
          this.isCheck = false
        } else {
          this.isCheck = true
        }
        if (val.path.indexOf('/analysis/index') != -1) {
          this.activeIndex = '1'
        } else if (val.path.indexOf('/analysis/code') != -1) {
          this.activeIndex = '2'
        } else if (val.path.indexOf('/analysis/mark') != -1) {
          this.activeIndex = '3'
        } else if (val.path.indexOf('/analysis/graph') != -1) {
          this.activeIndex = '5'
        } else if (val.path.indexOf('/analysis/stat') != -1) {
          this.activeIndex = '4'
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    getSamllChild (params) {
      this.breadcrumbList  = params.breadcrumbList
      if (params.link) {
        this.link = params.link
      } else {
        this.link = null
      }
      this.$emit('getChild', {
        breadcrumbList: this.breadcrumbList,
        link: null
      })
    },
    // 切换tab
    handleSelect(key, keyPath) {
      if (key == '1') {
        this.activeIndex = '1'
        this.$router.push({path: '/analysis/index', query: {id: this.projectId}})
      } else if (key == '2') {
        this.activeIndex = '2'
        this.$router.push({path: '/analysis/code', query: {id: this.projectId}})
      } else if (key == '3') {
        this.activeIndex = '3'
        this.$router.push({path: '/analysis/mark', query: {id: this.projectId}})
      } else if (key == '4') {
        this.activeIndex = '4'
        this.$router.push({path: '/analysis/stat', query: {id: this.projectId}})
      } else if (key == '5') {
        this.activeIndex = '5'
        this.$router.push({path: '/analysis/graph', query: {id: this.projectId}})
      }
    },

    // 获取分析员列表
    getAnalystUser() {
      this.options = [];
      this.httpPost('/analyze/get/analyst/'+ this.projectId).then(res => {
        if (res.code == 0 && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            this.options.push(res.data[i]);
          }
        }
      })
    },

    // 列表选择状态改变
    handleSelectionChange(val) {
      this.interviewIdArr = []
      val.forEach(item => {
        this.interviewIdArr.push(item.id)
      })
    }
  }
}
</script>

<style scoped>
  #analysis>>>.el-menu--horizontal>.el-menu-item {
    height: 35px;
    line-height: 20px;
    color: #555;
  }
  #analysis>>>.el-table th, .el-table td {
    padding: 7px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
}
  #analysis>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #eee;
  }
  #analysis>>>.el-table th>.cell {
    color: #888;
  }
  #analysis>>>.el-table th, .el-table tr {
    background-color: #eee;
  }
  #analysis>>>.el-pagination span{
    font-size: 12px;
  }
  #analysis>>>.el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 2px solid #2e83d3;
    color: #2e83d3;
  }
  #analysis>>>.el-menu--horizontal>.el-menu-item.is-active span{
    color: #2e83d3 !important;
  }
  #analysis>>>.el-menu-item {
    padding: 0px 15px 0 10px;
    margin-right: 15px;
  }
</style>
<style lang="scss" scoped>
  #analysis{
    overflow: hidden;
    .iconfont {
      font-family: "iconfont" !important;
      font-size: 18px;
      vertical-align: bottom;
      font-style: normal;
      color: #888;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .bi{
      font-size: 14px;
    }
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
    .tab{
      position: relative;
    }
    .sel{
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
    }
  }
</style>
