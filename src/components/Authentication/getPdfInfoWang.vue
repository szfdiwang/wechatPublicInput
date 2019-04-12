<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/icon_40x40_1@2x.png">
      </i> 借款人告知书
    </div>
    <div class="urlInfo">
      <iframe :src="url" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>
<script>
import pdf from "../../../static/pdf/build/pdf.js";
export default {
  data() {
    return {
      url: ""
    };
  },
  mounted() {
    if (process.env.NODE_ENV == "sitEnvironment") {
      var pdfUrl =
        "https://test.myerong.com:5080/openstatic/files/RISK_NOTICE.pdf";
      this.url = `static/pdf/web/viewer.html?file=${encodeURIComponent(
        pdfUrl
      )}`;
    } else if (process.env.NODE_ENV == "production") {
      var pdfUrl =
        "http://api.myerong.com/asssets/inner/openstatic/files/RISK_NOTICE.pdf";
      this.url = `static/pdf/web/viewer.html?file=${encodeURIComponent(
        pdfUrl
      )}`;
    }
    //    this.url = encodeURIComponent(`http://localhost:8999/apis/asssets/inner/erong-cfss-phss/loanInfo/getPdfStreamWithParams?appNo=BA201901230023000010`);
  },
  methods: {
    fhBtn() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
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
.urlInfo {
  width: 100%;
  height: 100%;
  padding-top: 2.75rem;
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  iframe {
    border: none;
  }
}
</style>
