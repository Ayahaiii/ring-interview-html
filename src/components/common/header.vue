<!-- 公共头部 -->
<template>
  <div id="header-comment">
    <!-- 头部 -->
    <div id="page-header-comment">
      <el-row>
        <el-col :xs="8" :sm="8" :md="10" :lg="10" :xl="10">
          <div class="header">
            <!-- <router-link to='/project'> -->
              <img @click="goHeader" src="../../assets/img/logo.png" alt="logo">
            <!-- </router-link> -->
          </div>
        </el-col>
        <el-col :xs="16" :sm="16" :md="14" :lg="14" :xl="14" class="hidden-xs-only">
          <div class="banner">
            <div class="item" v-bind:class="{current: active == 3}" @click="changeItem(3)">
              <el-dropdown trigger="click" placement="bottom">
                <span class="el-dropdown-link" v-bind:class="{cur: active == 3}">
                  <i class="el-icon-user-solid"></i> {{ userName }}<i class="el-icon-arrow-down el-icon--right" v-bind:class="{cur: active == 3}"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><div @click="goUser">个人中心</div></el-dropdown-item>
                  <el-dropdown-item><div @click="goRD">锐研数据官网</div></el-dropdown-item>
                  <el-dropdown-item><div @click="logOff" class="exit">退出</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="item" v-bind:class="{current: active == 2}" @click="changeItem(2)"><i class="el-icon-question"></i> 帮助中心</div>
            <div class="item" v-bind:class="{current: active == 1}" @click="changeItem(1)"><i class="el-icon-s-home"></i> 我的访谈</div>
          </div>
        </el-col>
        <el-col :xs="16" :sm="16" :md="14" :lg="14" :xl="14" class="mobel-header hidden-sm-and-up">
          <div class="mobel-nav">
            <span class="cur" @click="changeMobelList">
              <i class="el-icon-user-solid"></i> {{ userName }}
            </span>
          </div>
        </el-col>
        <div class="listBox hidden-sm-and-up" v-if="isShowMenu">
          <li v-bind:class="{curActive: mobelActive == 1}" @click="goIndex">我的访谈</li>
          <li v-bind:class="{curActive: mobelActive == 2}" @click="goUserCenter">锐研数据官网</li>
          <li v-bind:class="{curActive: mobelActive == 3}" @click="logOff">退出</li>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import store from '../../store'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      userName: '',
      active: 1,
      mobelActive: 1,
      isShowMenu: false
    }
  },

  created () {
    let userInfo = this.$cookies.get("userInfo")
    this.userName = userInfo.name
  },

  methods: {
    ...mapMutations(['setLoginStatus']),
    goUser () {
      window.open("https://i.ringdata.com", "_blank")
    },
    goHeader () {
      if (this.$route.name == 'Project') {
        this.$router.push('/index')
      } else {
        this.$router.push('/project')
      }
    },
    goRD () {
			window.open("https://ringdata.com", "_blank")
		},
    changeMobelList () {
      this.isShowMenu = !this.isShowMenu
    },
    changeItem (cur) {
      this.active = cur
      if (cur == 1) {
        this.$router.push('/project')
      } else if (cur == 2) {
        window.location.href = 'https://help.ringdata.com/project/fangtan'; 
      }
    },
    goIndex () {
      this.mobelActive = 1
      this.isShowMenu = !this.isShowMenu
      this.$router.push('/project')
    },
    goUserCenter () {
      this.isShowMenu = !this.isShowMenu
      this.mobelActive = 2
      window.open("https://ringdata.com", "_blank")
    },

    /* 退出系统 */
		logOff() {
      this.mobelActive = 3
      this.isShowMenu = !this.isShowMenu
      this.httpPost("/centerAuth/v1/exit").then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: "退出成功",
            type: "success"
          });
          this.setLoginStatus({
            status: false
          })
          this.$store.commit('setState', {
            permission: {}
          }) //严格模式
          this.$cookies.remove("tokenWeb");
          this.$cookies.remove("tokenWebRefresh");
          this.$cookies.remove("userInfo");
          setTimeout(() => {
            this.$router.push("/login");
          }, 500)
        } else if (res) {
          this.$message.error(res.message);
        }
      })
		},
  }

}
</script>


<style scoped>
  #page-header-comment>>>:focus {
    outline: -webkit-focus-ring-color auto 0px !important;
  }
</style>
<style lang="scss" scoped>

</style>
