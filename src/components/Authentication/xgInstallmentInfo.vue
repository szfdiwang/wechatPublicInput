<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/return2@2x.png">
      </i> 分期信息确认修改
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
          <p id="installment">
            <select v-model="couponSelected">
              <option v-for="item in itemListterm" :value="item" :key="item">{{item}}期</option>
            </select>
          </p>
        </li>
        <li>
          <span>分期金额</span>
          <p id="amount">
            <input type="number" placeholder="请输入金额" v-model="amount" @blur.prevent="inputFunc">
            <span>元</span>
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
      <p>分期金额不得大于实际学车学费，否则申请将被拒绝。</p>
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
            <li v-for="item in mentTabContList[0]" :key="item.currTerm">
              <span>{{item.currTerm}}/{{currTermLenth}}</span>
              <span>{{item.loanTermPrin}}</span>
              <span>{{item.loanTermInt}}</span>
              <span>{{item.currBal}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="nextBtn" @click="nextBtn">提交</div>
  </div>
</template>
<script>
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
      costAmt: ""
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
          // console.log(result);
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
              this.itemListterm = result.data.data.list[17].listProductParameter[0].term.split(
                ","
              );
              this.normalRate = result.data.data.list[9].listProductParameter[0].normalRate
                .split(",")
                .pop();
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
      if (this.amount == 0 || this.amount == "") {
        this.$toast("请输入分期金额", 2000);
        return false;
      }
      let data = {
        loanTerm: this.couponSelected,
        yearRate: this.normalRate,
        businessSum: this.amount,
        returnType: "6"
      };
      installmentInfoApi
        .repayPlanTrial(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.mentTabContList = [result.data.data];
            this.currBal = result.data.data[0].currBal;
            this.costAmt =
              result.data.data[0].loanTermInt * this.couponSelected +
              parseFloat(this.amount);
            this.currTermLenth = result.data.data.length;
            this.mentAlertCont = true;
          } else {
            this.$toast("获取分期金额失败", 2000);
          }
        })
        .catch(err => {});
      // console.log(this.amount);
    },
    clos() {
      this.mentAlertCont = false;
    },
    inputFunc() {
      let data = {
        loanTerm: this.couponSelected,
        yearRate: this.normalRate,
        businessSum: this.amount,
        returnType: "6"
      };
      installmentInfoApi
        .repayPlanTrial(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.currBal = result.data.data[0].currBal;
          } else {
            this.$toast("获取分期金额失败", 2000);
          }
        })
        .catch(err => {});
    },
    nextBtn() {
      if (this.amount == 0 || this.amount == "") {
        this.$toast("请输入分期金额", 2000);
        return false;
      }
      let data = {
        loanTerm: this.couponSelected,
        yearRate: this.normalRate,
        businessSum: this.amount,
        returnType: "6"
      };
      installmentInfoApi
        .repayPlanTrial(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.mentTabContList = [result.data.data];
            this.currBal = result.data.data[0].currBal;
            this.costAmt =
              result.data.data[0].loanTermInt * this.couponSelected +
              parseFloat(this.amount);
            this.currTermLenth = result.data.data.length;
            let data = {
              drivingSchoolName: this.driving.drivingSchoolName,
              term: this.couponSelected,
              amount: this.amount + "",
              termLmt: this.currBal + "",
              loanRate: this.normalRate,
              appNo: sessionStorage.appNo,
              channelID: this.driving.channelID,
              cpType: this.driving.cpType,
              isSubsidy: this.driving.isSubsidy,
              cpName: this.driving.cpName,
              costAmt: this.costAmt
            };
            installmentInfoApi
              .addLoanInfo(data)
              .then(result => {
                if (result.data.resultCode == "1") {
                  this.$router.push({
                    name: "submitInstallment"
                  });
                  // console.log(result)
                } else {
                  console.log(result);
                  this.$toast(result.data.errorDesc, 2000);
                }
              })
              .catch(err => {});
          } else {
            this.$toast("获取分期金额失败", 2000);
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
