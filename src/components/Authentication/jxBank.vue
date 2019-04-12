<template>
  <div>
    <!-- <div style="width:20px;height:20px;margin:0 auto">页面跳转中</div> -->
    <iframe id="myIframe" frameborder="0">
      <!-- <div class="jx_bank_warp">
      <!-- <div v-html="htmlData"></div>-->
    </iframe>
  </div>
</template>
<script>
export default {
  name: "jxBank",
  data() {
    return {
      htmlData: ""
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    getParams() {
      if (this.$route.params.newForm) {
        let origin = this.$route.params.newForm;
        let str = origin.indexOf("<form");
        let endStr = origin.indexOf("form>");
        let realStr = origin.substring(str, endStr + 5);
        console.log(realStr);
        this.htmlData = realStr;
        $("#myIframe").append(realStr);
        document.forms[0].submit();
      } else {
        this.$toast("未获取到银行表单请返回重试", 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
