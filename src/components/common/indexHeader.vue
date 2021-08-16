<!-- 首页头部 -->
<template>
  <div :class="['header-wrapper', {'header-bg': isCeiling}]">
    <div class="header-content">
      <router-link to="/">
        <img src="../../assets/img/logo.png" alt="#">
      </router-link>
      <ul class="nav hidden-xs-only">
        <li :class="{active: $route.name == 'Index'}">
          <router-link to="/">产品</router-link>
        </li>
        <!-- <li :class="{active: $route.name == 'Case'}">
          <router-link to="/case">案例</router-link>
        </li> -->
        <li :class="{active: $route.name == 'Pricing'}">
          <router-link to="/pricing">咨询与购买</router-link>
        </li>
        <!-- <li :class="{active: $route.name == 'Download'}">
          <router-link to="/download">下载</router-link>
        </li> -->
      </ul>
      <div class="btns hidden-xs-only">
        <div v-if="isLogin">
          <router-link to='/project' style="margin-right: 20px;">
            进入平台<i class="el-icon-right"></i>
          </router-link>
          <a>
            <i class="el-icon-user-solid" style="margin-right: 5px;"></i>
            {{userName}}
          </a>
        </div>
        <div v-else>
          <router-link to="/register">
            <el-button size="small">注册</el-button>
          </router-link>
          <router-link to="/login">
            <el-button type="primary" size="small">登录</el-button>
          </router-link>
        </div>
      </div>
      <img class="hidden-sm-and-up" style="position: absoluate; left: auto; height: 30px;right: 20px; top: 20px; width: 30px;" @click="isCollapse = !isCollapse" src="../../assets/img/menu.png" alt="">
      <!-- <i  class="el-icon-menu"></i> -->
      <!-- <i  class=" hidden-sm-and-up"></i> -->
    </div>
    <transition name="collapse">
      <div v-show="isCollapse" class="header-collapse">
        <ul>
          <li>
            <router-link to="/">产品</router-link>
          </li>
          <!-- <li>
            <router-link to="/case">案例</router-link>
          </li> -->
          <li>
            <router-link to="/pricing">咨询与购买</router-link>
          </li>
          <!-- <li>
            <router-link to="/download">下载</router-link>
          </li> -->
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLogin: false,
      userName: null,
      isCeiling: false,
      isCollapse: false
    }
  },
  created () {
    /*判断用户是否登陆*/
    if (this.$cookies.isKey("tokenWeb")) {
      let userInfo = this.$cookies.get("userInfo");
      this.userName = userInfo.name
      if (userInfo && !userInfo.ifLoginRS) {
        this.httpPost("/w1/user/permission", null).then(res => {
          if (res && res.code === 0) {
            userInfo.surveyPermission = res.data;
            userInfo.ifLoginRS = true;
            this.$cookies.set("userInfo", JSON.stringify(userInfo));
          }
        });
      }
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    let clientWidth = document.documentElement.clientWidth || document.body.clientWidth
    if (clientWidth >= 767) {
      window.addEventListener('scroll', this.handleScroll, false)
    }
  },
  methods: {
    handleScroll () {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      if (top > 0) {
        this.isCeiling = true
      } else {
        this.isCeiling = false
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll, false)
  }
}
</script>

<style lang="scss" scoped>
  .header-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    color: #ffffff;
    // background-color: #f7f7f7;
    z-index: 999;
  }
  .menu-icon {
    color: #777777;
    font-size: 28px !important;
    cursor: pointer;
  }
  .header-collapse {
    background: #ffffff;
    text-align: center;
    border-top: 1px solid #cccccc;
    box-shadow: 0px 7px 7px -7px rgba(0, 0, 0, 0.5);
    height: 140px;
    overflow: hidden;
    ul {
      padding: 10px 0;
    }
    li {
      padding: 15px 0;
      a {
        color: #777777;
      }
    }
  }
  .collapse-enter-active, .collapse-leave-active {
    transition: all .5s ease;
  }
  .collapse-enter, .collapse-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
  }
</style>

<style lang="scss">
  @import url('../../assets/style/responsive-index.scss');
  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 5px 20px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    img {
      position: absolute;
      left: 20px;
      height: 55px;
      top: 9px;
    }
    a {
      color: #777777;
    }
    .nav {
      margin-right: 30px;
      li {
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
        &.active {
          a {
            color: #2e83d3 !important;
          }
        }
        &:hover {
          opacity: .8;
        }
      }
    }
  }
  .header-bg {
    background: #ffffff;
    width: 100%;
    box-shadow: 0px 7px 7px -7px rgba(0,0,0,0.2);
    // transition: all .3s;
    a {
      color: #777777 !important;
    }
  }
</style>
