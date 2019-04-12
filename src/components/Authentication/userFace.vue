<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/index/return@2x.png">
      </i> 人脸识别
    </div>
    <div class="userFaceInfo">
      <p>人脸验证上传的照片用于身份审核，请正对手机，进行人脸识别</p>
      <span>（如扫描失败，请返回重新操作）</span>
    </div>
    <div class="userFaseImg">
      <img src="@/assets/images/Authentication/identify@2x.png">
    </div>
    <div class="nextBtn" @click="recognition()">开始认证</div>
  </div>
</template>
<script>
import { nameAhcApi } from "@/Api/index";
import { mapMutations } from "vuex";
export default {
  name: "userFace",
  data() {
    return {
      ticket: ""
    };
  },
  mounted() {
    this.getBlackBox();
    this.getSign();
  },
  methods: {
    getBlackBox() {
      window._fmOpt = {
        partner: "myerong",

        appName: "myerong_xf_h5",

        token:
          "myerong" +
          "-" +
          new Date().getTime() +
          "-" +
          Math.random()
            .toString(16)
            .substr(2),

        fmb: true,

        success: function(data) {
          // 在成功完成采集后，success回调中可以获取到blackbox
          console.log("blackbox: ", data);
          sessionStorage.setItem("blackbox", data);
        },

        fpHost: "https://fptest.fraudmetrix.cn",

        staticHost: "statictest.fraudmetrix.cn",

        tcpHost: "fpflashtest.fraudmetrix.cn",

        wsHost: "fptest.fraudmetrix.cn:9090"
      };

      var cimg = new Image(1, 1);

      cimg.onload = function() {
        _fmOpt.imgLoaded = true;
      };

      cimg.src =
        "https://fptest.fraudmetrix.cn/fp/clear.png?partnerCode=myerong&appName=myerong_xf_h5&tokenId=" +
        _fmOpt.token;

      var fm = document.createElement("script");
      fm.type = "text/javascript";
      fm.async = true;

      fm.src =
        ("https:" == document.location.protocol ? "https://" : "http://") +
        "static.fraudmetrix.cn/v3/fm.js?ver=0.1&t=" +
        (new Date().getTime() / 3600000).toFixed(0);

      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(fm, s);
    },
    fhBtn() {
      this.$router.go(-1);
    },
    ...mapMutations(["saveNonce"]),
    getSign() {
      let data = {};
      nameAhcApi
        .getTicket(data)
        .then(result => {
          if (result.data) {
            this.ticket = result.data.ticket;
          }
        })
        .catch(err => {});
    },
    recognition() {
      let that = this;
      //请求faceid
      that.$message("loading", "加载中");
      let data = {
        orderNo: sessionStorage.appNo,
        userId: sessionStorage.userId,
        name: sessionStorage.name,
        idNo: sessionStorage.idNo
      };
      nameAhcApi
        .getFaceId(data)
        .then(result => {
          that.$hideMessage();
          if (result.data.resultCode == "1") {
            if (result.data.data.h5faceId) {
              let h5faceId = result.data.data.h5faceId;
              let nonce = result.data.data.nonce;
              that.saveNonce(nonce);
              let sign = result.data.data.sign;
              let data = {};
              // "https%3A%2F%2Ftest.myerong.com%3A5080%2Fopenstatic%2FstagesAuthentication%2Findex.html%23%2FfaceSuccess";
              // "https%3A%2F%2Fapi.myerong.com%3A5080%2Fopenstatic%2FstagesAuthentication%2Findex.html%23%2FfaceSuccess"
              // https://api.myerong.com:5080/openstatic/stagesAuthentication/index.html#/faceSuccess
              let appId;
              if (process.env.NODE_ENV == "sitEnvironment") {
                appId = "TIDAgveb";
              } else if (process.env.NODE_ENV == "production") {
                appId = "IDAT3GCi";
              }
              let basicUrl = `${
                process.env.STATICURL
              }/openstatic/stagesAuthentication/index.html#/faceSuccess`;
              let backurl = encodeURIComponent(basicUrl);
              let url =
                "https://ida.webank.com/api/web/login?webankAppId=" +
                appId +
                "&version=1.0.0&nonce=" +
                nonce +
                "&orderNo=" +
                sessionStorage.appNo +
                "&h5faceId=" +
                h5faceId +
                "&url=" +
                backurl +
                "&resultType=1&userId=" +
                sessionStorage.userId +
                "&sign=" +
                sign +
                "&from=browser";
              window.location.href = url;
            }
          }
        })
        .catch(err => {
          // that.$hideMessage();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bar_nav{
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
.userFaceInfo {
  padding: 5.25rem 1.25rem 0;
  text-align: center;
}
.userFaceInfo p {
  font-size: 0.69rem;
  color: #919191;
}
.userFaceInfo span {
  font-size: 0.56rem;
  color: #919191;
}
.userFaseImg {
  padding: 4.38rem 3.28rem;
}
.userFaseImg img {
  width: 100%;
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
</style>

