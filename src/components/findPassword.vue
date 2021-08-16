<!-- 首页 -->
<template>
  <div id="findPassword">
    <!-- 头部 -->
    <div id="page-header">
      <el-row>
        <el-col :xs="19" :sm="22" :md="22" :lg="22" :xl="22">
          <div class="header">
            <router-link to='/login'>
              <img src="../assets/img/logo.png" alt="logo">
            </router-link>
          </div>
        </el-col>
        <!-- <el-col :xs="5" :sm="2" :md="2" :lg="2" :xl="2">
          <div><span class="go" @click="go">登录</span></div>
        </el-col> -->
      </el-row>
    </div>

    <!-- 主体 -->
    <div class="main_find">
      <!-- 找回密码板块 -->
        <div class="findPass">
          <el-tabs tab-position="top" class="main_content">
            <el-tab-pane label="手机找回密码">
            <el-form
              :model="phoneForm"
              :rules="phoneFormRules"
              ref="phoneForm"
              label-width="85px"
              label-position="left"
            >
              <div class="step1" v-if="step1">
                <el-form-item label="手机号" prop="telephone">
                  <el-input v-model="phoneForm.telephone" type="text" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                  <el-col :span="15">
                    <el-input v-model="phoneForm.code" type="text" maxlength="4"></el-input>
                  </el-col>
                  <el-col :span="9" class="text-right">
                    <img :src="picYZMSrc" style="width: 100%" height="40" @click="getVerify();" />
                  </el-col>
                </el-form-item>
                <el-form-item label>
                  <el-button style="width:100%;" type="primary" @click="next('phoneForm')">下一步</el-button>
                </el-form-item>
              </div>
              <div class="step2" v-if="step2">
                <el-form-item style="color:red;">为了您的账户安全，请完成身份验证</el-form-item>
                <el-form-item label="手机号">
                  <el-input
                    v-model="phoneForm.telephone"
                    placeholder="请输入手机号"
                    disabled
                    type="text"
                  ></el-input>
                </el-form-item>
                <el-form-item label="验证码">
                  <el-col :span="15">
                    <el-input v-model="phoneForm.dynamicPass" placeholder="请输入验证码" type="text"></el-input>
                  </el-col>
                  <el-col :span="9" class="text-right">
                    <el-button
                      style="width:100%"
                      type="primary"
                      :disabled="YZMDisable"
                      @click="sendCode"
                    >{{YZMString}}</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-button style="width:100%;" type="primary" @click="nextAgain()">下一步</el-button>
                </el-form-item>
              </div>
              <div class="step2" v-if="step3">
                <el-form-item style="color:red;">您正在找回的账号是：{{userName}}</el-form-item>
                <el-form-item label="新密码">
                  <el-input v-model="phoneForm.password" type="password" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码">
                  <el-input v-model="phoneForm.password2" type="password" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button style="width:100%;" type="primary" @click="confirm()">确定</el-button>
                </el-form-item>
              </div>
              <div class="step2" v-if="step4">
                <el-form-item style="color:red;">恭喜，账号{{userName}}重置密码成功！</el-form-item>
                <el-form-item>
                  <el-button style="width:100%;" type="primary" @click="goLogin()">立即登录</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
          </el-tabs>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    var validatePhone = (rule, value, callback) => {
      value = value.trim();
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!this.checkPhoneNum(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        this.checkPhoneExit(value, () => {
          if (!this.phoneExit) {
            callback(new Error("此手机号未注册"));
          }
          callback();
        });
      }
    };
    var validatePic = (rule, value, callback) => {
      if (value.toUpperCase() != this.codePic.toUpperCase()) {
        callback(new Error("验证码错误"));
      }
      callback();
    };
    return {
      YZMString: "获取验证码",
      countdown: 60, //倒计时
      YZMDisable: false, //发送验证码按钮是否禁用
      phoneExit: false, //电话是否存在
      picYZMSrc: null, //图形验证码地址
      codePic: null, //图形验证码
      YZMString: "获取验证码",
      countdown: 60, //倒计时
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      isFindByemail: true,
      phoneForm: {
        telephone: "",
        code: "",
        dynamicPass: "",
        password: "",
        password2: ""
      },
      phoneFormRules: {
        // 注册表单的验证规则
        telephone: [
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            validator: validatePic,
            trigger: "blur"
          }
        ]
      },
    }
  },

   mounted(){
     this.getVerify();
  },
  methods: {
    // 返回登录页
    go () {
      this.$router.push('/login')
    },
    next(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.step1 = false;
          this.step2 = true;
        } else {
          return false;
        }
      });
    },

    nextAgain() {
      //判断验证码是否输入
      if (this.phoneForm.dynamicPass.trim() == "") {
        this.$message.error("请输入验证码");
        return;
      }
      //判断验证码是否正确
      var param = {
        telephone: this.phoneForm.telephone,
        code: this.phoneForm.dynamicPass
      };
      this.httpPostIsAnonymous("/reset/v1/phone/searchNameByPhone", param).then(
        res => {
          if (res && res.code === 0) {
            this.userName = res.data;
            this.step1 = false;
            this.step2 = false;
            this.step3 = true;
          } else if (res) {
            this.$message.error(res.message);
          }
        }
      );
    },
    confirm() {
      //判断密码长度
      if (this.phoneForm.password.trim() == "") {
        this.$message.error("请输入密码");
        return;
      }
      if (this.phoneForm.password.trim().length < 8) {
        this.$message.error("密码最短为八位");
        return;
      }
      if (this.phoneForm.password.trim() != this.phoneForm.password2.trim()) {
        this.$message.error("两次输入密码不一致");
        return;
      }
      //修改密码
      var param = {
        telephone: this.phoneForm.telephone,
        password: this.phoneForm.password
      };
       this.httpPostIsAnonymous("/reset/v1/phone/resetPWD", param).then(res => {
        if (res && res.code === 0) {
          this.step1 = false;
          this.step2 = false;
          this.step3 = false;
          this.step4 = true;
        } else if (res) {
          this.$message.error(res.message);
        }
      });
    },
    goLogin() {
      this.$router.push("/login");
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断图形验证码是否正确
          if (this.emailForm.code.toUpperCase() != this.codePic.toUpperCase()) {
            this.$message.error("验证码错误");
            this.getVerify();
            return;
          }
          //判断邮箱和用户名是否匹配
          this.httpPost(
            "/user/v1/email/matchEmailAndName",
            this.emailForm
          ).then(res => {
            if (res && res.code === 0) {
              if (res.data) {
                this.httpPost("/user/v1/email/sendEmail", this.emailForm).then(
                  res2 => {
                    if (res2 && res2.code === 0) {
                      this.isFindByemail = false;
                    }
                  }
                );
              } else if (res) {
                this.$message.error("用户名和邮箱不匹配");
              }
            }
          });
        } else {
          return false;
        }
      });
    },

    /**
     * 发送手机验证码
     */
    sendCode() {
      //判断手机号码是否正确
      if (!this.checkPhoneNum(this.phoneForm.telephone)) {
        this.$message.error("手机号码格式有误");
        return;
      }
      //倒计时60秒
      this.settime();
      //发送手机短信
      var param = {
        telephone: this.phoneForm.telephone
      };
      this.httpPostIsAnonymous("/code/v1/phone/sendMessage", param).then(
        res => {
          if (res && res.code === 0) {
            this.$message({
              message: "发送成功",
              type: "success"
            });
          } else if (res) {
            this.$message.error("发送失败");
            this.countdown = 0;
          }
        }
      );
    },

    /**
     * 获取验证码
     */
    getVerify() {
      //生成四位数字字母组合
      this.codePic = this.getRandomVerify(true, 4, 4);
      this.picYZMSrc =
        this.baseAuthUrl + "/code/v1/createKaptcha?code=" + this.codePic;
    },

    /**
     * 时间倒计时
     */
    settime(val) {
      //倒计时60秒
      if (this.countdown <= 0) {
        this.YZMDisable = false;
        this.YZMString = "重新发送";
        this.countdown = 60;
      } else {
        var count = this.countdown;
        this.YZMDisable = true;
        this.YZMString = "重新发送(" + this.countdown + ")";
        this.countdown = count - 1;
        setTimeout(() => {
          this.settime(val);
        }, 1000);
      }
    },

    /**
     * 判断手机号是否存在
     */
    checkPhoneExit(phone, doSomething) {
      var param = {
        telephone: phone
      };
      this.httpPostIsAnonymous("/reset/v1/checkPhoneExit", param).then(res => {
        if (res && res.code === 0) {
          if (res.data) {
            this.phoneExit = true;
          } else {
            this.phoneExit = false;
          }
          doSomething();
        } else if (res) {
          this.$message.error(res.message);
        }
      });
    }

  }

}
</script>

<style lang='scss' scoped>
  // 中间样式

</style>
