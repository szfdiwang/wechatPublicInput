<template>
  <div></div>
</template>
<script>
import { bindBankApi } from "@/Api/index";
export default {
  name: "midone",
  data() {
    return {
      status: 0 // 1234 存在sessionStorage
    };
  },
  mounted() {
    this.queryIsHave();
  },
  methods: {
    idNo2Pwd(id) {
      if (id) {
        return id.substring(id.length - 6, id.length);
      }
    },

    queryIsHave() {
      // sessionStorage.token =
      //   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiZXhwIjoxNTc5Mzk1NjU4LCJhdXRob3JpdGllcyI6WyJjbGllbnQiXSwianRpIjoiOTQ2Yjg0NzMtYTY4MS00MjE2LThiOGItM2YxNTNhOTE1OTQxIiwiY2xpZW50X2lkIjoiaW1nIn0.cm2UMlUjQep_Mdm1_KYuQhXcr__nK9ppYyS4b9OVZdggOo_zyZV7V1IHjzwPhgOqszkFADKIeITJhsrS6FaaX39JsD6Nj81tqRsR41IGcdYHi3j5x7V_IvbUZjE6l0KC9CH5ZIOavHuRWx3vMx-6-Pefp6EGCrzzy05cZ0tGFP2n6Hq9xZFB1ii7M0mWKrHwURNkL2TiPN7xOJgzrDzHgzey6mFYKuw3hFEeLEyXDhkR5lArBjl47Y2a2rMme5kKoJXy-a0-Lz8jvk3LQnSvebD4GPZh4m8Z_leF9LM08ibH6EOaTVvy0vODF8NiaywnqqBjiY0fOHJgUL7lu0O5Jg";
      let params = {
        userId: sessionStorage.userId //"11054",
      };
      // 查询4个接口
      this.$message("loading");
      bindBankApi.p2pRegisterResQuery(params).then(result => {
        this.$hideMessage();
        if (result.data.resultCode == "1") {
          let resultData = JSON.parse(result.data.data);
          if (resultData.resultCode != "00000") {
            this.status = "0";
            let person = {
              //TODO
              mobile: sessionStorage.mobilePhone, // "13751122776", //
              bankNo: sessionStorage.bankNo, //this.bankNo, //"6212263602032114886", //
              password: this.idNo2Pwd(sessionStorage.mobilePhone), //this.idNo2Pwd(sessionStorage.mobilePhone),
              userId: sessionStorage.userId, //"11054", //
              userName: sessionStorage.mobilePhone, //"王陈晨", //
              zcly: "wap",
              newForm: ""
            };
            this.$message("loading");
            //请求返回生成开户页面
            bindBankApi.getBankForm(person).then(result => {
              this.$hideMessage();
              if (result.data.resultCode == "1") {
                if (result.data.data.formUrl) {
                  let newBankForm = result.data.data.formUrl;
                  this.$router.push({
                    name: "jxBank",
                    params: {
                      newForm: newBankForm
                    }
                  });
                }
              } else {
                this.$toast(result.data.errorDesc, 2000);
              }
            });
          } else {
            //判断是否设置过密码
            let data = {
              userId: sessionStorage.userId, //"11054", //sessionStorage.userId,
              channelNum: "微信Wap",
              appNo: sessionStorage.appNo //"BA201903070023000095" //
            };
            this.$message("loading");
            bindBankApi
              .queryPlatformPwd(data)
              .then(result => {
                this.$hideMessage();
                if (result.data.resultCode == "1") {
                  if (result.data.data.bindFlg == "1") {
                    //已经设置
                    //直接进行下一步
                    this.$message("loading");
                    bindBankApi
                      .queryLoanRegStatus(data)
                      .then(result => {
                        this.$hideMessage();
                        if (result.data.resultCode == "1") {
                          if (result.data.data.isReg == "1") {
                            //通过
                            this.$message("loading");
                            bindBankApi
                              .trusteePayQuery(data)
                              .then(result => {
                                this.$hideMessage();
                                if (result.data.resultCode == "1") {
                                  if (result.data.data.authFlag == "1") {
                                    //已经受托支付完成
                                    this.$message("loading");
                                    bindBankApi
                                      .getAccountStatus(data)
                                      .then(result => {
                                        this.$hideMessage();
                                        if (result.data.resultCode == "1") {
                                          if (
                                            result.data.data.authStatus == "1"
                                          ) {
                                            //受托支付授权成功
                                            this.$router.push({
                                              name: "submitInstallment"
                                            });
                                          } else {
                                            let params = {
                                              userId: sessionStorage.userId, //"11054", //sessionStorage.userId,
                                              channelType: "WAP",
                                              orderNo: new Date().getTime()
                                            };
                                            this.$message("loading");
                                            bindBankApi
                                              .repayAuth(params)
                                              .then(result => {
                                                this.$hideMessage();
                                                if (
                                                  result.data.resultCode == "1"
                                                ) {
                                                  if (result.data.data.html) {
                                                    let newTrustForm =
                                                      result.data.data.html;
                                                    this.$router.push({
                                                      name: "jxBank",
                                                      params: {
                                                        newForm: newTrustForm
                                                      }
                                                    });
                                                  }
                                                } else {
                                                  this.$toast(
                                                    result.data.errorDesc,
                                                    2000
                                                  );
                                                }
                                              })
                                              .catch(err => {
                                                this.$hideMessage();
                                                this.$toast(
                                                  result.data.errorDesc,
                                                  2000
                                                );
                                              });
                                          }
                                        } else {
                                          //接口失败
                                          this.$toast(
                                            result.data.errorDesc,
                                            2000
                                          );
                                        }
                                      })
                                      .catch(err => {
                                        this.$hideMessage();
                                        //网络异常
                                        this.$toast(
                                          result.data.errorDesc,
                                          2000
                                        );
                                      });
                                  } else {
                                    this.$message("loading");
                                    //未完成
                                    //借款人受托支付申请 /erong-cfss-phss-zp/newRegister/trusteePay
                                    bindBankApi
                                      .trusteePay(data)
                                      .then(result => {
                                        this.$hideMessage();
                                        if (result.data.resultCode == "1") {
                                          if (result.data.data.form) {
                                            let newTrustForm =
                                              result.data.data.form;
                                            this.$router.push({
                                              name: "jxBank",
                                              params: {
                                                newForm: newTrustForm
                                              }
                                            });
                                          }
                                        } else {
                                          this.$toast(
                                            result.data.errorDesc,
                                            2000
                                          );
                                        }
                                      })
                                      .catch(err => {
                                        this.$hideMessage();
                                        this.$toast(
                                          result.data.errorDesc,
                                          2000
                                        );
                                      });
                                  }
                                } else {
                                  this.$toast(result.data.errorDesc, 2000);
                                }
                              })
                              .catch(err => {
                                this.$hideMessage();
                                this.$toast(result.data.errorDesc, 2000);
                              });
                          } else {
                            //w未通过 进行登记
                            this.$message("loading");
                            bindBankApi
                              .driveTrainStagingReg(data)
                              .then(result => {
                                this.$hideMessage();
                                if (result.data.resultCode == "1") {
                                  if (result.data.data.retCode == "1") {
                                    //成功
                                    this.queryIsHave();
                                  } else {
                                    //失败
                                    this.$toast("登记未成功", 2000);
                                    this.$router.push({
                                      name: "bindCar"
                                    });
                                  }
                                } else {
                                  this.$toast(result.data.errorDesc, 2000);
                                  this.$router.push({
                                    name: "bindCar"
                                  });
                                }
                              })
                              .catch(err => {
                                this.$hideMessage();
                                this.$toast(result.data.errorDesc, 2000);
                              });
                          }
                        }
                      })
                      .catch(err => {
                        this.$hideMessage();
                        this.$toast(result.data.errorDesc, 2000);
                      });
                  } else {
                    //未设置
                    //请求密码设置页面
                    this.$message("loading");
                    bindBankApi
                      .setTradePwd(data)
                      .then(result => {
                        this.$hideMessage();
                        if (result.data.resultCode == "1") {
                          if (result.data.data.form) {
                            let newPwdForm = result.data.data.form;
                            this.$router.push({
                              name: "jxBank",
                              params: {
                                newForm: newPwdForm
                              }
                            });
                          }
                        }
                      })
                      .catch(err => {
                        this.$hideMessage();
                        this.$toast(result.data.errorDesc, 2000);
                      });
                  }
                }
              })
              .catch(err => {
                this.$hideMessage();
                this.$toast(result.data.errorDesc, 2000);
              });
            //已经开户进行设置密码
          }
        } else {
          this.$hideMessage();
          this.$toast(result.data.errorDesc, 2000);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
