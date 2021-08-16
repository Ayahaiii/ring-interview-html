<template>
  <div id="app">
    <router-view v-if="isRouterShow" v-loading='loading' />
    <!-- 嵌套子网站 -->
    <div v-show="false">
      <iframe ref="zhihuifeng" src="https://www.zhihuifeng.com/free/index.html"></iframe>
      <iframe ref="campbell" src="http://www.campbellchina.com/free/index.html"></iframe>
      <iframe ref="smartsowo" src="https://www.smartsowo.com/free/sw.html"></iframe>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterShow: true,
      loading: false,
    }
  },
  computed: {
    ...mapState(['isLogin'])
  },
  methods: {
    async reload () {
      this.isRouterShow = false
      this.loading = true
      await this.$nextTick()
      this.isRouterShow = true
      this.loading = false
    },
    freeLogin() {
      let params = {
        type: 'sa',
        params: {
          tk: this.$cookies.get("tokenWeb"),
          ui: this.$cookies.get("userInfo")
        }
      }
      this.$refs.zhihuifeng.contentWindow.postMessage(params, 'https://www.zhihuifeng.com');
      this.$refs.campbell.contentWindow.postMessage(params, 'https://www.campbellchina.com');
      this.$refs.smartsowo.contentWindow.postMessage(params, 'https://www.smartsowo.com');
    },
    clearCookie () {
      let params = {
        type: 'rm',
        params: {}
      }
      this.$refs.zhihuifeng.contentWindow.postMessage(params, 'https://www.zhihuifeng.com');
      this.$refs.campbell.contentWindow.postMessage(params, 'https://www.campbellchina.com');
      this.$refs.smartsowo.contentWindow.postMessage(params, 'https://www.smartsowo.com');
    }
  },
  watch: {
    isLogin (newVal) {
      if (newVal) {
        this.freeLogin()
      } else {
        this.clearCookie()
      }
    }
  },
}
</script>

<style>
#app {
  display: flex;
}
.el-header, .el-main, .el-footer{
  padding: 0 !important;
}
.el-header{
  height: 100px;
}
.el-footer{
  height: 190px;
}
.router-link-active {
  text-decoration: none;
  color: #d7d7d7;
}
a{
  color: #d7d7d7;
}
.brand{
  margin: 20px 0;
}
.el-breadcrumb__inner.is-link {
  font-weight: normal !important;
  text-decoration: none;
  -webkit-transition: color .2s cubic-bezier(.645,.045,.355,1);
  transition: color .2s cubic-bezier(.645,.045,.355,1);
  color: #2e83d3 !important;
}
.el-breadcrumb__inner {
  color: #2e83d3 !important;
}
.el-input-number__increase{
  width: 15px !important;
  font-size: 12px;
}
.brand .iconfont{
  font-size: 15px;
  font-weight: bold;
}
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}
.pagination{
  margin: 20px 0;
}
.mini span{
  font-size: 12px !important;
}
.fs12{
  font-size: 12px !important;
}
.fs10{
  font-size: 10px !important;
}
.el-date-editor .el-range-separator {
  display: inline-block;
  height: 100%;
  padding: 0 5px;
  margin: 0;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  width: 8%;
  color: #303133;
}
.none{display:none !important;}
.el-table .cell {
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
</style>
