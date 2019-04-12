<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/return2@2x.png">
      </i>
      {{bindTitle}}
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
    <div class="showBind" v-show="showBind">
      <div class="bindCarTips">为签约认证支付协议，请绑定有效银行卡</div>
      <div class="bindCarCont">
        <div class="carContLi">
          <input type="text" value="开户银行" disabled="disabled">
          <select id="carTab" v-model="selectBank" @change="getSelected()">
            <!-- <option value>请选择</option> -->
            <option :value="bank.code" v-for="bank in bankList" :key="bank.id">{{bank.bankName}}</option>
          </select>
        </div>
        <div class="carContLi">
          <input type="text" ref="bankNo" placeholder="银行卡号" v-model="bankNo" @blur="judgeBank()">
          <input id="useCamera1" type="file" accept="image/*" style="display:none">
          <span @click="checkBankNo()">
            <img src="@/assets/images/Authentication/camera@2x.png">
          </span>
        </div>
        <div class="carContLi">
          <input type="text" value="张三" disabled="disabled" v-model="userName">
        </div>
        <div class="carContLi">
          <input type="number" placeholder="请输入银行预留手机号" v-model="cellPhone">
        </div>
        <div class="carContLi">
          <input type="number" placeholder="请输入有效验证码" v-model="veriCode">
          <i class="timer" ref="timer" @click="flag && getVeriCode()">获取验证码</i>
        </div>
      </div>
      <div class="userInfoTips">
        <p>
          如分期申请通过，此银行卡将作为还款银行卡，绑定仅支持借记卡/储蓄卡，不支持信用卡。
          <a
            href="javascript:;"
            @click="gotoSupportBank"
          >查看支持银行卡限额</a>
        </p>
      </div>
      <div class="nextBtn" @click="submitBankInfo">下一步</div>
    </div>
    <div class="showList" v-if="showList">
      <div class="userInfoTips">
        <p>
          如分期申请通过，此银行卡将作为还款银行卡，绑定仅支持借记卡/储蓄卡，不支持信用卡。
          <a
            href="javascript:;"
            @click="gotoSupportBank"
          >查看支持银行卡限额</a>
        </p>
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
      </div>
      <div class="btnWarpper">
        <div class="modifyBtn" @click="editBankCard()">修改银行卡</div>
        <div class="nextBtn" @click="listNextBtn()">下一步</div>
      </div>
    </div>
    <div class="agreement" v-show="showAgreement">
      <div class="argeement_title">
        <span>点击同意按钮即代表您已阅读并同意以下协议</span>
      </div>
      <div
        class="argeement_content"
        @click="gotoContnet(argeement.href,argeement.id)"
        v-for="argeement in agreementList"
        :key="argeement.id"
      >
        <span>{{argeement.name}}</span>
        <i></i>
      </div>
      <div class="argeement_btn">
        <span @click="rejectBtn()">不同意</span>
        <span @click="agreeBtn()">同意</span>
      </div>
    </div>
    <div class="loading_level" v-if="showAgreement"></div>
  </div>
</template>
<script>
import { parseTime } from "@/utils/index.js";
import { registerApi } from "@/Api/index";
import { bindBankApi } from "@/Api/index";

export default {
  name: "bindCard",
  beforeRouteEnter: (to, from, next) => {
    if (to.path == "/bindCar" && from.path == "/getPdfInfo") {
      // this.showAgreement = true;
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.showAgreement = true;
      });
    } else {
      next();
    }
  },
  data() {
    return {
      bankList: [
        {
          bankName: "请选择",
          code: "blank",
          id: 0
        }
      ],
      editStatus: false,
      bindTitle: "绑定还款银行卡",
      showBind: false,
      showList: true,
      isSelectBank: false,
      selectBank: "", //选中的银行卡id
      selectBankName: "", //选中的银行卡名称
      cardPhoto: null,
      maxSize: 3 * 1024 * 1024,
      bankNo: "",
      userName: "",
      cellPhone: "",
      veriCode: "",
      uniqueCode: "",
      flag: true,
      driving: {},
      beginData: "",
      baseUrl: "",
      bankNo: "",
      bankName: "",
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
          href:
            "https://api.myerong.com/asssets/inner/openstatic/files/RISK_NOTICE.pdf"
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
    //先查一次是否有绑卡 在进行不同的分支
    this.getUserBankcardOne();
    this.getStatus();
    // this.getUserInfo();
  },
  // created() {
  //   //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
  //   this.selectBank = this.bankList[0].id;
  // },
  methods: {
    Trim(str, is_global) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
      }
      return result;
    },
    judgeBank() {
      let that = this;
      if (that.bankNo == "") return;
      let curBankNo = that.Trim(that.bankNo, "g");
      let params = {
        cardNum: curBankNo
      };
      this.$message("loading", "检验银行卡中");
      bindBankApi
        .getCardForBank(params)
        .then(result => {
          that.$hideMessage();
          if (result.data.resultCode == "1") {
            if (result.data.data.bankName) {
              //查到银行卡号
              if (result.data.data.bankNo != that.selectBank) {
                that.bankNo = "";
                that.$refs.bankNo.value = "";
                that.$toast("输入的银行卡号不匹配,请重新输入", 4000);
              }
            } else {
              //查不到银行卡号
              that.$toast("请输入正确的银行卡号", 2000);
              that.bankNo == "";
            }
          } else {
            that.$toast(result.data.errorDesc, 2000);
            that.bankNo == "";
            console.log("检验失败");
          }
        })
        .catch(err => {
          that.$hideMessage();
          that.$toast(result.data.errorDesc, 2000);
        });
    },
    getUserBankcardOne() {
      let data = {
        userId: sessionStorage.userId //
      };
      bindBankApi
        .getUserBankcardOne(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            //存在银行卡
            //打开显示银行卡列表开关
            this.showList = true;
            this.showBind = false;

            //呈现具体银行卡
            this.bankName = result.data.data.bankName;
            this.bankNo = result.data.data.bankNumber1;
            //TODO有可能出现bug处
            sessionStorage.setItem("bankNo", result.data.data.bankNumber2);
            if (result.data.data.time) {
              this.beginData = result.data.data.time;
            } else {
              this.beginData =
                "" + parseTime(result.data.data.updateTime, "{y}/{m}/{d}");
            }

            this.bankLogoTag = result.data.data.bankCode;
            this.logoSrc = "static/bank/" + this.bankLogoTag + ".png";
          } else {
            //未绑定银行卡
            //关闭银行卡列表页面 需要绑卡
            this.showList = false;
            this.showBind = true;
            //查询银行列表
            this.getSysBankList();
            //查询身份证idNo 姓名 绑卡时需要用到的姓名
            this.getUserInfo();
          }
        })
        .catch(err => {
          this.$toast(result.data.errorDesc, 2000);
        });
    },
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
      let that = this;
      let data1 = {
        appNo: sessionStorage.appNo //
      };
      that.$message("loading", "加载中");
      bindBankApi
        .getLoanStep(data1)
        .then(result => {
          that.$hideMessage();
          if (result.data.resultCode == "1") {
            that.driving = result.data.data;
            // console.log(result.data.data);
            $(".stepNext .StepImg").removeClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(1)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(5)").addClass("StepSuccessful");
          } else {
            that.$hideMessage();
          }
        })
        .catch(err => {
          that.$hideMessage();
        });
    },
    fhBtn() {
      this.$router.go(-1);
    },
    submitBankInfo() {
      let that = this;
      if (that.selectBank == "") {
        that.$toast("请先选择开户银行", 2000);
        return false;
      } else if (that.bankNo == "") {
        that.$toast("请先输入银行卡号", 2000);
        return false;
      } else if (that.veriCode == "") {
        that.$toast("请输入手机验证码", 2000);
        return false;
      } else {
        let data = {
          uniqueCode: that.uniqueCode,
          userId: sessionStorage.userId,
          smsCode: that.veriCode, //宝付验证码
          phoneNum: that.cellPhone,
          bankType: "储蓄卡",
          idNo: that.idNo,
          bankNumber: that.Trim(that.bankNo, "g"),
          bankName: that.selectBankName,
          bankCode: that.selectBank,
          appNo: sessionStorage.appNo //
        };
        bindBankApi
          .confirmBindCard(data)
          .then(result => {
            if (result.data.resultCode == "1") {
              that.$toast("绑定银行卡成功!", 2000);
              that.showBind = false;
              that.showList = true;
              this.getUserBankcardOne();
            } else {
              that.$toast("绑定银行卡失败!", 2000);
            }
          })
          .catch(err => {
            that.$toast("绑定银行卡失败!", 2000);
          });
      }
    },
    getUserInfo() {
      let that = this;
      let data = {
        userId: sessionStorage.userId,
        appNo: sessionStorage.appNo
      };
      bindBankApi
        .getPersonalInfo(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            that.userName = result.data.data.name;
            that.idNo = result.data.data.idNo;
          }
        })
        .catch(err => {});
    },
    getVeriCode() {
      let that = this;
      //先校验手机符合
      if (that.bankNo == "") {
        that.$toast("请先填写银行卡号", 2000);
        return false;
      } else if (this.cellPhone == "") {
        that.$toast("请输入手机号码", 2000);
        return false;
      } else {
        if (!/^1[345678]\d{9}$/.test(that.cellPhone)) {
          that.$toast("手机号码有误，请重新输入！");
          return false;
        } else {
          let data = {
            reqId: new Date().getTime(),
            reqSys: "wap",
            reqParams: {
              CardNum: that.Trim(that.bankNo, "g"),
              CertNo: that.idNo,
              CusName: that.userName,
              PhoneNum: that.cellPhone
            }
          };
          bindBankApi
            .readySignOfXY(data)
            .then(result => {
              if (result.data.resultCode == "1") {
                that.$toast("验证码已发送", 2000);
                that.uniqueCode = result.data.data.unique_code;
                let countdown;
                let count = 60;
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
              } else {
                that.$toast(result.data.errorDesc, 2000);
              }
            })
            .catch(err => {});
        }
      }
    },

    compressFn(result, file) {
      let _that = this;
      let img = new Image();
      //图片方向角
      img.src = result;
      img.onload = function() {
        var degree = 0,
          drawWidth,
          drawHeight,
          width,
          height;
        drawWidth = this.width;
        drawHeight = this.height;
        //以下改变一下图片大小
        let maxSide = Math.max(drawWidth, drawHeight);
        if (maxSide > 1024) {
          let minSide = Math.min(drawWidth, drawHeight);
          minSide = (minSide / maxSide) * 1024;
          maxSide = 1024;
          if (drawWidth > drawHeight) {
            drawWidth = maxSide;
            drawHeight = minSide;
          } else {
            drawWidth = minSide;
            drawHeight = maxSide;
          }
        }
        let canvas = document.createElement("canvas");
        canvas.width = width = drawWidth;
        canvas.height = height = drawHeight;
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, drawWidth, drawHeight);
        // 压缩0.5就是压缩百分之50
        let data = canvas.toDataURL("image/jpeg", 0.5);
        if (file.size > _that.maxSize) {
          data = canvas.toDataURL("image/jpeg", 0.7);
        }
        canvas = context = null;
        _that.cardPhoto = _that.dataURLtoFile(data, file.name);
        let formData = new FormData();
        formData.append("files", _that.cardPhoto);
        formData.append("userId", sessionStorage.userId), // sessionStorage.userId); //);
          formData.append("orderNo", sessionStorage.appNo), //sessionStorage.appNo); //);
          _that.$message("loading", "银行卡识别中");
        bindBankApi
          .ocrCardSend(formData)
          .then(result => {
            _that.$hideMessage();
            if (result.data.resultCode == "1") {
              if (result.data.data.code == "0") {
                _that.bankNo = result.data.data.result.bankcardNo;
              }
            }
          })
          .catch(err => {
            _that.$hideMessage();
          });
      };
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    checkBankNo() {
      this.$refs.bankNo.focus();
      let _that = this;
      if (this.selectBank == "") {
        this.$toast("请先选择开户银行", 2000);
        return false;
      }
      //清空一次
      _that.cardPhoto = null;
      //正面上传
      $("#useCamera1").click();
      $("#useCamera1").change(function(e) {
        let files = e.target.files || e.dataTransfer.files;
        let file = files[0];
        if (!this.files.length) return;
        if (!/\/(?:jpeg|png|gif)/i.test(files[0].type)) return;
        // _that.zhengPhoto = files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
          _that.compressFn(this.result, file);
        };
        reader.readAsDataURL(files[0]);
        //项目中只限定上传单张图片。
      });
    },
    getSelected() {
      this.bankList.forEach(bank => {
        if (bank.code == this.selectBank) {
          this.selectBankName = bank.bankName;
        }
      });
      if (this.selectBank == "blank") {
        this.selectBank = "";
      }
      console.log(this.selectBank);
      console.log(this.selectBankName);
    },
    getSysBankList() {
      let data = {};
      bindBankApi
        .getSysBankList(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            let list = result.data.data;
            list.forEach(item => {
              this.bankList.push(item);
            });
          }
        })
        .catch(err => {});
    },
    rejectBtn() {
      this.showAgreement = false;
    },
    listNextBtn() {
      this.showAgreement = true;
    },
    agreeBtn() {
      this.$router.push({
        name: "midone"
      });
    },
    editBankCard() {
      //TODO  修改银行卡
      this.bankNo = "";
      this.selectBank = "";
      this.selectBankName = "";
      this.editStatus = true;
      // this.userName = sessionStorage.name;
      this.showList = false;
      this.showBind = true;
      //查询银行列表
      this.getSysBankList();
      //查询身份证idNo 姓名 绑卡时需要用到的姓名
      this.getUserInfo();
    },
    idNo2Pwd(id) {
      if (id) {
        return id.substring(id.length - 6, id.length);
      }
    },
    gotoContnet(url, id) {
      if (id == "3") {
        this.$router.push({
          name: "getPdfInfoWang"
        });
      } else {
        this.$router.push({
          name: "getPdfInfo",
          params: {
            url: url
          }
        });
      }
    },
    gotoSupportBank() {
      this.$router.push({
        name: "supportBank"
      });
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
.userInfoTips {
  background-color: #f7f7f7;
  padding: 1.125rem 0.94rem;
}
.userInfoTips p {
  background: url("../../assets/images/Authentication/prompt@2x.png") no-repeat;
  background-size: 0.63rem;
  background-position: 0 0.25rem;
  padding-left: 0.94rem;
  color: #a4a3a3;
  font-size: 0.75rem;
  line-height: 1.125rem;
}
.carContLi i {
  position: absolute;
  right: 0.63rem;
  top: 0.63rem;
  font-style: normal;
  color: #1d62ff;
}
.carContLi span {
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  right: 0.63rem;
  top: 0.63rem;
}
.carContLi span img {
  width: 100%;
}
.carContLi select {
  direction: rtl;
}
#carTab {
  position: absolute;
  right: 0;
  top: 0;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: url("../../assets/images/Authentication/choose@2x.png") right
    no-repeat;
  background-size: 0.69rem;
  border: none;
  height: 100%;
  margin-right: 0.63rem;
  padding-right: 0.94rem;
  font-size: 0.88rem;
  direction: rtl;
}
.carContLi input {
  width: 100%;
  background: #fff;
  height: 100%;
  border: none;
  padding-left: 0.94rem;
  font-size: 0.88rem;
}
.carContLi {
  border: 2px #f0f0f0 solid;
  border-radius: 5px;
  height: 2.81rem;
  margin-bottom: 0.78rem;
  position: relative;
}
.bindCarCont {
  padding: 0 1.41rem;
  margin-bottom: 1.25rem;
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
  margin: 1.56rem 1.72rem;
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  font-size: 0.88rem;
  color: #fff;
  border-radius: 1.31rem;
  background: #f6ab00;
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
.btnWarpper {
  width: 100%;
  position: fixed;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  bottom: 1rem;
  .modifyBtn {
    margin: 1.56rem 1.72rem;
    height: 2.66rem;
    line-height: 2.66rem;
    text-align: center;
    color: rgba(246, 171, 0, 1);
    font-size: 0.88rem;
    border-radius: 1.31rem;
    background: rgba(246, 171, 0, 0);
    border: 2px solid rgba(246, 171, 0, 1);
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

