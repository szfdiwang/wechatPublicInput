<template>
  <div class="appBg">
    <div class="bar_nav bar_nav_Boder">注册/登录</div>
    <div class="registerInfo">
      <ul>
        <li class="clearfix">
          <span>
            <img src="@/assets/images/index/phone@2x.png">
          </span>
          <input
            @change="phoneInput()"
            v-model="mobilePhone"
            type="number"
            placeholder="+86  请输入手机号码"
          >
          <i @click="cleanNmber()">
            <img src="@/assets/images/index/delete1@2x.png">
          </i>
        </li>
        <li class="clearfix">
          <span>
            <img src="@/assets/images/index/validation@2x.png">
          </span>
          <input @change="codeInput()" v-model="veriCode" type="number" placeholder="验证码">
          <i class="timer" ref="timer" @click="flag && getVeriCode()">获取验证码</i>
        </li>
      </ul>
    </div>
    <div class="userAgreement clearfix">
      <i :class="{'active':active,'inactive':!active}" @click="Agreement"></i>
      <span @click="Agreement">我已阅读同意</span>
      <a href="javascript:;" @click="userAgreement()">《用户服务协议》</a>
    </div>
    <div
      :class="{'unRegisterBtn':!allPass,'registerBtn':allPass}"
      @click="allPass && registerBtn()"
    >注册/登录</div>
    <div style="display:none">{{ exitsVal }}</div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { loginApi, registerApi } from "@/Api/index";
export default {
  name: "register",
  data() {
    return {
      mobilePhone: "", //sessionStorage.mobilePhone,
      flag: true,
      active: true,
      veriCode: "", //sessionStorage.code,
      allPass: false,
      ifExist: "",
      phone: "",
      code: ""
    };
  },
  computed: {
    exitsVal: function() {
      this.ifExist =
        Number(Boolean(this.mobilePhone)) +
        Number(Boolean(this.veriCode)) +
        Number(Boolean(this.active));
    }
  },

  watch: {
    ifExist(newVal, oldVal) {
      if (Number(newVal) === 3) {
        // 三个input框内都有值时需要做的操作;
        this.allPass = true;
      } else {
        // 至少一个没有值;
        this.allPass = false;
      }
    }
  },
  mounted() {},
  methods: {
    phoneInput(e) {
      sessionStorage.mobilePhone = this.mobilePhone;
    },
    codeInput(e) {
      sessionStorage.code = this.veriCode;
    },
    ...mapMutations(["saveUser", "saveUserId"]),
    registerBtn() {
      let data = {
        userName: this.mobilePhone,
        smsCode: this.veriCode,
        smsSys: "erong-cfss-aps",
        userSys: "yrph"
      };
      registerApi
        .registerAction(data)
        .then(result => {
          console.log(result);

          if (result.data.resultCode == "1") {
            this.saveUser(result.data.data);
            this.saveUserId(result.data.data.userId);
            let data = {
              cellPhone: this.mobilePhone,
              userId: result.data.data.userId,
              openId: sessionStorage.openId
            };
            registerApi
              .bindRegisterUser(data)
              .then(result => {})
              .catch(err => {});
            let params = {
              userId: result.data.data.userId,
              loginName: this.mobilePhone,
              phone: this.mobilePhone
            };
            loginApi
              .insertOrUpdateLoginUser(params)
              .then(result => {
                console.log(result.data);
                if (result.data && result.data.resultCode == "1") {
                  this.$router.push({
                    name: "login"
                  });
                } else {
                  this.$toast("请求错误", 3000);
                }
              })
              .catch(err => {
                this.$toast("网络故障", 3000);
              });
          } else {
            this.$toast("您输入的验证码有误", 2000);
          }
        })
        .catch(err => {});
    },
    Agreement() {
      this.active = !this.active;
    },
    cleanNmber() {
      this.mobilePhone = "";
    },
    getVeriCode() {
      let that = this;
      //先校验手机符合
      if (this.mobilePhone == "") {
        this.$toast("请输入手机号码", 2000);
        return false;
      } else {
        if (!/^1[345678]\d{9}$/.test(this.mobilePhone)) {
          this.$toast("手机号码有误，请重新输入！", 2000);
          return false;
        } else {
          let data = {
            cellPhone: this.mobilePhone
          };
          registerApi
            .getValidCode(data)
            .then(result => {
              if (result.data.resultCode == "1") {
                let countdown;
                var count = 60;
                function CountDown() {
                  that.flag = false;
                  that.$refs.timer.textContent = count + "秒后重新获取";
                  if (count == 0) {
                    that.flag = true;
                    that.$refs.timer.textContent = "获取验证码";
                    clearInterval(countdown);
                  }
                  count--;
                }
                countdown = setInterval(CountDown, 1000);
              }
            })
            .catch(err => {});
        }
      }
    },
    gotoCode() {
      this.$router.push({
        name: "invitationCode"
      });
    },
    userAgreement() {
      if (process.env.NODE_ENV == "sitEnvironment") {
        this.$router.push({
          name: "getPdfInfo",
          params: {
            url:
              "https://test.myerong.com:5080/openstatic/h5/registerProtocolTemplate.html"
          }
        });
      } else {
        this.$router.push({
          name: "getPdfInfo",
          params: {
            url:
              "https://api.myerong.com/asssets/inner/openstatic/h5/registerProtocolTemplate.html"
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bar_nav {
  width: 100%;
  height: 2.75rem;
  text-align: center;
  background: #fff;
  position: fixed;
  color: #333;
  line-height: 2.75rem;
  font-size: 1.13rem;
  border-bottom: 1px solid #ccc;
  z-index: 1000;
}
.registerInfo {
  padding: 6.59rem 0.94rem 0;
}
.registerInfo ul li {
  border-bottom: 1px solid #d8d8d8;
  line-height: 3.75rem;
  display: -webkit-flex;
  display: flex;
  position: relative;
}
.registerInfo ul li span {
  border-right: 1px solid #d8d8d8;
  height: 1rem;
  float: left;
  padding-right: 0.63rem;
  margin-top: 1.5rem;
}
.registerInfo ul li span img {
  width: 1rem;
  float: left;
}
.registerInfo ul li input {
  margin: 0.94rem 0 0.94rem 0.63rem;
  padding-top: 0.43rem;
  font-size: 0.94rem;
  border: none;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  width: 0%;
  display: block;
}
.registerInfo ul li i {
  position: absolute;
  right: 0;
  top: 0.31rem;
  font-style: normal;
  font-size: 0.88rem;
  color: #f6ab00;
}
.registerInfo ul li i img {
  width: 1rem;
}
.userAgreement {
  margin-top: 1.25rem;
  padding: 0 0.94rem;
}
.userAgreement i.active {
  width: 1rem;
  height: 1rem;
  float: left;
  background: url("../../assets/images/index/selected.png") no-repeat;
  background-size: 1rem;
}

.userAgreement i.inactive {
  width: 1rem;
  height: 1rem;
  float: left;
  background: url("../../assets/images/index/unselected@2x.png") no-repeat;
  background-size: 1rem;
}
.userAgreement i {
  width: 1rem;
  height: 1rem;
  float: left;
  background: url("../../assets/images/index/unselected.png") no-repeat;
  background-size: 1rem;
  margin-top: 0.16rem;
  margin-right: 0.31rem;
}
.userAgreement a {
  color: #2577ff;
}
.unRegisterBtn {
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  color: #fff;
  background: #f6ab00;
  margin: 3.13rem 0.94rem;
  font-size: 1rem;
  border-radius: 1.38rem;
  opacity: 0.15;
}
.registerBtn {
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  color: #fff;
  background: #f6ab00;
  margin: 3.13rem 0.94rem;
  font-size: 1rem;
  border-radius: 1.38rem;
  opacity: 1;
}
.registerActive {
  opacity: 1;
}
// .bg {
//   background-color: aqua;
//   width: 100%;
//   height: 100%;
// }
</style>

