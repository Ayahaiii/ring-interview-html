// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import http from './utils/api'
import {
  baseUrl,
  baseAuthUrl,
  httpGet,
  httpPost,
  httpPostIsAnonymous,
  httpPostToken,
} from './utils/httpService'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import 'element-ui/lib/theme-chalk/base.css';
import './assets/style/element-variables.scss'
import './assets/style/media.scss'
import './assets/style/reset.scss'
import 'element-ui/lib/theme-chalk/display.css';
import './assets/style/iconfont.css'
import './assets/font/iconfont.css'
import 'babel-polyfill'
import echarts from 'echarts'
require('echarts-wordcloud')
import * as Util from './utils/utils'

import './permission'
// 权限列表
import Constant from './utils/limit'
import './directive'

/* 引入D3*/
import * as d3 from 'd3'
Vue.prototype.$d3 = d3;
window.d3 = d3; //暂时设置为全局变量

// cookie
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

//引入甘特图
import wlGantt from './components/project/report/pages/index'
// import "wl-gantt/lib/wl-gantt.css"

Vue.use(wlGantt)

// 百度地图
import BaiduMap from 'vue-baidu-map';
Vue.use(BaiduMap, {
  ak: 'q8b18hgUW3UCLoyXtKk7l4w7'
})

Vue.use(ElementUi)
Vue.prototype.echarts = echarts;
Vue.prototype.Constant = Constant;
Vue.prototype.$http = http
Vue.prototype.httpGet = httpGet;
Vue.prototype.httpPost = httpPost;
Vue.prototype.httpPostIsAnonymous = httpPostIsAnonymous;
Vue.prototype.httpPostToken = httpPostToken;
Vue.prototype.baseUrl = baseUrl;
Vue.prototype.baseAuthUrl = baseAuthUrl;
Vue.config.productionTip = false
Vue.prototype.checkPhoneNum = Util.checkPhoneNum;
Vue.prototype.checkEmail = Util.checkEmail;
Vue.prototype.getRandomVerify = Util.getRandomVerify;

// 跳转后返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
})

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
