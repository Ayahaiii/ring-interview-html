<!-- 首页 -->
<template>
  <div id="register">
    <!-- 头部 -->
    <div id="page-header">
      <el-row>
        <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
          <div class="header" @click="go">
            <!-- <router-link to='/login'> -->
              <img src="../assets/img/logo.png" alt="logo">
            <!-- </router-link> -->
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 中间 -->
		<div class="main_register">
			<el-row class="wrapper-register">
				<!-- 左边表单 -->
				<el-col :span="24">
					<!-- 注册板块 -->
					<el-tabs tab-position="top"  class="main_content">
						<!--手机注册-->
						<el-tab-pane label="手机注册">
							<el-form :model="registerForm" :rules="registerRules"  ref="registerForm" class="registerForm">
								<!-- 用户名 -->
								<el-form-item prop="name">
									<el-input type="text"  v-model="registerForm.name" placeholder="请填写用户名" />
								</el-form-item>
								<!-- 手机号 -->
								<el-form-item prop="phone">
									<el-input type="text" autocomplete="new-password" v-model="registerForm.phone" placeholder="请填写手机号码" />
								</el-form-item>
								<!-- 密码 -->
								<el-form-item prop="password">
									<el-input type="password" autocomplete="new-password"  v-model="registerForm.password" placeholder="密码（6-16个字符，区分大小写）" />
								</el-form-item>
								<!-- 确认密码 -->
								<el-form-item prop="againPassword">
									<el-input type="password" v-model="registerForm.againPassword" placeholder="再次输入密码" />
								</el-form-item>
								<!-- 验证码 -->
								<el-form-item prop="code">
										<el-col :span="14">
											<el-input  v-model="registerForm.code" placeholder="请输入短信中6位数字" type="text" maxlength="6" />
										</el-col>
										<el-col :span="9" style="text-align:right;margin-left:10px;">
											<el-button type="primary" :disabled="YZMDisable" @click="sendCode">{{YZMString}}</el-button>
										</el-col>
								</el-form-item>
								<!-- 同意 -->
								<el-form-item>
									<el-checkbox v-model="agreementCheck">
										我已看过并同意
										<router-link to="/privacyPolicy?key=3">《用户注册协议》</router-link>
									</el-checkbox>
								</el-form-item>
								<!-- 注册 -->
								<el-form-item>
									<el-button type="primary"  @click="telSubmit('registerForm')">立即注册</el-button>
								</el-form-item>
							</el-form>
						</el-tab-pane>
					</el-tabs>
				</el-col>
			</el-row>
		</div>

  </div>
</template>

<script>

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      value = value.trim();
      if (value != '') {
          let reg=/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{6,16}$/;
        if (!reg.test(value)) {
          callback(new Error("密码格式有误，必须为数字、字母、特殊符号中任意两种"));
        } else {
          callback();
        }
      } else {
        callback(new Error('密码不能为空，请输入密码'));
      }
    };
    var validateAgainPass = (rule, value, callback) => {
      value = value.trim();
      if (value != '') {
        if (this.registerForm.password != value) {
            callback(new Error('再次输入密码输入不正确，密码请保持一致！'));
        } else {
          callback();
        }
      } else {
        callback(new Error('再次输入密码不能为空！'));
      }
    };
    // 验证用户名
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      }
      // else if (value.length < 2) {
      //   callback(new Error("用户名最短为2位"));
      // } else if (value.length > 5) {
      //   callback(new Error("用户名最长为5位"));
      // }
      else {
        callback();
      }
    };
    // 验证手机号
    var validatePhone = (rule, value, callback) => {
      value = value.trim();
      if (value === '') {
        callback(new Error('请输入电话号码'));
      } else if (!this.checkPhoneNum(value)) {
        callback(new Error('电话号码格式有误'));
      } else {
        callback();
      }
    };
    return {
      agreementCheck: true,             //协议
			confirmDirty: false,
			YZMDisable: false,
			YZMString: "获取验证码",           //获取验证码基础文本
			countdown: 60,                    //倒计时
      autoCompleteResult: [],
      registerForm: {                   //注册表单输入的信息
        phone: "",
        name: "",
        code: "",
        password: "",
        againPassword: '',
      },
			registerRules: {                  //注册表单的验证规则
        phone: [{
          validator: validatePhone,
          trigger: "blur"
        }],
        name: [{
          validator: validateName,
          trigger: "blur"
        }],
          password: [{
          validator: validatePass,
          trigger: "blur"
        }],
        againPassword: [{
          validator: validateAgainPass,
          trigger: "blur"
        }],
        code: [{
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        }],
      },
    }
  },

  methods: {
    // 返回上一页
    go () {
      window.history.go(-1)
    },

		/**
     * 发送手机验证码
     */
    sendCode() {
      //判断手机号码是否正确
      if (!this.checkPhoneNum(this.registerForm.phone)) {
        this.$message.error("手机号码格式有误");
        return;
      }
      //倒计时60秒
      this.settime();
      //发送手机短信
      var param = {
        telephone: this.registerForm.phone
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

		/*时间倒计时*/
		settime(val) {
			//倒计时60秒
			if (this.countdown <= 0) {
				this.YZMDisable = false;
				this.YZMString = "重新发送"
				this.countdown = 60;
			} else {
				var count = this.countdown;
				this.YZMDisable = true;
				this.YZMString = "重新发送(" + this.countdown + ")";
				this.countdown = count - 1;
				setTimeout(() => {
					this.settime(val)
				}, 1000)
			}
		},

		/*手机注册账号*/
		telSubmit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					//判断是否同意用户协议
					if (!this.agreementCheck) {
						this.$message({
							message: '请同意用户协议',
							type: 'warning'
						});
						return false;
					}
					//手机注册
					this.registerForm.name = this.registerForm.name.trim()
					this.httpPostIsAnonymous(
            "/register/v1/phone/register",
            this.registerForm
          ).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: "注册成功",
                type: "success"
              });
              //跳往登陆页面
              this.$router.push("/login");
            } else if (res) {
              this.$message.error(res.message);
            }
          });
				}
			});
		},
  }
}
</script>

<style lang='scss' scoped>


</style>
