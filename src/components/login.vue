<!-- 首页 -->
<template>
  <div id="login">
    <!-- 头部 -->
    <div id="page-header">
      <el-row>
        <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
          <div class="header" @click="goIndex">
            <img src="../assets/img/logo.png" alt="logo">
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="hidden-sm-and-up">
        </el-col>
      </el-row>
    </div>

    <!-- 主体 -->
    <div class="container">
      <!-- 登陆部分 -->
      <div class="login-main" style="padding: 0;">
        <div class="main-wrap">
          <!-- 左侧文案 -->
          <el-col :xs="24" :sm="12" :md="14" :lg="14" :xl="14" class="left hidden-xs-only">
            <div class="content_box">
              <p class="title">质性访谈研究云平台</p>
              <p>全面<span class="col">支持个案访谈、焦点小组访谈；</span>支持访谈研究全过程管理</p>
              <p><span class="col">AI自动录音转文字，</span>轻松实现在线逐字稿整理</p>
              <p style="margin-bottom: 10px">集成质性分析工具，支持<span class="col">基于扎根理论的多人协作编码和自动编码；</span></p>
              <div style="color: #444;letter-spacing: 1px;">支持词频统计分析和编码知识图谱</div>
            </div>
          </el-col>
          <!-- 右侧登录表单 -->
          <el-col :xs="24" :sm="12" :md="10" :lg="10" :xl="10">
            <div class="wrapper-form">
              <div class="login-title">
                <span>账号登录</span>
              </div>
              <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
                <el-form-item prop="loginName">
                  <el-input v-model="loginForm.loginName" placeholder="请输入邮箱/手机号" type="text">
                    <i slot="prefix" class="el-icon-user-solid"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')" placeholder="请输入密码/验证码" type="password">
                    <i slot="prefix" class="el-icon-lock"></i>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button :disabled="isDisabled" style="width:100%;" type="primary" @click="submitForm('loginForm')" :loading="btnLoading">{{btnName}}</el-button>
                </el-form-item>
                <div>
                  <span>
                    还没有账号？<span @click="toRegister" style="color:#E94743;cursor: pointer;">立即注册！</span>
                  </span>
                  <span class="getPassword" @click="getPassword">忘记密码</span>
                </div>
              </el-form>
            </div>
          </el-col>
        </div>
      </div>
    </div>
    <!-- 嵌套子网站 -->
    <div v-show="false">
      <iframe ref="zhihuifeng" src="https://www.zhihuifeng.com/free/index.html"></iframe>
      <iframe ref="campbell" src="https://www.campbellchina.com/free/index.html"></iframe>
      <iframe ref="sw" src="https://www.smartsowo.com/free/sw.html"></iframe>
    </div>
  </div>
</template>

<script>
  import * as ws from "../utils/websocket";
import crypto from "crypto";
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isDisabled: false,
      btnLoading: false, //按钮loading
      btnName: '登陆', //按钮名称
      loginForm: {                            // 登录表单输入的信息
        loginName: "",
        password: "",
        rememberMe: true
      },
      loginRules: {                           // 登录表单的验证规则
        loginName: [{
          required: true,
          message: "请输入手机号/用户名/邮箱",
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }]
      }
    }
  },

   mounted(){
    this.loginForm.loginName = window.localStorage.getItem("loginName");
    this.loginForm.password = window.localStorage.getItem("userPassword");
  },
  methods: {
    ...mapMutations(['setLoginStatus']),
    /*点击logo跳转到首页*/
    goIndex() {
      this.$router.push('/index');
    },

    /*点击登陆事件*/
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var ip = '';
          var city = '';
          var client = "RI";
          this.isDisabled = true
          this.btnLoading = true
          this.btnName = '登陆中'
          if (window.localStorage.key('ip')) {
            ip = window.localStorage.getItem('ip')
            city = window.localStorage.getItem('city')
          }
          if (this.loginForm.password.toString().length != 32) {
            const md5 = crypto.createHash("md5");
            md5.update(this.loginForm.password);
            this.loginForm.password = md5.digest("hex");
          }
          this.httpPostToken("/oauth/token",
            `grant_type=password&username=${this.loginForm.loginName}&password=${this.loginForm.password}&clientType=${client}&ip=${ip}&city=${city}`
          ).then(res => {
            if (res && res.code === 0) {
              //缓存用户名密码
              if (this.loginForm.rememberMe) {
                window.localStorage.setItem("loginName", this.loginForm.loginName);
                window.localStorage.setItem("userPassword", this.loginForm.password);
              } else {
                window.localStorage.setItem("loginName", "");
                window.localStorage.setItem("userPassword", "");
              }
              let userInfo = this.$cookies.get("userInfo");
              this.httpPost("/user/permission", null).then(res => {
                if (res && res.code === 0) {
                  userInfo.ifLoginRI = true;
                  this.$cookies.set("userInfo", userInfo);
                  this.setLoginStatus({
                    status: true
                  })
                  this.$router.replace({
                    path: "/project"
                  });
                }else{
                  this.$message({
                    type:"error",
                    message:res.message
                  })
                  this.$router.push("/login");
                }
              })
            } else if(res) {
              this.isDisabled = false
              this.btnLoading = false
              this.btnName = '登陆'
              this.$message.error(res.message);
            }
          }).catch(err => {
            this.isDisabled = false
            this.btnLoading = false
            this.btnName = '登陆'
          })
        } else {
          return false;
        }
      });
    },

    /*点击注册*/
    toRegister:function(){
      this.$router.push("/register");
    },

    /*忘记密码*/
    getPassword() {
      this.$router.push("/findPassword");
    },
  }

}
</script>

<style lang='scss' scoped>

</style>
