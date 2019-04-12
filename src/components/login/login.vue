<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/index/return@2x.png">
      </i> 驾培分期
    </div>
    <div class="jpBgImg clearfix">
      <img src="@/assets/images/index/driving_project@2x.png">
    </div>
    <div class="jpContBtn" @click="nextRegister">
      <p>立即申请</p>
    </div>
    <div class="popupInfo" v-if="showResult">
      <div class="popupCont">
        <div class="driversSchool">
          <p>请确认您的学车驾校为</p>
          <h2>{{school}}</h2>
        </div>
        <div class="userAgreement clearfix" v-if="isSchool">
          <i :class="{ active: isActive }" @click="onBtn"></i>
          <span>本人同意：如申请通过，学费将转至该驾校。</span>
        </div>
        <div class="popupBtn clearfix">
          <span @click="cancleSchool">取消</span>
          <span @click="comfirmSchool">确认</span>
        </div>
      </div>
    </div>
    <invi-code
      @close="close"
      @code="code"
      @querySchool="querySchool"
      @whichSchool="whichSchool"
      @payTypeSchool="payTypeSchool"
      :visible.sync="visible"
    ></invi-code>

    <div class="single_comfirm_box" v-if="inTime">
      <div class="img_box">
        <img src="@/assets/images/index/prompt2.png">
      </div>
      <div class="text_box">
        <p>您有未完成的申请,您需要</p>
      </div>
      <div class="dubleBtn">
        <div class="canleBtn" @click="cancelRegister">重新申请</div>
        <div class="comfirmBtn" @click="nextBox">继续完成</div>
      </div>
      <div class="bottomTips">
        <p>
          <i class="markTips"></i>重新申请，将结束原申请并重新生成订单
        </p>
      </div>
      <i class="cancelBtn_img" @click="closeContinue()"></i>
    </div>

    <div class="single_comfirm_box" v-if="overTime">
      <div class="img_box">
        <img src="@/assets/images/index/prompt2.png">
      </div>
      <div class="text_box">
        <p>您未完成的申请已超过24小时，需重新申请</p>
      </div>
      <div class="dubleBtn">
        <div class="canleBtn" @click="cancelRegister">重新申请</div>
        <div class="comfirmBtn" @click="closeOverTime">取消申请</div>
      </div>
      <div class="bottomTips">
        <p>
          <i class="markTips"></i>重新申请，将结束原申请并重新生成订单
        </p>
      </div>
      <i class="cancelBtn_img" @click="closeContinue()"></i>
    </div>
    <div class="loading_level" v-if="showCover"></div>
  </div>
</template>

<script>
import Bus from "../bus";
import inviCode from "./invitationCode";
import { loginApi } from "@/Api/index";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      visible: false, // 显示对话框
      showResult: false, // 显示驾校
      showCover: false, //遮罩层
      school: "张三驾校",
      childrenCode: "", //邀请码
      isActive: false,
      isSchool: false,
      isInvitationCode: false,
      inTime: false,
      overTime: false
    };
  },
  components: {
    inviCode
  },
  mounted() {
    Bus.$on("goToLoanList", e => {
      if (process.env.NODE_ENV == "sitEnvironment") {
        window.location.href =
          "https://test.myerong.com:5080/openstatic/WeChatPublic/RepaymentList.html";
      } else if (process.env.NODE_ENV == "production") {
        window.location.href =
          "https://api.myerong.com/openstatic/WeChatPublic/RepaymentList.html";
      } else {
        console.log("环境有误");
      }
    });
    this.initStatus();
  },
  beforeRouteLeave: (to, from, next) => {
    if (to.path == "/homepage" && from.path == "/login") {
      // this.showAgreement = true;
      WeixinJSBridge.call("closeWindow");
    } else {
      next();
    }
  },
  methods: {
    closeOverTime() {
      this.showCover = false;
      this.overTime = false;
    },
    cancelRegister() {
      let data = {
        appNo: sessionStorage.appNo,
        userId: sessionStorage.userId
      };
      loginApi
        .updateLoanInfo(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.closeBox();
            this.$toast("原有申请已经结束", 3000);
            this.isInvitationCode = "0";
            let params = {
              userId: sessionStorage.userId,
              cpType: "000408"
            };
            loginApi.getLoanInfo(params).then(result => {
              if (result.data.resultCode == "1") {
                sessionStorage.appNo = result.data.data.appNo;
                this.nextRegister();
              }
            });
          } else {
            this.$toast("结束原有申请失败", 3000);
          }
        })
        .catch(err => {
          this.$toast(result.data.errorDesc, 3000);
        });
    },
    nextBox() {
      this.$router.push({
        name: "jumPage"
      });
    },
    closeBox() {
      this.showCover = false;
      this.overTime = false;
      this.inTime = false;
    },
    closeContinue() {
      this.showCover = false;
      this.inTime = false;
    },
    queryStatus() {
      let data = {
        appNo: sessionStorage.appNo
      };
      //查询订单是否超过24小时
      loginApi.getLoanInfoTime(data).then(result => {
        if (result.data.resultCode == "1") {
          if (result.data.data == "0") {
            //TODO
            //超时 显示拦截提示
            this.showCover = true;
            this.inTime = true;
          } else if (result.data.data == "1") {
            //未超时
            this.showCover = true;
            this.overTime = true;
          }
        } else {
        }
      });
    },
    initStatus() {
      let that = this;
      //查询贷款信息
      let data = {
        userId: sessionStorage.userId,
        cpType: "000408"
      };
      loginApi
        .getLoanInfo(data)
        .then(result => {
          /**
           * isinvitationCode 是否存在邀请码（0：不存在 1：存在 2:您有未完成的订单或者您已成功申请过驾培分期）
           * isinvitationCode为2时（您有未完成的订单，可至【我的借款】页面查看进度信息，是否立即跳转？
           * 或者您已成功申请过驾培分期，可至【我的借款】页面查看申请信息，是否立即跳转？）
           */
          if (result.data.resultCode == "1") {
            that.saveAppNo(result.data.data.appNo);
            //此处加一个idNo
            that.isInvitationCode = result.data.data.isInvitationCode;
            let params = {
              userId: sessionStorage.userId,
              appNo: result.data.data.appNo
            };
            loginApi
              .getPersonalInfo(params)
              .then(result => {
                // this.sign = result.data;
                if (result.data.resultCode == "1") {
                  sessionStorage.setItem("name", result.data.data.name);
                  sessionStorage.setItem("idNo", result.data.data.identityNote);
                }
                if (that.isInvitationCode == "0") {
                  //触发输入邀请码
                  that.nextRegister();
                } else if (that.isInvitationCode == "1") {
                  //已经存在邀请码跳过
                  //此处调查询是否查过24小时
                  that.queryStatus();
                } else if (that.isInvitationCode == "2") {
                  that.$messageBox("myLoan");
                  //TODO
                }
              })
              .catch(err => {
                that.$toast("网络故障请重试", 2000);
              });
          }
        })
        .catch(err => {});
    },
    onBtn() {
      this.isActive = !this.isActive;
    },
    fhBtn() {
      this.$router.go(-1);
    },
    ...mapMutations(["saveAppNo"]),
    whichSchool(e) {
      // console.log(e);
      this.school = e;
    },
    code(e) {
      this.childrenCode = e;
    },
    close(e) {
      if (e == "true") {
        this.visible = false;
        this.showCover = false;
      }
    },
    cancleSchool() {
      this.showCover = false;
      this.showResult = false;
      this.isActive = false;
    },
    comfirmSchool() {
      if (!!this.isActive) {
        let data = {
          invitationCode: this.childrenCode,
          appNo: sessionStorage.appNo
        };
        loginApi
          .getCoachLoans(data)
          .then(result => {
            if (result.data.resultCode == 1) {
              if (result.data.data.retCode == 1) {
                // console.log(result)
                //此处再增加接口进行绑定
                this.$router.push({
                  name: "nameAhc"
                });
              } else if (result.data.data.retCode == 0) {
                this.showResult = false;
                this.showCover = false;
                this.$toast(result.data.data.noticeMsg, 3000);
              }
            }
          })
          .catch(err => {});
      } else {
        this.$toast("请勾选同意申请", 3000);
      }
    },
    querySchool(e) {
      if (e == "success") {
        this.visible = false;
        this.showResult = true;
      }
    },
    payTypeSchool(e) {
      if (e == "0") {
        this.isSchool = true;
      } else {
        this.isSchool = false;
      }
    },
    nextRegister() {
      if (this.isInvitationCode == "1") {
        let data = {
          appNo: sessionStorage.appNo
        };
        //查询订单是否超过24小时
        loginApi.getLoanInfoTime(data).then(result => {
          if (result.data.resultCode == "1") {
            if (result.data.data == "0") {
              //TODO
              //超时 显示拦截提示
              this.showCover = true;
              this.inTime = true;
            } else if (result.data.data == "1") {
              //未超时 直接跳转
              this.showCover = true;
              this.overTime = true;
            }
          } else {
            this.$toast("网络故障", 2000);
          }
        });
      } else if (this.isInvitationCode == "2") {
        this.$messageBox("myLoan");
      } else {
        this.visible = true;
        this.showCover = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// .bg {
//   background-color: aqua;
//   width: 100%;
//   height: 100%;
// }
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
.loading_level {
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #000000;
  z-index: 1001;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}
.cancle_box {
  width: 1.75rem;
  height: 1.75rem;
  position: absolute;
  top: 7rem;
  z-index: 9999;
  margin: 0 auto;
  left: 0;
  right: 0;
  bottom: 0;
  .cancle_btn {
    width: 1.75rem;
    height: 1.75rem;
    background: url(../../assets/images/index/close2@2x.png) 100% 100% no-repeat;
    background-size: 1.75rem;
  }
}
.popupInfo {
  // position: fixed;
  width: 100%;
  height: 100%;
  // left: 0;
  // top: 0;
  // z-index: 9999;
}
.popupCont {
  z-index: 9999;
  width: 19.3rem;
  height: 18.03rem;
  background: #fff;
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -9.69rem;
  margin-top: -9rem;
}
.driversSchool {
  height: 9.69rem;
  background: url("../../assets/images/index/invite_background@2x.png")
    no-repeat;
  background-size: 100%;
  text-align: center;
}
.driversSchool p {
  font-size: 1.13rem;
  padding-top: 3.75rem;
  color: #fff;
}
.driversSchool h2 {
  color: #fff;
  font-size: 1.31rem;
  padding-top: 0.63rem;
}
.userAgreement {
  margin-top: 1.25rem;
  padding: 0 0.94rem;
}
.userAgreement i.active {
  vertical-align: middle;
  width: 1rem;
  height: 1rem;
  display: inline-block;
  background: url("../../assets/images/index/selected.png") no-repeat;
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
.userAgreement span {
  font-size: 0.75rem;
}
.userAgreement span a {
  color: #2577ff;
}
.popupBtn {
  margin-top: 2.03rem;
  padding: 0 1.88rem;
}
.popupBtn span {
  width: 6.25rem;
  height: 2.31rem;
  line-height: 2.31rem;
  text-align: center;
  color: #999;
  border: 1px solid #999;
  border-radius: 1.16rem;
}
.popupBtn span:first-child {
  float: left;
}
.popupBtn span:last-child {
  float: right;
  color: #fff;
  border: 1px solid #f6ab00;
  background: #f6ab00;
}
.single_comfirm_box {
  z-index: 100000000;
  width: 19.375rem;
  height: 15.78125rem;
  position: fixed;
  left: 50%;
  top: 40%;
  background: #ffffff;
  opacity: 1;
  border-radius: 0.3125rem;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
  img {
    width: 5rem;
    height: 5rem;
    margin-top: 1.90625rem;
    display: inline-block;
  }
  .text_box {
    margin: 0 auto;
    width: 14rem;
    height: 2.46875rem;
    font-size: 1rem;
    color: rgba(51, 51, 51, 1);
    line-height: 1.5rem;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    .orangeFont {
      color: rgba(246, 171, 0, 1);
    }
  }
  .submitBtn {
    margin: 0 auto;
    margin-top: 1.59375rem;
    width: 15.3125rem;
    height: 2.3125rem;
    background: rgba(246, 171, 0, 1);
    border-radius: 1.15625rem;
    span {
      width: 4.09375rem;
      height: 0.96875rem;
      font-size: 1.0625rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 2.3125rem;
    }
  }
  .dubleBtn {
    margin: 0 auto;
    width: 15.3125rem;
    height: 2.3125rem;
    border-radius: 1.15625rem;
    font-size: 1.03125rem;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    div.canleBtn {
      float: left;
      width: 6.25rem;
      height: 2.3125rem;
      border: 0.0625rem solid rgba(216, 216, 216, 1);
      border-radius: 1.15625rem;
      line-height: 2.3125rem;
    }
    div.comfirmBtn {
      float: right;
      width: 6.25rem;
      height: 2.3125rem;
      background: rgba(246, 171, 0, 1);
      border: 0.0625rem solid rgba(246, 171, 0, 1);
      border-radius: 1.15625rem;
      color: #fff;
      line-height: 2.3125rem;
    }
  }
  .bottomTips {
    border-top: 1px solid rgba(220, 220, 220, 1);
    height: 0.8125rem;
    font-size: 0.8125rem;
    color: rgba(153, 153, 153, 1);
    line-height: 1.25rem;
    .markTips {
      width: 0.625rem;
      height: 0.625rem;
      display: inline-block;
      background: url("../../assets/images/index/mark2x.png") no-repeat;
      background-size: 100%;
    }
    p {
      padding-top: 0.625rem;
    }
  }
  .cancelBtn_img {
    width: 1.75rem;
    height: 1.75rem;
    background: url("../../assets/images/index/close2@2x.png") no-repeat;
    background-size: 100%;
    position: absolute;
    bottom: -2.75rem;
    z-index: 10001;
    left: 50%;
    transform: translate(-50%, 0%);
  }
}
</style>

