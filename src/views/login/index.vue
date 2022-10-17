<template>
  <div class="login">
    <el-card class="login-form-layout" shadow="never">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h2 class="login-title color-main">泰小驿物流管理</h2>
        <el-form-item prop="username">
          <el-input name="username" type="text" v-model.trim="loginForm.username" autoComplete="on" placeholder="请输入用户名">
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main"></svg-icon>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="flex-aic">
            <el-input name="code" type="text" v-model.trim="loginForm.code" autoComplete="on" placeholder="请输入图形码码">
              <span slot="prefix">
                <svg-icon icon-class="capture" class="color-main"></svg-icon>
              </span>
            </el-input>
            <img :src="captureInfo.image" alt="请刷新重试" srcset="" style="width: 145px; height:40px;margin-left: 20px" @click.stop="updetaCapture">
          </div>
        </el-form-item>
        <el-form-item prop="emailCode">
          <div class="flex-aic">
            <el-input name="uid" type="text" v-model.trim="loginForm.emailCode" autoComplete="on" placeholder="请输入验证码">
              <span slot="prefix">
                <svg-icon icon-class="code" class="color-main"></svg-icon>
              </span>
            </el-input>
            <el-button class="flex-ctr" style="width: 120px; margin-left: 20px" :disabled="isDisabled" :loading="sendLoading" @click="setEmail">
              {{ sendTxt }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item style=" text-align: center">
          <el-button class="btn" style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <img :src="login_center_bg" class="login-center-layout"> -->
  </div>
</template>

<script>
import { isvalidUsername, isEmail, checkRate } from "@/utils/validate";
import { setCookie, getCookie } from "@/utils/support";
import logo from "@/assets/images/logo.png";
import { getCapture, sendMail, } from '@/api/login.js'

export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validateEmailCode = (rule, value, callback) => {
      if (!checkRate(value)) {
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入图形码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        code: "",
        emailCode: ""
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", validator: validateUsername }],
        emailCode: [{ required: true, trigger: "blur", validator: validateEmailCode }],
        code: [{ required: true, trigger: "blur", validator: validateCode }],

      },
      loading: false,
      sendLoading: false,
      pwdType: "password",
      logo,
      sendTxt: "发送",
      countdown: 60,
      timer: null,
      isDisabled: false,

      captureInfo: {}
    };
  },
  created() {
    // // 登录界面默认填信息
    // this.loginForm.username = getCookie("username");
    // this.loginForm.password = getCookie("password");
    // if (this.loginForm.username === undefined || this.loginForm.username == null || this.loginForm.username === '') {
    //   this.loginForm.username = 'admin';
    // }
    // if (this.loginForm.password === undefined || this.loginForm.password == null) {
    //   this.loginForm.password = '';
    // }
    this.updetaCapture();
  },
  methods: {
    updetaCapture() {
      getCapture().then(res => {
        if (res.code == 1) {
          console.log('res-->>', res)
          this.captureInfo = res.data
          this.captureInfo.image = 'data:image/jpg;base64,' + this.captureInfo.image
        }

      })
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    setEmail() {
      let { uid } = this.captureInfo;
      let { username, code, } = this.loginForm;
      if (!isvalidUsername(username)) {
        this.$message.error("请输入正确的用户名");
        return
      }
      if (!code) {
        this.$message.error("请输入图形码");
        return
      }
      this.sendLoading = true;
      sendMail({ uid, username, code }).then(res => {
        this.sendLoading = false;
        if (res.code == 1) {
          this.settime()
        }
      })
    },
    settime() {
      let that = this;
      if (that.countdown == 0) {
        that.sendTxt = "重新发送";
        that.countdown = 60;
        that.isDisabled = false
        clearTimeout(that.timer);
        return;
      } else {
        that.isDisabled = true;
        that.countdown--
        that.sendTxt = `${that.countdown}s后重新发送`;
        that.timer = setTimeout(() => {
          that.settime();
        }, 1000);
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.loading = true;
          let { username, emailCode, } = this.loginForm;
          this.$store
            .dispatch("Login", { username, code: emailCode })
            .then(() => {
              this.loading = false;
              // setCookie("username", this.loginForm.username, 15);
              // setCookie("password", this.loginForm.password, 15);
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message.error("参数验证不合法！");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  background: #1948a6;
  overflow: hidden;
  height: 100vh;
  background: url("../../assets/images/login_bg.jpg") 0 0 no-repeat;
  background-size: 100%;
}
.el-button.btn {
  height: 64px;
  width: 321px;
  background: url("../../assets/images/login_btn.jpg") 0 0 no-repeat;
  background-size: 100%;
  border: 0;
  padding: 0;
  transform: scale(0.8);
}
.el-card {
  border: 0;
}
.color-main {
  color: #1948a6;
}
.el-button--primary {
  background-color: #1948a6;
  border-color: #1948a6;
}
.login-form-layout {
  position: absolute;
  right: 300px;
  top: 50%;
  transform: translateY(-50%);
  width: 360px;
  /* border-top: 10px solid #409eff; */
}

.login-title {
  text-align: center;
}

.login-center-layout {
  width: 100px;
  height: 100px;
  max-width: 100%;
  max-height: 100%;
}
</style>
