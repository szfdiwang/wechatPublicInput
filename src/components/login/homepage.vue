<template>
  <div></div>
</template>
<script>
import { mapMutations } from "vuex";
import { loginApi } from "@/Api/index";
export default {
  name: "homepage",
  data() {
    return {};
  },
  mounted() {
    this.queryUserToken();
  },
  methods: {
    ...mapMutations([
      "saveToken",
      "savePhone",
      "saveUserId" //token
    ]),
    queryUserToken() {
      this.$message("loading");
      loginApi
        .getUserToekn()
        .then(result => {
          if (typeof result.data.access_token != "undefined") {
            this.saveToken(result.data.access_token);
            sessionStorage.setItem("myToken", result.data.access_token);
            // this.getUserInfo();
            let url = window.location.search;
            let request = new Object();
            if (url.indexOf("?") != -1) {
              var str = url.substr(1);
              var strs = str.split("&");
              for (var i = 0; i < strs.length; i++) {
                request[strs[i].split("=")[0]] = unescape(
                  strs[i].split("=")[1]
                );
              }
            }
            let opCode = request["code"];
            let data = {
              code: opCode + "",
              wxType: "daehaoche"
            };
            /**
             * 在微信中才可以获取openid 顾方便调试直接访问注册页面进行流程
             * @author wangchenchen
             */
            loginApi.queryLoginUserData(data).then(result => {
              this.$hideMessage();
              if (result.data.resultCode == "1") {
                sessionStorage.openId = result.data.data.openId;
                if (result.data.data && result.data.data.userId) {
                  this.saveUserId(result.data.data.userId);
                  this.savePhone(result.data.data.cellPhone);
                  let data = {
                    userId: result.data.data.userId,
                    loginName: result.data.data.cellPhone,
                    phone: result.data.data.cellPhone
                  };
                  loginApi
                    .insertOrUpdateLoginUser(data)
                    .then(result => {
                      console.log(result.data);
                      if (result.data && result.data.resultCode == "1") {
                        this.$router.push({
                          name: "login"
                        });
                      } else {
                        this.$toast("已注册用户", 3000);
                      }
                    })
                    .catch(err => {
                      this.$toast("未绑定用户", 3000);
                    });
                  // 已经注册 驾培分期申请也面
                } else {
                  sessionStorage.code = opCode + "";
                  //未能注册 前往注册页面
                  this.$router.push({
                    name: "register"
                  });
                }
              } else {
                this.$toast("获取信息失败", 3000);
              }
            });
          }
        })
        .catch(err => {
          this.$toast("获取令牌失败", 3000);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
