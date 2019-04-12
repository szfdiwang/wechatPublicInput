<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/return2@2x.png">
      </i> 基本信息
    </div>
    <div class="infoStep clearfix">
      <div class="stepNext">
        <div class="StepImg StepSuccessful"></div>
        <div class="gan"></div>
        <div class="StepImg StepSuccessful"></div>
        <div class="gan"></div>
        <div class="StepImg StepState"></div>
        <div class="gan"></div>
        <div class="StepImg"></div>
      </div>
      <div class="StepTxt">
        <ul>
          <li @click="nameAhc">实名认证</li>
          <li @click="installmentInfo">分期信息</li>
          <li>基本信息</li>
          <li @click="bindCar">绑卡与提交</li>
        </ul>
      </div>
    </div>
    <div class="moreTitel">个人信息</div>
    <div class="yrzUserInfo">
      <ul>
        <li>
          <span>电子邮箱</span>
          <p id="email">
            <input type="text" placeholder="请输入电子邮箱" v-model="email">
          </p>
        </li>
        <li>
          <span>居住地址</span>
          <p id="cityBtn">
            <input
              type="button"
              value="请选择"
              id="Province"
              class="userProvince"
              @click="userProvince"
              v-model="zjdzInfo"
            >
            <input type="text" placeholder="请输入街道楼栋和门牌号" id="city" v-model="jzxxInfo">
          </p>
        </li>
        <li>
          <span>公司名称</span>
          <p id="enterprise">
            <input type="text" placeholder="请输入公司全称" v-model="gsName">
          </p>
        </li>
        <li>
          <span>公司电话</span>
          <p id="phone">
            <input type="tel" placeholder="请输入公司电话" v-model="gsPhone" @input="inputFn">
          </p>
        </li>
        <li>
          <span>办公地址</span>
          <p id="cityBtn">
            <input
              type="button"
              value="请选择"
              id="Province"
              class="gsProvince"
              @click="gsProvince"
              v-model="gsdzInfo"
            >
            <input type="text" placeholder="请输入街道楼栋和门牌号" id="city" v-model="gsxxInfo">
          </p>
        </li>
        <li>
          <span>名片/工牌</span>
          <p id="cityBtn">
            <input type="button" value="选传" id="Province" @click="imgUpload">
          </p>
        </li>
      </ul>
    </div>
    <div class="moreTitel">紧急联系人</div>
    <div class="yrzUserInfo">
      <ul>
        <li>
          <span>联系人1</span>
        </li>
        <li>
          <span>姓名</span>
          <p class="Contacts">
            <input type="text" placeholder="请输入姓名" v-model="contactsOneName">
          </p>
        </li>
        <li>
          <span>关系</span>
          <p id="installment">
            <select v-model="family">
              <option value="请选择">请选择</option>
              <option value="父母">父母</option>
              <option value="配偶">配偶</option>
              <option value="子女">子女</option>
              <option value="兄弟">兄弟</option>
              <option value="姐妹">姐妹</option>
            </select>
          </p>
        </li>
        <li>
          <span>手机号码</span>
          <p id="phone">
            <input type="tel" placeholder="请输入手机号码" v-model="familyPhone">
          </p>
        </li>
        <li>
          <span>联系人2</span>
        </li>
        <li>
          <span>姓名</span>
          <p class="Contacts">
            <input type="text" placeholder="请输入姓名" v-model="contactsTwoName">
          </p>
        </li>
        <li>
          <span>关系</span>
          <p id="installment">
            <select v-model="friend">
              <option value="请选择">请选择</option>
              <option value="朋友">朋友</option>
              <option value="同事">同事</option>
              <option value="其他">其他</option>
            </select>
          </p>
        </li>
        <li>
          <span>手机号码</span>
          <p id="phone">
            <input type="tel" placeholder="请输入手机号码" v-model="friendPhone">
          </p>
        </li>
      </ul>
    </div>
    <div class="userInfoTips">
      <p>如因信息虚假被拒绝，将无法再次申请。</p>
    </div>
    <div class="nextBtn" @click="nextBtn">下一步</div>
    <div class="ProvinceList" v-if="isCity">
      <div class="ProvinceTitle">
        {{cityTitleName}}
        <i @click="deleterBtn">
          <img src="@/assets/images/Authentication/delete@2x.png">
        </i>
      </div>
      <div class="ProvinceCont" v-if="ProvinceOn">
        <ul>
          <li
            :key="item.provinceId"
            v-for="item in ProvinceList"
            @click="getCity(item.provinceId,item.provinceName)"
          >{{item.provinceName}}</li>
        </ul>
      </div>
      <div class="ProvinceCont" v-if="cityOn">
        <ul>
          <li
            :key="item.cityId"
            v-for="item in cityList"
            @click="district(item.cityId,item.cityName)"
          >{{item.cityName}}</li>
        </ul>
      </div>
      <div class="ProvinceCont" v-if="districtOn">
        <ul>
          <li
            :key="item.districtId"
            v-for="item in districtList"
            @click="cityNo(item.districtId,item.districtName)"
          >{{item.districtName}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { basicInfoApi } from "@/Api/index";
export default {
  data() {
    return {
      ProvinceList: {},
      ProvinceOn: true,
      cityList: {},
      cityOn: false,
      districtList: {},
      districtOn: false,
      provinceId: "", //居住地省编码
      provinceName: "", //居住地省中文名
      cityId: "", //居住地市编码
      cityName: "", //居住地市中文名
      districtId: "", //居住地区编码
      districtName: "", //居住地区中文名
      proveCityDist: "",
      cityIf: "",
      email: "",
      zjdzInfo: "请选择",
      jzxxInfo: "",
      gsName: "",
      gsPhone: "",
      gsdzInfo: "请选择",
      gsxxInfo: "",
      family: "请选择",
      familyPhone: "",
      friend: "请选择",
      friendPhone: "",
      // jzLocationP: "", //居住地 省
      // jzLocationPCN: "", //居住地中文
      // jzLocationC: "", //居住地 市
      // jzLocationCCN: "", //居住地中文
      // jzLocationA: "", //居住地 区
      // jzLocationACN: "", //居住地中文
      gzLocationP: "", //工作地省编码
      gzLocationPCN: "", //工作地省中文名
      gzLocationC: "", //工作地市编码
      gzLocationCCN: "", //工作地市中文名
      gzLocationA: "", //工作地区编码
      gzLocationACN: "", //工作地区中文名
      driving: {},
      isCity: false,
      cityTitleName: "选择省",
      contactsOneName: "",
      contactsTwoName: ""
    };
  },
  mounted() {
    let that = this;
    window.addEventListener(
      "popstate",
      function(e) {
        that.isCity = false;
      },
      false
    );
    this.initInfo();
  },
  watch: {
    isCity: function(newVal, oldVal) {
      if (newVal === true) {
        this.pushHistory();
      }
    }
  },
  methods: {
    inputFn(e) {
      //e.target 指向了dom元素
      var __val = $(e.target).val();
      if (__val.length >= 0) {
        __val = __val.replace(/\./g, "");
      }
      __val = __val.replace(/[^\d\.]/g, "").replace(/\.{2,}/, ".");
      if (__val == ".") {
        $(e.target).val("");
        __val = 0;
      }
      if (__val.length > 2 && __val.split(".").length >= 2) {
        if (__val.match(/\./g).length > 1) {
          __val = __val.substr(0, __val.length - 1);
        }
        var __vals = __val.split(".");
        var __vals_last = __vals[1];
        if (__vals_last.length == 0) {
        } else if (__vals_last.length > 2) {
          __val = __vals[0] + "." + __vals_last.substring(0, 2);
        }
      }
      var amount = __val * 1;
      amount = amount.toFixed(2) * 1;
      if (amount == 0) {
        $(e.target).val("");
      } else {
        this.gsPhone = __val;
        $(e.target).val(__val);
        amount = amount * 1;
      }
    },
    deleterBtn() {
      this.ProvinceOn = true;
      this.isCity = false;
      this.districtOn = false;
      this.ProvinceList = {};
      this.cityList = {};
      this.districtList = {};
      this.$router.back();
    },
    pushHistory() {
      // 修改history
      var state = {
        title: "",
        url: "#/basicInfo" // 这个url可以随便填，只是为了不让浏览器显示的url地址发生变化，对页面其实无影响
      };
      window.history.pushState(state, state.title, state.url);
    },
    initInfo() {
      let data1 = {
        appNo: sessionStorage.appNo
      };
      this.$message("loading", "加载中");
      basicInfoApi
        .queryLoanInfo(data1)
        .then(result => {
          this.$hideMessage();
          if (result.data.resultCode == "1") {
            this.driving = result.data.data;
            // console.log(this.driving);
            $(".stepNext .StepImg").removeClass("StepSuccessful");
            if (this.driving.status == "A0020") {
              $(".stepNext .StepImg:nth-child(1)").addClass("StepSuccessful");
              $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
            } else if (this.driving.status == "A0030") {
              $(".stepNext .StepImg:nth-child(1)").addClass("StepSuccessful");
              $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
              $(".stepNext .StepImg:nth-child(7)").addClass("StepSuccessful");
            } else {
              $(".stepNext .StepImg:nth-child(1)").addClass("StepSuccessful");
              $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
              $(".stepNext .StepImg:nth-child(7)").addClass("StepSuccessful");
            }
            // console.log(result);
          }
        })
        .catch(err => {
          this.$hideMessage();
        });

      let data = {
        userId: sessionStorage.userId,
        appNo: sessionStorage.appNo
      };
      basicInfoApi
        .getPersonalInfo(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            const _data = result.data.data;
            console.log(_data);
            this.email = _data.email;
            if (_data.jzLocationPCN) {
              this.zjdzInfo =
                _data.jzLocationPCN +
                "-" +
                _data.jzLocationCCN +
                "-" +
                _data.jzLocationACN;
              this.provinceName = _data.jzLocationPCN;
              this.cityName = _data.jzLocationCCN;
              this.districtName = _data.jzLocationACN;
            } else {
              this.zjdzInfo = "请选择";
            }
            // this.jzLocationP = _data.jzLocationP;
            this.gzLocationPCN = _data.gzLocationPCN;
            this.gzLocationCCN = _data.gzLocationCCN;
            this.gzLocationACN = _data.gzLocationACN;
            this.jzLocationPCN = _data.jzLocationPCN;
            this.jzLocationCCN = _data.jzLocationCCN;
            this.jzLocationACN = _data.jzLocationACN;
            this.districtName = _data.jzLocationACN;
            this.provinceId = _data.jzLocationP;
            this.cityId = _data.jzLocationC;
            this.districtId = _data.jzLocationA;
            this.jzxxInfo = _data.address;
            this.gsName = _data.unitName;
            this.gsPhone = _data.unitMobile;
            if (_data.gzLocationP) {
              this.gsdzInfo =
                _data.gzLocationPCN +
                "-" +
                _data.gzLocationCCN +
                "-" +
                _data.gzLocationACN;
            } else {
              this.gsdzInfo = "请选择";
            }
            this.gzLocationP = _data.gzLocationP;
            this.gzLocationC = _data.gzLocationC;
            this.gzLocationA = _data.gzLocationA;
            this.gsxxInfo = _data.gzLocationDetail;
            if (!_data.emergencyContactList.length == "0") {
              this.family = _data.emergencyContactList[0].relation;
              this.familyPhone = _data.emergencyContactList[0].realPhone;
              this.friend = _data.emergencyContactList[1].relation;
              this.friendPhone = _data.emergencyContactList[1].realPhone;
              this.contactsOneName = _data.emergencyContactList[0].realName;
              this.contactsTwoName = _data.emergencyContactList[1].realName;
            }
          } else {
            this.$toast(result.data.errorDesc, 2000);
          }
        })
        .catch(err => {
          this.$hideMessage();
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
      this.$router.push({
        name: "installmentInfo"
      });
    },
    bindCar() {
      if (this.driving.status != "A0000" && this.driving.status == "A0030") {
        this.$router.push({
          name: "bindCar"
        });
      } else if (this.driving.status == "A0020") {
        this.$toast("请先填写基本信息", 2000);
        return false;
      } else if (this.driving.status == "A0040") {
        this.$router.push({
          name: "bindCar"
        });
      }
    },
    Province() {
      console.log(this.cityIf);
      let data = {
        districtLevel: "1"
      };
      basicInfoApi
        .getProvince(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.ProvinceList = result.data.data;
            this.cityTitleName = "选择省";
            this.isCity = true;
          } else {
            this.$toast(result.data.errorDesc, 2000);
          }
        })
        .catch(err => {
          this.$hideMessage();
        });
    },
    getCity(provinceId, provinceName) {
      if (this.cityIf == "0") {
        this.provinceId = provinceId;
        this.provinceName = provinceName;
      } else {
        this.gzLocationP = provinceId;
        this.gzLocationPCN = provinceName;
      }
      let data = {
        districtLevel: "2",
        provinceId: provinceId
      };
      basicInfoApi
        .getProvince(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.ProvinceOn = false;
            this.cityList = result.data.data;
            this.cityTitleName = "选择市";
            this.cityOn = true;
          } else {
            this.$toast(result.data.errorDesc, 2000);
          }
        })
        .catch(err => {
          this.$hideMessage();
        });
    },
    district(cityId, cityName) {
      if (this.cityIf == "0") {
        this.cityId = cityId;
        this.cityName = cityName;
      } else {
        this.gzLocationC = cityId;
        this.gzLocationCCN = cityName;
      }
      let data = {
        districtLevel: "3",
        provinceId: this.provinceId,
        cityId: cityId
      };
      basicInfoApi
        .getProvince(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.districtList = result.data.data;
            this.cityTitleName = "选择区/县";
            this.cityOn = false;
            this.districtOn = true;
          } else {
            this.$toast(result.data.errorDesc, 2000);
          }
        })
        .catch(err => {
          this.$hideMessage();
        });
    },
    cityNo(districtId, districtName) {
      if (this.cityIf == "0") {
        this.districtId = districtId;
        this.districtName = districtName;
        this.proveCityDist =
          this.provinceName + "-" + this.cityName + "-" + districtName;
      } else {
        this.gzLocationA = districtId;
        this.gzLocationACN = districtName;
        this.proveCityDist =
          this.gzLocationPCN + "-" + this.gzLocationCCN + "-" + districtName;
      }
      this.isCity = false;
      this.$router.back();
      this.ProvinceOn = true;
      this.cityOn = false;
      this.districtOn = false;
      // console.log(this.districtId + this.proveCityDist);
      if (this.cityIf == "0") {
        this.zjdzInfo = this.proveCityDist;
      } else {
        this.gsdzInfo = this.proveCityDist;
        // console.log(this.gsdzInfo);
      }
    },
    userProvince() {
      // 居住
      this.cityIf = "0";
      this.ProvinceOn = true;
      this.cityOn = false;
      this.districtOn = false;
      this.Province();
    },
    gsProvince() {
      this.cityIf = "1"; //工作
      this.ProvinceOn = true;
      this.cityOn = false;
      this.districtOn = false;
      this.Province();
    },
    nextBtn() {
      //验证邮箱
      const regEmail = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
      if (this.email == "" || this.email == undefined) {
        this.$toast("请输入邮箱", 2000);
        return false;
      } else if (!regEmail.test(this.email)) {
        this.$toast("邮箱格式不正确", 2000);
        return false;
      }
      //验证居住地址
      if (this.zjdzInfo == "请选择" || this.zjdzInfo == undefined) {
        this.$toast("请选择居住地址", 2000);
        return false;
      }
      //验证居住地址详细信息
      if (this.jzxxInfo == "" || this.jzxxInfo == undefined) {
        this.$toast("请填写详细居住地址", 2000);
        return false;
      }
      //验证公司名称
      if (this.gsName == "" || this.gsName == undefined) {
        this.$toast("请填写公司名称", 2000);
        return false;
      }
      //验证公司电话
      if (this.gsPhone == "" || this.gsPhone == undefined) {
        this.$toast("请填写公司电话", 2000);
        return false;
      }
      //验证公司地址
      if (this.gsdzInfo == "请选择") {
        this.$toast("请选择公司地址", 2000);
        return false;
      }
      //验证公司地址详细信息
      if (this.gsxxInfo == "" || this.gsxxInfo == undefined) {
        this.$toast("请填写公司详细地址", 2000);
        return false;
      }
      if (this.contactsOneName == "" || this.contactsOneName == undefined) {
        this.$toast("请输入联系人1姓名", 2000);
        return false;
      }
      //联系人信息1
      if (this.family == "请选择") {
        this.$toast("请选择联系人1信息", 2000);
        return false;
      }
      //联系人信息1电话
      const myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
      if (this.familyPhone == "" || this.familyPhone == undefined) {
        this.$toast("请输入联系人1电话", 2000);
        return false;
      } else if (!myreg.test(this.familyPhone)) {
        this.$toast("请正确输入联系人1电话", 2000);
        return false;
      }
      if (this.contactsTwoName == "" || this.contactsTwoName == undefined) {
        this.$toast("请输入联系人2姓名", 2000);
        return false;
      }
      //联系人信息2
      if (this.friend == "请选择") {
        this.$toast("请选择联系人2信息", 2000);
        return false;
      }
      //联系人信息2电话
      if (this.friendPhone == "" || this.friendPhone == undefined) {
        this.$toast("请输入联系人2电话", 2000);
        return false;
      } else if (!myreg.test(this.friendPhone)) {
        this.$toast("请正确输入联系人2电话", 2000);
        return false;
      }
      let data = {
        userId: sessionStorage.userId,
        appNo: sessionStorage.appNo,
        jzLocation: this.districtId + "",
        jzLocationCn: this.zjdzInfo,
        address: this.jzxxInfo,
        unitName: this.gsName,
        unitMobile: this.gsPhone,
        gzLocation: this.gzLocationA + "",
        gzLocationDetail: this.gsxxInfo,
        email: this.email,
        gzLocationCn: this.gsdzInfo,
        jzLocationP: this.provinceId + "",
        jzLocationPCN: this.provinceName,
        jzLocationC: this.cityId + "",
        jzLocationCCN: this.cityName,
        jzLocationA: this.districtId + "",
        jzLocationACN: this.districtName,
        gzLocationP: this.gzLocationP + "",
        gzLocationPCN: this.gzLocationPCN,
        gzLocationC: this.gzLocationC + "",
        gzLocationCCN: this.gzLocationCCN,
        gzLocationA: this.gzLocationA + "",
        gzLocationACN: this.gzLocationACN,
        workNature: "上班族",
        monthlyIncome: "4000元-8000元",
        contactPersonList: [
          {
            userId: sessionStorage.userId,
            relation: this.family,
            realName: this.contactsOneName,
            realPhone: this.familyPhone + ""
          },
          {
            userId: sessionStorage.userId,
            relation: this.friend,
            realName: this.contactsTwoName,
            realPhone: this.friendPhone + ""
          }
        ]
      };
      basicInfoApi
        .addPersonalInfo(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            this.$router.push({
              name: "bindCar"
            });
          } else {
            this.$toast(result.data.errorDesc, 2000);
          }
        })
        .catch(err => {
          this.$hideMessage();
          this.$toast(result.data.errorDesc, 2000);
        });
    },
    imgUpload() {
      this.$router.push({
        name: "imgUpload"
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
.ProvinceList {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1001;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  .ProvinceTitle {
    width: 100%;
    line-height: 3.13rem;
    height: 3.13rem;
    background: #fff;
    text-align: center;
    font-size: 1.06rem;
    font-weight: bold;
    position: fixed;
    z-index: 1002;
    border-bottom: 1px solid #ccc;
    i {
      width: 0.97rem;
      height: 0.97rem;
      position: absolute;
      right: 0.94rem;
      top: 0.16rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .ProvinceCont {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding-top: 3.13rem;
    overflow-y: scroll;
    background: #fff;
    ul li {
      height: 2.5rem;
      line-height: 2.5rem;
      padding-left: 0.94rem;
      background: #fff;
      border-bottom: 1px solid #ccc;
    }
  }
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
  padding-left: 1.2rem;
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
.yrzUserInfo ul li:last-child {
  border: none;
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
.moreTitel {
  height: 2.03rem;
  line-height: 2.03rem;
  background: #f0f0f0;
  padding: 0 0.94rem;
  font-size: 0.75rem;
  color: #666;
}
.Contacts input {
  border: none;
  background: none;
  text-align: right;
  color: #333;
}
#email input,
#enterprise input,
#phone input {
  border: none;
  background: none;
  text-align: right;
  color: #333;
}
#cityBtn input#Province {
  background: url("../../assets/images/Authentication/confirm2@2x.png") right
    no-repeat;
  background-size: 0.75rem;
  border: none;
  display: block;
  text-align: right;
  width: 100%;
  padding-right: 0.94rem;
  height: 2.5rem;
}
#cityBtn input#city {
  display: block;
  border: none;
  text-align: right;
  width: 100%;
  height: 3.13rem;
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
</style>

