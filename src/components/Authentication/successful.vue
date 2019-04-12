<template>
  <div class="appBg">
    <div class="bgPostion"></div>
    <div class="bar_nav bar_nav_Boder">提示</div>
    <div class="success">
      <img src="@/assets/images/Authentication/adopt@2x.png">
      <h2>提交成功</h2>
      <p>{{text}}</p>
    </div>
    <div class="nextBtn" @click="goMyMoney">我的借款</div>
    <div class="nextBtn returnIndex" @click="goIndex">首页</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: this.info || "您已申请成功，请耐心等待审批"
    };
  },
  mounted() {},
  computed: {
    info: function() {
      return this.$route.params.errorInfo;
    }
  },
  methods: {
    goMyMoney() {
      if (process.env.NODE_ENV == "sitEnvironment") {
        window.location.href =
          "https://test.myerong.com:5080/openstatic/WeChatPublic/RepaymentList.html";
      } else if (process.env.NODE_ENV == "production") {
        window.location.href =
          "http://api.myerong.com/asssets/inner/openstatic/daehaoche/WeChatPublic/RepaymentList.html";
      } else {
        console.log("环境有误");
      }
    },
    goIndex() {
      this.$router.push({
        name: "login"
      });
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
