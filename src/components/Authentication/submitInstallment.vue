<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/return2@2x.png">
      </i> 分期信息确认
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
    <div class="yrzUserInfo">
      <ul>
        <li>
          <span>驾校名称</span>
          <p>{{driving.drivingSchoolName}}</p>
        </li>
        <li>
          <span>分期期限</span>
          <p>{{this.couponSelected}}期</p>
        </li>
        <li>
          <span>分期金额</span>
          <p>
            <span>{{this.amount}}元</span>
          </p>
        </li>
        <li>
          <span>还款详情</span>
          <p id="amountInfo">
            <a href="javascript:;" @click="moneyInfo">查看</a>
          </p>
        </li>
      </ul>
    </div>
    <div class="userInfoTips">
      <p>
        点击提交申请按钮即代表您已经阅读并同意
        <a href="javascript:;" @click="agreement">分期服务协议</a>
      </p>
    </div>
    <div class="installmentAlert" v-if="mentAlertCont">
      <div class="mentAlert">
        <div class="clos" @click="clos">
          <img src="@/assets/images/Authentication/delete@2x.png">
        </div>
        <div class="mentTitle">还款详情</div>
        <div class="mentTips">借款总金额：{{this.amount}}元 ，共分{{currTermLenth}}期</div>
        <div class="mentTabTitle">
          <ul>
            <li>还款期数</li>
            <li>应还本金</li>
            <li>应还利息</li>
            <li>应还总额</li>
          </ul>
        </div>
        <div class="mentTabCont">
          <ul>
            <li v-for="item in mentTabContList[0]" :key="item.loanTermInt">
              <span>{{item.currTerm}}/{{currTermLenth}}</span>
              <span>{{item.loanTermPrin}}</span>
              <span>{{item.loanTermInt}}</span>
              <span>{{item.currBal}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="nextBtn" @click="nextBtn">提交申请</div>
  </div>
</template>
<script>
import { _debounce } from "@/utils/index";
import { mapMutations } from "vuex";
import { installmentInfoApi } from "@/Api/index";
export default {
  data() {
    return {
      itemListterm: [],
      normalRate: "",
      mentAlertCont: false,
      couponSelected: "",
      amount: "",
      mentTabContList: [],
      currTermLenth: "",
      currBal: "", //每月还款金额
      driving: {},
      costAmt: "",
      subsidyExemptRule: "", //是否贴息
      payer: "",
      payerId: "",
      payerName: "",
      chargeSubject: "",
      chargeRule: "",
      subsidyVal: "",
      subsidyTerm: "",
      returnType: "",
      returnTypeName: "",
      tiexiMessage: [],
      isTiexi: "",
      disabled: false,
      smallMoney: "",
      bigMoney: ""
    };
  },
  mounted() {
    let data = {
      appNo: sessionStorage.appNo
    };
    this.$message("loading", "加载中");
    installmentInfoApi
      .queryLoanInfo(data)
      .then(result => {
        this.$hideMessage();
        if (result.data.resultCode == "1") {
          this.driving = result.data.data;
          this.amount = this.driving.amount;
          this.couponSelected = this.driving.term;
          $(".stepNext .StepImg").removeClass("StepSuccessful");
          $(".stepNext .StepImg:nth-child(1)").addClass("StepSuccessful");
          $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
          $(".stepNext .StepImg:nth-child(5)").addClass("StepSuccessful");
          let data = {
            productId: result.data.data.cpType
          };
          this.$message("loading", "加载中");
          installmentInfoApi
            .queryProductDeployEncapsulationList(data)
            .then(result => {
              this.$hideMessage();
              // console.log(result.data.data.list);
              for (var i = 0; i < result.data.data.list.length; i++) {
                if (result.data.data.list[i].componentId == "ZJ_term") {
                  for (
                    var j = 0;
                    j < result.data.data.list[i].listProductParameter.length;
                    j++
                  ) {
                    this.itemListterm = result.data.data.list[
                      i
                    ].listProductParameter[j].term.split(",");
                  }
                } else if (
                  result.data.data.list[i].componentId == "ZJ_normalRate"
                ) {
                  for (
                    var j = 0;
                    j < result.data.data.list[i].listProductParameter.length;
                    j++
                  ) {
                    this.normalRate = result.data.data.list[
                      i
                    ].listProductParameter[j].normalRate
                      .split(",")
                      .pop();
                  }
                } else if (
                  result.data.data.list[i].componentId == "ZJ_isTiexi"
                ) {
                  for (
                    var j = 0;
                    j < result.data.data.list[i].listProductParameter.length;
                    j++
                  ) {
                    this.subsidyExemptRule =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].SubsidyExemptRule;
                    this.isTiexi =
                      result.data.data.list[i].listProductParameter[j].isTiexi;
                  }
                } else if (
                  result.data.data.list[i].componentId == "ZJ_tiexiMessage"
                ) {
                  this.tiexiMessage =
                    result.data.data.list[i].listProductParameter;
                  // console.log(this.tiexiMessage)
                  for (var j = 0; j < this.tiexiMessage.length; j++) {
                    this.payer =
                      result.data.data.list[i].listProductParameter[j].payer;
                    if (this.payer == "01") {
                      this.payerId = sessionStorage.userId;
                      this.payerName = sessionStorage.name;
                      this.tiexiMessage[j].payerId = sessionStorage.userId;
                      this.tiexiMessage[j].payerName = sessionStorage.name;
                    } else if (this.payer == "02") {
                      this.payerId = this.driving.channelID;
                      this.payerName = this.driving.cpName;
                      this.tiexiMessage[j].payerId = this.driving.channelID;
                      this.tiexiMessage[j].payerName = this.driving.cpName;
                    }
                    this.chargeSubject =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].chargeSubject;
                    this.chargeRule =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].chargeRule;
                    this.subsidyTerm =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].subsidyTerm;
                    this.tiexiMessage[j].subsidyVal =
                      result.data.data.list[i].listProductParameter[j].poundage;
                    this.chargeReason =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].chargeReason;
                    this.loanAmountScope =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].loanAmountScope;
                    this.itemListloanAmountScope =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].itemListloanAmountScope;
                  }
                } else if (
                  result.data.data.list[i].componentId == "ZJ_repayWay"
                ) {
                  for (
                    var j = 0;
                    j < result.data.data.list[i].listProductParameter.length;
                    j++
                  ) {
                    this.returnType =
                      result.data.data.list[i].listProductParameter[j].repayWay;
                    this.returnTypeName =
                      result.data.data.list[i].listProductParameter[
                        j
                      ].itemListrepayWay[this.returnType];
                  }
                } else if (
                  result.data.data.list[i].componentId == "ZJ_creditAmount"
                ) {
                  for (
                    var j = 0;
                    j < result.data.data.list[i].listProductParameter.length;
                    j++
                  ) {
                    if (
                      result.data.data.list[i].listProductParameter[j]
                        .creditAmount == "" ||
                      result.data.data.list[i].listProductParameter[j]
                        .creditAmount == "undefined"
                    ) {
                      this.smallMoney = 1000;
                      this.bigMoney = 20000;
                    } else {
                      this.smallMoney =
                        result.data.data.list[i].listProductParameter[
                          j
                        ].creditAmount
                          .split(",")
                          .shift() * 10000;
                      this.bigMoney =
                        result.data.data.list[i].listProductParameter[
                          j
                        ].creditAmount
                          .split(",")
                          .pop() * 10000;
                    }
                  }
                }
              }
            })
            .catch(err => {
              this.$hideMessage();
            });
        } else {
          this.$toast("获取驾校信息失败", 2000);
        }
      })
      .catch(err => {
        this.$hideMessage();
      });
  },
  methods: {
    agreement() {
      this.$router.push({
        name: "getPdfInfoliu"
      });
    },
    fhBtn() {
      this.$router.go(-1);
    },
    nameAhc() {
      this.$router.push({
        name: "nameAhc"
      });
    },
    installmentInfo() {
      if (this.driving.status != "A0000") {
        this.$router.push({
          name: "installmentInfo"
        });
      }
    },
    basicInfo() {
      this.$router.push({
        name: "basicInfo"
      });
    },
    moneyInfo() {
      this.$message("loading", "加载中");
      let data = {
        firstRestRate: "",
        loanTerm: this.couponSelected,
        subsidyRuleList: this.tiexiMessage,
        yearRate: this.normalRate,
        businessSum: this.amount,
        subsidyExemptRule: this.subsidyExemptRule,
        returnType: this.returnType,
        isSubsidy: this.isTiexi
      };
      installmentInfoApi
        .repayPlanTrial(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.$hideMessage();
            this.mentTabContList = [result.data.data];
            this.currBal = result.data.data[0].currBal;
            this.costAmt =
              result.data.data[0].loanTermInt * this.couponSelected +
              parseFloat(this.amount);
            this.currTermLenth = result.data.data.length;
            this.mentAlertCont = true;
          } else {
            this.$hideMessage();
            this.$toast("获取分期金额失败", 2000);
          }
        })
        .catch(err => {
          this.$hideMessage();
        });
      // console.log(this.amount);
    },
    clos() {
      this.mentAlertCont = false;
    },
    nextBtn: _debounce(function() {
      this.$message("loading", "数据提交中");
      let params = {
        applyNo: sessionStorage.appNo,
        idNo: sessionStorage.idNo,
        name: sessionStorage.name
      };
      installmentInfoApi
        .queryApplyInfoByThreeFactors(params)
        .then(result => {
          this.$hideMessage();
          if (result.data.resultCode == "1") {
            if (result.data.data.status == "1") {
              //已经进件  进行签约
              let data = {
                appNo: sessionStorage.appNo
              };
              installmentInfoApi
                .signContract(data)
                .then(result => {
                  this.$hideMessage();
                  if (result.data.resultCode == "1") {
                    this.$router.push({
                      name: "successful"
                    });
                  } else if (result.data.resultCode == "7") {
                    this.$router.push({
                      name: "successful",
                      params: {
                        errorInfo: result.data.errorDesc
                      }
                    });
                  } else {
                    this.$router.push({
                      name: "successInfo",
                      params: {
                        errorInfo: result.data.errorDesc
                      }
                    });
                  }
                })
                .catch(err => {
                  this.$hideMessage();
                });
              return;
            } else {
              let data = {
                userId: sessionStorage.userId,
                channelNum: "H5",
                appNo: sessionStorage.appNo,
                blackBox: sessionStorage.blackBox,
                openId: sessionStorage.openId
              };
              installmentInfoApi
                .sendAPS(data)
                .then(result => {
                  if (result.data.resultCode == "1") {
                    let data = {
                      appNo: sessionStorage.appNo
                    };
                    installmentInfoApi
                      .signContract(data)
                      .then(result => {
                        if (result.data.resultCode == "1") {
                          this.$hideMessage();
                          this.$router.push({
                            name: "successful"
                          });
                        } else if (result.data.resultCode == "7") {
                          this.$router.push({
                            name: "successful",
                            params: {
                              errorInfo: result.data.errorDesc
                            }
                          });
                        } else {
                          this.$hideMessage();
                          this.$router.push({
                            name: "successInfo",
                            params: {
                              errorInfo: result.data.errorDesc
                            }
                          });
                        }
                      })
                      .catch(err => {
                        this.$hideMessage();
                      });
                  } else {
                    this.$hideMessage();
                    this.$router.push({
                      name: "successInfo",
                      params: {
                        errorInfo: result.data.errorDesc
                      }
                    });
                  }
                })
                .catch(err => {
                  this.$hideMessage();
                  this.$toast(result.data.errorDesc, 2000);
                });
            }
          } else {
            this.$hideMessage();
            this.$toast("系统繁忙请重试", 2000);
          }
        })
        .catch(err => {
          this.$hideMessage();
          this.$toast(result.data.errorDesc, 2000);
        });
    }, 2000)
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
  span {
    position: absolute;
    right: 0.94rem;
    top: 0;
    font-size: 0.88rem;
  }
}

.infoStep {
  height: 6.31rem;
  background: url("../../assets/images/Authentication/apply_background@2x.png")
    no-repeat;
  background-size: 100%;
  padding: 1.94rem 1.25rem 0;
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
  padding-top: 1.56rem;
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
  padding-left: 0.94rem;
}
.yrzUserInfo {
  margin: 0 0.94rem;
}

.yrzUserInfo ul li {
  line-height: 3.13rem;
  display: -webkit-flex;
  display: flex;
  border-bottom: 1px solid #d8d8d8;
  font-size: 0.88rem;
}

.yrzUserInfo ul li p {
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  width: 0%;
  display: block;
  text-align: right;
  color: #c1c6c9;
}

#installment {
  background: url("../../assets/images/Authentication/confirm2@2x.png") right
    no-repeat;
  background-size: 0.75rem;
}

#installment select {
  -moz-appearance: none;
  appearance: none;
  background: none;
  border: none;
  height: 100%;
  direction: rtl;
  padding-right: 0.94rem;
}

#amount {
  position: relative;
}

#amount span {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.88rem;
  color: #333;
}

#amount input {
  border: none;
  background: none;
  text-align: right;
  color: #333;
  padding-right: 1.56rem;
}

#amountInfo a {
  display: block;
  padding-right: 0.94rem;
  background: url("../../assets/images/Authentication/confirm@2x.png") right
    no-repeat;
  background-size: 0.75rem;
}

.userInfoTips {
  height: 2.75rem;
  line-height: 2.75rem;
  background-color: #f7f7f7;
  padding: 0 0.94rem;
}

.userInfoTips p {
  background: url("../../assets/images/Authentication/prompt@2x.png") left
    no-repeat;
  background-size: 0.63rem;
  padding-left: 0.94rem;
  color: #a4a3a3;
  font-size: 0.75rem;
  a {
    color: #2577ff;
  }
}

.nextBtn {
  margin: 1.56rem 1.72rem;
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  font-size: 0.88rem;
  color: #fff;
  border-radius: 1.31rem;
  background: #f6ab00;
}

.installmentAlert {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10001;
}

.mentAlert {
  width: 21.56rem;
  height: 25.72rem;
  background: #fff;
  position: relative;
  left: 50%;
  top: 50%;
  margin-left: -10.8rem;
  margin-top: -12.88rem;
}

.clos {
  width: 0.97rem;
  height: 0.97rem;
  position: absolute;
  right: 0.94rem;
  top: 0.94rem;
}

.clos img {
  width: 0.97rem;
}

.mentTitle {
  font-size: 1.13rem;
  text-align: center;
  padding-top: 1.88rem;
}

.mentTips {
  font-size: 0.88rem;
  color: #999;
  margin-top: 0.94rem;
  text-align: center;
}

.mentTabTitle {
  height: 2.5rem;
  line-height: 2.5rem;
  background: #f2f2f2;
  margin-top: 0.94rem;
}

.mentTabTitle ul {
  display: -webkit-flex;
  display: flex;
}

.mentTabTitle ul li {
  text-align: center;
  font-size: 0.81rem;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  width: 0%;
  display: block;
}

.mentTabCont {
  height: 15.63rem;
  overflow-y: scroll;
}

.mentTabCont ul li {
  line-height: 2.5rem;
  display: -webkit-flex;
  display: flex;
}

.mentTabCont ul li span {
  font-size: 0.81rem;
  text-align: center;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  width: 0%;
}
</style>
