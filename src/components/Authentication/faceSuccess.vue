<template>
  <div class="appBg">
    <div class="bgPostion"></div>
    <div class="bar_nav bar_nav_Boder">提示</div>
    <div class="success" v-if="ifSuccess">
      <img src="@/assets/images/Authentication/adopt@2x.png">
      <h2>识别成功</h2>
      <p>人像识别成功，即将跳转下一步</p>
    </div>
    <div class="failed" v-if="ifFailed">
      <img src="@/assets/images/Authentication/prompt@2x.png">
      <h2>提交失败</h2>
      <p>{{failedMsg}}</p>
    </div>
  </div>
</template>
<script>
import { nameAhcApi } from "@/Api/index";
export default {
  name: "",
  data() {
    return {
      ifSuccess: false,
      ifFailed: false,
      failedMsg: "原因：您的综合信用评分不足，不予通过！"
    };
  },
  mounted() {
    this.getResultSync();
    //页面初始化时去查一次结果 成功向前跳转 失败向后跳转
  },
  methods: {
    getResultSync() {
      let data = {
        orderNo: sessionStorage.appNo, //"BA201901100023000028", //
        nonce: sessionStorage.nonce,
        userId: sessionStorage.userId
      };
      this.$message("loading");
      nameAhcApi
        .getResultSync(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            if (result.data.data.code == "0") {
              let params = {
                idType: "001",
                idNo: sessionStorage.idNo,
                name: sessionStorage.name,
                cellphone: sessionStorage.mobilePhone,
                channelNum: "H5",
                appNo: sessionStorage.appNo,
                applyNo: sessionStorage.appNo,
                blackbox: sessionStorage.blackbox
              };
              nameAhcApi
                .checkUserRisk(params)
                .then(result => {
                  this.$hideMessage();
                  if (result.data.resultCode == "1") {
                    if (!!result.data.status) {
                      //失败
                      this.ifFailed = true;
                      this.ifSuccess = false;
                    } else {
                      //成功
                      this.ifSuccess = true;
                      this.ifFailed = false;
                      setTimeout(() => {
                        this.$router.push({
                          name: "installmentInfo"
                        });
                      }, 3000);
                    }
                  } else {
                    this.$router.push({
                      name: "nameAhc"
                    });
                  }
                })
                .catch(err => {
                  this.$hideMessage();
                });
              //成功
            } else {
              this.ifFailed = true;
              this.ifSuccess = false;
              this.failedMsg = result.data.data.msg;
              this.$hideMessage();
            }
          } else {
            this.ifFailed = true;
            this.ifSuccess = false;
            this.failedMsg = result.data.data.msg;
            this.$hideMessage();
          }
        })
        .catch(err => {
          this.$hideMessage();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.topBar {
  height: 2.75rem;
}
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
.bgPostion {
  position: fixed;
  z-index: -99;
  background: #f0f0f0;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.success {
  padding: 5.75rem 0 1.25rem;
  text-align: center;
  background: #fff;
  img {
    width: 5rem;
  }
  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1a1a1a;
    margin-top: 0.63rem;
  }
  p {
    font-size: 1rem;
    margin-top: 0.63rem;
    color: #999;
  }
}
.failed {
  padding: 5.75rem 0 1.25rem;
  text-align: center;
  background: #fff;
  img {
    width: 5rem;
  }
  h2 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1a1a1a;
    margin-top: 0.63rem;
  }
  p {
    font-size: 1rem;
    margin-top: 0.63rem;
    color: #999;
  }
}
.nextBtn {
  margin: 1.56rem 1.72rem;
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  font-size: 1.06rem;
  color: #fff;
  border-radius: 1.31rem;
  background: #f6ab00;
}
.returnIndex {
  color: #f6ab00;
  background: #fff;
  border: 1px solid #f6ab00;
}
.mgt50 {
  margin-top: 1.56rem;
}
</style>