<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/icon_40x40_1@2x.png">
      </i> 合同信息
    </div>
    <div class="urlInfo">
      <iframe :src="url" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>
<script>
import { pdfApi } from "@/Api/index";
import pdf from "../../../static/pdf/build/pdf.js";
export default {
  data() {
    return {
      url: ""
    };
  },
  //动态显示后台传递流文件
  mounted() {
    // var pdfUrl =
    //     "http://localhost:8999/apis/asssets/inner/erong-cfss-phss/loanInfo/getPdfStreamWithParams?appNo=BA201901230023000010&asdsa.pdf";
    //   this.url = `../../../static/pdf/web/viewer.html?file=${encodeURIComponent(
    //     pdfUrl
    //   )}`;
    if (process.env.NODE_ENV == "sitEnvironment") {
      //sitEnvironment
      var pdfUrl =
        "https://test.myerong.com:5080/asssets/inner/erong-cfss-phss/loanInfo/getPdfStreamWithParams?appNo=" +
        sessionStorage.appNo +
        "&asdsa.pdf";
      this.url = `static/pdf/web/viewer.html?file=${encodeURIComponent(
        pdfUrl
      )}`;
    } else if (process.env.NODE_ENV == "production") {
      //production
      var pdfUrl =
        "http://api.myerong.com/asssets/inner/erong-cfss-phss/loanInfo/getPdfStreamWithParams?appNo=" +
        sessionStorage.appNo +
        "&asdsa.pdf";
      this.url = `static/pdf/web/viewer.html?file=${encodeURIComponent(
        pdfUrl
      )}`;
    } else {
      console.log("环境有误");
    }
    // this.getDataArray();
    //    this.url = encodeURIComponent(`http://localhost:8999/apis/asssets/inner/erong-cfss-phss/loanInfo/getPdfStreamWithParams?appNo=BA201901230023000010`);
  },
  methods: {
    fhBtn() {
      this.$router.go(-1);
    }
    // getDataArray() {
    //   let that = this;
    //   // let DEFAULT_URL = "";
    //   // let PDFData = "";
    //   let data = {
    //     id: "" + new Date().getTime(),
    //     appNo: sessionStorage.appNo
    //   };
    //   pdfApi
    //     .getDataArray(data)
    //     .then(result => {
    //       if (result.data.result == "1") {
    //         //TODO
    //         let PDFData = result.data;
    //         const rawLength = result.data.length;
    //         var array = new Uint8Array(new ArrayBuffer(rawLength));
    //         for (i = 0; i < rawLength; i++) {
    //           array[i] = PDFData.charCodeAt(i) & 0xff;
    //         }
    //         that.url = array;
    //       }
    //     })
    //     .catch(err => {});
    // }
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
