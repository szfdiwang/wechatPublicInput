<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/return2@2x.png">
      </i> 绑定还款银行卡
    </div>
    <div class="infoStep clearfix">
      <div class="stepNext">
        <div class="StepImg"></div>
        <div class="gan"></div>
        <div class="StepImg"></div>
        <div class="gan"></div>
        <div class="StepImg"></div>
        <div class="gan"></div>
        <div class="StepImg StepState"></div>
      </div>
      <div class="StepTxt">
        <ul>
          <li @click="nameAhc">实名认证</li>
          <li @click="installmentInfo">分期信息</li>
          <li @click="basicInfo">基本信息</li>
          <li>绑卡与提交</li>
        </ul>
      </div>
    </div>
    <div class="userInfoTips">
      <p>如分期申请通过，此银行卡将作为还款银行卡，绑定仅支持借记卡/储蓄卡，不支持信用卡。</p>
    </div>
    <div class="bindCarList">
      <div class="carLogoInfo">
        <div class="carLogo">
          <img :src="logoSrc">
        </div>
        <div class="carCont">
          <h2>{{bankName}}</h2>
          <p>储蓄卡</p>
        </div>
      </div>
      <div class="carIdInfo">
        <p>
          <span>银行卡号</span>
          {{bankNo}}
        </p>
        <p>
          <span>添加日期</span>
          {{beginData}}
        </p>
      </div>
      <div class="modify" @click="editBankCard">修改</div>
    </div>
    <div class="nextBtn" @click="nextBtn()">下一步</div>
    <div class="agreement" v-if="showAgreement">
      <div class="argeement_title">
        <span>点击同意按钮即代表您已阅读并同意以下协议</span>
      </div>
      <div
        class="argeement_content"
        @click="gotoContnet(argeement.href)"
        v-for="argeement in agreementList"
        :key="argeement.id"
      >
        <span>{{argeement.name}}</span>
        <i></i>
      </div>
      <div class="argeement_btn">
        <span @click="rejectBtn">不同意</span>
        <span @click="agreeBtn">同意</span>
      </div>
    </div>
    <div class="loading_level" v-if="showAgreement"></div>
  </div>
</template>
<script>
import { parseTime } from "@/utils/index.js";
import { bindBankApi } from "@/Api/index";
export default {
  name: "bindCarList",
  // beforeRouteLeave(to, from, next) {
  //   if (from.path == "/bindCarList" && to.path == "/bindCar") {
  //     if (to.params.status == "edit") {
  //       next();
  //     } else {
  //       this.$router.push({
  //         name: "basicInfo"
  //       });
  //     }
  //   } else {
  //     next(); //不跳转
  //   }
  // },
  data() {
    return {
      status: 0, //默认是0 未触发 每次回调修改状态值
      beginData: "",
      baseUrl: "",
      bankNo: "",
      bankName: "",
      beginData: "",
      bankLogoTag: "",
      logoSrc: "",
      showAgreement: false, //隐藏合同
      agreementList: [
        {
          id: "1",
          name: "《借款合同》",
          href:
            "https://m.myerong.com/weixin/index.html#user/personal/agree/EPLANJFFQ"
        },
        {
          id: "2",
          name: "《e融所注册服务协议》",
          href: "https://m.myerong.com/weixin/index.html#user/personal/agree"
        },
        {
          id: "3",
          name: "《借款人告知书》",
          href: "https://m.myerong.com/weixin/index.html#user/personal/agree"
        },
        {
          id: "4",
          name: "《江西银行网络交易资金账户三方协议》",
          href:
            "https://m.myerong.com/weixin/index.html#user/personal/agree/WLJYZJZFFWXY"
        },
        {
          id: "5",
          name: "《用户授权协议》",
          href:
            "https://m.myerong.com/weixin/index.html#user/personal/agree/YFSQXY"
        }
      ]
    };
  },
  mounted() {
    // this.getBlackBox();
    this.getUserBankcardOne();
    this.getStatus();
  },
  methods: {
    nameAhc() {
      this.$router.push({
        name: "nameAhc"
      });
    },
    installmentInfo() {
      this.$router.push({
        name: "installmentInfo"
      });
    },
    basicInfo() {
      this.$router.push({
        name: "basicInfo"
      });
    },
    getStatus() {
      let data1 = {
        appNo: sessionStorage.appNo
      };
      this.$message("loading", "加载中");
      bindBankApi
        .getLoanStep(data1)
        .then(result => {
          this.$hideMessage();
          if (result.data.resultCode == "1") {
            this.driving = result.data.data;
            $(".stepNext .StepImg").removeClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(1)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(5)").addClass("StepSuccessful");
            // console.log(result);
          }
        })
        .catch(err => {
          this.$hideMessage();
        });
    },
    fhBtn() {
      this.$router.go(-1);
    },
    gotoContnet(url) {
      this.$router.push({
        name: "getPdfInfo",
        params: {
          url: url
        }
      });
    },
    idNo2Pwd(id) {
      if (id) {
        return id.substring(id.length - 6, id.length);
      }
    },
    agreeBtn() {
      this.$router.push({
        name: "midone"
      });
    },
    rejectBtn() {
      this.showAgreement = false;
    },
    nextBtn() {
      this.showAgreement = true;
    },
    editBankCard() {
      // this.$message("loading", "", 100000);
      //TODO  修改银行卡
      this.$router.push({
        name: "bindCar",
        params: {
          status: "edit"
        }
      });
    },
    getUserBankcardOne() {
      let data = {
        userId: sessionStorage.userId //"11054" //TODO
      };
      bindBankApi
        .getUserBankcardOne(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.bankName = result.data.data.bankName;
            this.bankNo = result.data.data.bankNumber1;
            sessionStorage.setItem("bankNo", result.data.data.bankNumber2);
            this.beginData = parseTime(
              result.data.data.createTime,
              "{y}/{m}/{d}"
            );
            this.bankLogoTag = result.data.data.bankCode;
            this.logoSrc = "static/bank/" + this.bankLogoTag + ".png";
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.bar_nav {
  color: #fff;
  border: none;
  background: url("../../assets/images/Authentication/apply_background@2x.png")
    no-repeat;
  background-size: 100%;
  position: relative;
  width: 100%;
  height: 2.75rem;
  text-align: center;
  line-height: 2.75rem;
  font-size: 1.13rem;
  z-index: 1000;
}
.bindCarList {
  margin: 1.25rem 0.94rem;
  background: url("../../assets/images/Authentication/bank_card2@2x.png")
    no-repeat;
  background-size: 100%;
  height: 9.38rem;
  padding: 0.94rem 1.25rem;
  position: relative;
  .carLogoInfo {
    display: -webkit-flex;
    display: flex;
    .carLogo {
      width: 3.75rem;
      height: 3.75rem;
      background: #fff;
      border-radius: 50%;
      img {
        width: 100%;
      }
    }
    .carCont {
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      width: 0%;
      display: block;
      padding-left: 0.94rem;
      h2 {
        font-size: 1rem;
        color: #fff;
        margin-top: 0.63rem;
      }
      p {
        font-size: 0.88rem;
        color: #fff;
      }
    }
  }
  .carIdInfo {
    margin-top: 0.94rem;
    p {
      color: #fff;
      font-size: 0.88rem;
      span {
        margin-right: 0.94rem;
      }
    }
  }
  .modify {
    position: absolute;
    right: 0.94rem;
    top: 0.94rem;
    font-size: 0.88rem;
    color: #fff;
  }
}
.userInfoTips {
  background-color: #f7f7f7;
  padding: 0.63rem 0.94rem;
}
.userInfoTips p {
  background: url("../../assets/images/Authentication/prompt@2x.png") no-repeat;
  background-size: 0.63rem;
  background-position: 0 0.31rem;
  padding-left: 0.94rem;
  color: #a4a3a3;
  font-size: 0.75rem;
}

.bindCarTips {
  font-size: 0.75rem;
  text-align: center;
  color: #f6ab00;
  margin: 0.94rem 0;
}
.infoStep {
  height: 6.31rem;
  background: url("../../assets/images/Authentication/apply_background@2x.png")
    no-repeat;
  background-size: 100%;
  padding: 1.94rem 1.25rem 0;
  position: relative;
}
.stepNext {
  position: relative;
  padding-left: 0.47rem;
}
.StepImg {
  width: 1.38rem;
  height: 1.38rem;
  background: url("../../assets/images/Authentication/location3@2x.png")
    no-repeat;
  background-size: 1.38rem;
  float: left;
}
.StepState {
  background: url("../../assets/images/Authentication/location2@2x.png")
    no-repeat;
  background-size: 1.38rem;
}
.StepSuccessful {
  background: url("../../assets/images/Authentication/location1@2x.png")
    no-repeat;
  background-size: 1.38rem;
}
.gan {
  width: 4.63rem;
  height: 0.13rem;
  background: #fff;
  float: left;
  opacity: 0.5;
  margin-top: 0.63rem;
}
.StepTxt {
  width: 100%;
  position: absolute;
  color: #fff;
  left: 0;
}
.StepTxt ul {
  display: -webkit-flex;
  display: flex;
}
.StepTxt ul li {
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  width: 0%;
  display: block;
  color: #fff;
  font-size: 0.75rem;
  padding-left: 1.2rem;
  padding-top: 1.56rem;
}
.StepTxt ul li:nth-child(3) {
  padding-left: 1.5rem;
}
.nextBtn {
  margin: 10.56rem 1.72rem 2rem 1.72rem;
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  font-size: 0.88rem;
  color: #fff;
  border-radius: 1.31rem;
  background: #f6ab00;
}
.agreement {
  z-index: 10000;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: auto;
  background: #ffffff;
  .argeement_title {
    text-align: center;
    border-bottom: 0.03125rem solid rgba(216, 216, 216, 1);
    width: 100%;
    height: 3.21875rem;
    span {
      height: 3.21875rem;
      line-height: 3.21875rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
  .argeement_content {
    text-align: left;
    border-bottom: 0.03125rem solid rgba(216, 216, 216, 1);
    width: 100%;
    height: 2.875rem;
    span {
      height: 2.875rem;
      line-height: 2.875rem;
      padding-left: 1.09375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    i {
      width: 1.25rem;
      height: 1.25rem;
      background: url("../../assets/images/Authentication/confirm2@2x.png")
        no-repeat;
      float: right;
      margin: 0.7rem 1.25rem 0 0;
    }
  }
  .argeement_btn {
    text-align: center;
    height: 4.125rem;
    width: 100%;
    display: flex;
    span {
      flex: 1;
      line-height: 3.125rem;
      height: 0.9375rem;
      font-size: 1rem;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
}
.loading_level {
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #000000;
  z-index: 9999;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}
</style>

