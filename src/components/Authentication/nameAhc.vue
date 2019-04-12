<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/return2@2x.png">
      </i> 实名认证
    </div>
    <div class="infoStep clearfix">
      <div class="stepNext">
        <div class="StepImg StepState"></div>
        <div class="gan"></div>
        <div class="StepImg StepSuccessful"></div>
        <div class="gan"></div>
        <div class="StepImg"></div>
        <div class="gan"></div>
        <div class="StepImg"></div>
      </div>
      <div class="StepTxt">
        <ul>
          <li>实名认证</li>
          <li @click="installmentInfo">分期信息</li>
          <li @click="basicInfo">基本信息</li>
          <li @click="bindCar">绑卡与提交</li>
        </ul>
      </div>
    </div>
    <div class="wrzUserInfo" v-if="iswrzShow">
      <div class="userCarId">
        <div class="carTips">完成认证需要核实您的身份信息，请扫描您本人身份证</div>
        <input id="useCamera1" type="file" accept="image/*" capture="camera" style="display:none">
        <input id="useCamera2" type="file" accept="image/*" capture="camera" style="display:none">
        <div class="carIdUpdate" @click="checkPositive">
          <img id="zheng" src="@/assets/images/Authentication/certificate1@2x.png">
          <p>身份证正面扫描</p>
        </div>
        <div class="carIdUpdate" @click="checkNegative">
          <img id="fan" src="@/assets/images/Authentication/certificate1@2x.png">
          <p>身份证反面扫描</p>
        </div>
      </div>
      <div class="hrbar"></div>
      <div class="UpdataCarTips">
        <div class="carTips">
          扫描时请确保身份证
          <span>边框完整、字迹清晰、亮度均衡。</span>
        </div>
        <div class="carIdTips">
          <ul>
            <li>
              <img src="@/assets/images/Authentication/sample1@2x.png">
              <p>标准</p>
            </li>
            <li>
              <img src="@/assets/images/Authentication/sample2@2x.png">
              <p>边框缺失</p>
            </li>
            <li>
              <img src="@/assets/images/Authentication/sample3@2x.png">
              <p>照片模糊</p>
            </li>
            <li>
              <img src="@/assets/images/Authentication/sample4@2x.png">
              <p>闪光强烈</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="yrzUserInfo" v-if="isyrzShow">
      <ul>
        <li>
          <span>姓名</span>
          <p>{{uName}}</p>
        </li>
        <li>
          <span>身份证号</span>
          <p>{{idNo}}</p>
        </li>
      </ul>
    </div>
    <div class="nextBtn" @click="uploadFile()">下一步</div>
  </div>
</template>
<script>
import { _debounce } from "@/utils/index";
import { nameAhcApi } from "@/Api/index";
import { mapMutations } from "vuex";

export default {
  name: "nameAhc",
  data() {
    return {
      isyrzShow: false,
      iswrzShow: false,
      sign: "",
      maxSize: 3 * 1024 * 1024,
      zhengPhoto: {},
      fanPhoto: {},
      photoFiles: [],
      uName: "张三",
      idNo: "12345678",
      driving: {},
      ocrId: 0,
      zhengReady: false,
      fanReady: false
    };
  },
  mounted() {
    this.initStatus();
  },
  methods: {
    initStatus() {
      //查一次进度
      this.$message("loading", "加载中");
      let data = {
        appNo: sessionStorage.appNo
      };
      nameAhcApi
        .getLoanStep(data)
        .then(result => {
          //OcrId
          if (result.data.resultCode == "1") {
            if (result.data.data.status == "A0000") {
              //未认证
              this.iswrzShow = true;
              this.isyrzShow = false;
              this.$hideMessage();
            } else {
              //未人脸
              //已经认证
              this.iswrzShow = false;
              this.isyrzShow = true;
              let data = {
                userId: sessionStorage.userId,
                appNo: sessionStorage.appNo
              };
              nameAhcApi
                .getPersonalInfo(data)
                .then(result => {
                  this.$hideMessage();
                  // this.sign = result.data;
                  if (result.data.resultCode == "1") {
                    this.uName = result.data.data.name;
                    this.idNo = result.data.data.identityNote;
                  }
                })
                .catch(err => {
                  this.$hideMessage();
                });
            }
            /**
             *  A0000("A0000","未实名"), 增加一个状态 身份证认证通过 而人脸未通过或者未进行
                A0010("A0010","实名认证成功"),
                A0020("A0020","保存分期信息成功"),
                A0030("A0030","保存基本信息成功"),
                A0035("A0035","保存车辆影像信息成功"),
                A0040("A0040","保存银行卡信息成功"),
                A0045("A0045","贷款提交中间态"),
                A0050("A0050","保全回调成功"),
                // A0060("A0060","推送APS系统失败");
             */
          }
          this.driving = result.data.data;
          // console.log(this.driving);
          console.log(result);
          $(".stepNext .StepImg").removeClass("StepSuccessful");
          if (this.driving.status == "A0020") {
            $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
          } else if (this.driving.status == "A0030") {
            $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(5)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(7)").addClass("StepSuccessful");
          } else if (
            this.driving.status == "A0040" ||
            this.driving.state == "A0050"
          ) {
            $(".stepNext .StepImg:nth-child(3)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(5)").addClass("StepSuccessful");
            $(".stepNext .StepImg:nth-child(7)").addClass("StepSuccessful");
          }
        })
        .catch(err => {
          this.$hideMessage();
        });
    },
    fhBtn() {
      this.$router.go(-1);
    },
    installmentInfo() {
      if (this.driving.status != "A0000") {
        this.$router.push({
          name: "installmentInfo"
        });
      }
    },
    basicInfo() {
      if (
        (this.driving.status != "A0000" && this.driving.status == "A0020") ||
        this.driving.status == "A0030" ||
        this.driving.status == "A0040"
      ) {
        this.$router.push({
          name: "basicInfo"
        });
      }
    },
    bindCar() {
      if (this.driving.status != "A0000" && this.driving.status == "A0030") {
        this.$router.push({
          name: "bindCar"
        });
      } else if (this.driving.status == "A0010") {
        this.$toast("请先填写分期信息", 2000);
        return false;
      } else if (this.driving.status == "A0020") {
        this.$toast("请先填写基本信息", 2000);
        return false;
      } else if (this.driving.status == "A0040") {
        this.$router.push({
          name: "bindCar"
        });
      }
    },
    ...mapMutations(["saveUserInfo"]),
    //将base64转换为blob
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
    //将base64转换为blob
    dataURLtoBlob: function(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    //将blob转换为file
    blobToFile: function(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },

    compressFn(result, tag, tagDom, file) {
      this.$message("loading", "图片压缩中...");
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
        $(tagDom).attr("src", data);
        if (tag == "zheng") {
          // _that.zhengPhoto = _that.dataURLtoFile(data, file.name); //_that.blobToFile(blob, file.name);
          _that.zhengPhoto = _that.blobToFile(
            _that.dataURLtoBlob(data),
            file.name
          );
          _that.$hideMessage();
        } else {
          _that.fanPhoto = _that.blobToFile(
            _that.dataURLtoBlob(data),
            file.name
          );
          _that.$hideMessage();
        }
      };
    },
    checkPositive() {
      let _that = this;
      //清空一次
      this.zhengPhoto = null;
      //正面上传
      $("#useCamera1").click();
      $("#useCamera1").off("change");
      $("#useCamera1").change(function(e) {
        let files = e.target.files || e.dataTransfer.files;
        let file = files[0];
        if (!this.files.length) return;
        if (!/\/(?:jpeg|png|gif)/i.test(files[0].type)) return;
        // _that.zhengPhoto = files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
          _that.compressFn(this.result, "zheng", "#zheng", file);
        };
        reader.readAsDataURL(files[0]);
        //项目中只限定上传单张图片。
      });
    },
    checkNegative() {
      let _that = this;
      _that.fanPhoto = null;
      //反面上传
      $("#useCamera2").click();
      $("#useCamera2").off("change");
      $("#useCamera2").change(function(e) {
        let files = e.target.files || e.dataTransfer.files;
        let file = files[0];
        if (!this.files.length) return;
        if (!/\/(?:jpeg|png|gif)/i.test(files[0].type)) return;
        // _that.zhengPhoto = files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
          _that.compressFn(this.result, "fan", "#fan", file);
        };
        reader.readAsDataURL(files[0]);
        //项目中只限定上传单张图片。
      });
    },
    //身份证号校验年龄
    checkIdNo(identityCard) {
      var len = (identityCard + "").length;
      if (len == 0) {
        return 0;
      } else {
        if (len != 15 && len != 18) {
          //身份证号码只能为15位或18位其它不合法
          return 0;
        }
      }
      var strBirthday = "";
      if (len == 18) {
        //处理18位的身份证号码从号码中得到生日和性别代码
        strBirthday =
          identityCard.substr(6, 4) +
          "/" +
          identityCard.substr(10, 2) +
          "/" +
          identityCard.substr(12, 2);
      }
      if (len == 15) {
        strBirthday =
          "19" +
          identityCard.substr(6, 2) +
          "/" +
          identityCard.substr(8, 2) +
          "/" +
          identityCard.substr(10, 2);
      }
      //时间字符串里，必须是“/”
      var birthDate = new Date(strBirthday);
      var nowDateTime = new Date();
      var age = nowDateTime.getFullYear() - birthDate.getFullYear();
      //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
      if (
        nowDateTime.getMonth() < birthDate.getMonth() ||
        (nowDateTime.getMonth() == birthDate.getMonth() &&
          nowDateTime.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    },
    //调用照相机
    uploadFile: _debounce(function() {
      // do something ...
      let files = document.getElementById("zheng");
      if (this.driving.status == "A0000") {
        this.$message("loading", "数据提交中...");
        let formData = new FormData();
        // if (zhengReady && fanReady) {
        //   this.$toast("图片还未加载完", 请稍后);
        //   return;
        // }
        formData.append("files", this.zhengPhoto);
        formData.append("files", this.fanPhoto);
        formData.append("userId", sessionStorage.userId);
        formData.append("orderNo", sessionStorage.appNo);
        nameAhcApi
          .uploadPhoto(formData)
          .then(result => {
            this.$hideMessage();
            if (result.data.resultCode == "1") {
              if (result.data.data.userName) {
                let age = this.checkIdNo(result.data.data.idNo);
                if (18 <= age && age <= 55) {
                  //身份证号码 姓名存放
                  let userInfo = {
                    name: result.data.data.userName,
                    idNo: result.data.data.idNo
                  };
                  // this.saveUserInfo(userInfo);
                  sessionStorage.setItem("name", userInfo.name);
                  sessionStorage.setItem("idNo", userInfo.idNo);
                  //上传成功 进入人脸识别
                  this.$router.push({
                    name: "userFace"
                  });
                } else {
                  this.$messageBox(
                    "bad",
                    "很抱歉，您的年龄不符合要求，分期年龄要求18-55周岁。"
                  );
                }
              } else {
                if (result.data.data.msg == "非身份证人像面") {
                  this.$toast("请先上传身份证人像面", 3000);
                  this.$hideMessage();
                } else if (
                  result.data.data.msg &&
                  result.data.data.msg != "非身份证人像面"
                ) {
                  this.$toast(result.data.data.msg, 3000);
                  this.$hideMessage();
                } else {
                  this.$toast(result.data.data.msg, 3000);
                  this.$hideMessage();
                }
              }
            } else {
              this.$toast("网络繁忙,请稍后再试", 3000);
            }
          })
          .catch(err => {
            this.$hideMessage();
          });
      } else {
        this.$router.push({
          name: "installmentInfo"
        });
      }
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
.userCarId {
  margin-top: 0.94rem;
  padding: 0 0.94rem;
}
.carTips {
  color: #919191;
  font-size: 0.63rem;
}
.carTips span {
  color: #e9434c;
}
.carIdUpdate {
  margin: 0.94rem 4.53rem;
  padding: 0.94rem;
  height: 7.81rem;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  text-align: center;
}
.carIdUpdate img {
  width: 7.19rem;
  height: 4.6875rem;
}
.carIdUpdate p {
  color: #f6ab00;
}
.hrbar {
  height: 0.31rem;
  background: #f6f6f6;
  margin-top: 1.25rem;
}
.UpdataCarTips {
  padding: 0.94rem;
}
.carIdTips {
  margin-top: 0.94rem;
}
.carIdTips ul {
  display: -webkit-flex;
  display: flex;
}
.carIdTips ul li {
  margin-right: 0.47rem;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  width: 0%;
  display: block;
  text-align: center;
}
.carIdTips ul li:last-child {
  margin: 0;
}
.carIdTips ul li img {
  width: 100%;
}
.carIdTips ul li p {
  font-size: 0.63rem;
  color: #919191;
}
.nextBtn {
  margin: 1.56rem 1.72rem;
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  font-size: 1rem;
  color: #fff;
  border-radius: 1.31rem;
  background: #f6ab00;
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
</style>

