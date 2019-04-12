<template>
  <div class="err_Bg">
    <div class="inner_img">
      <img src="@/assets/icon/icon_404.png">
     
    </div>
    <div class="inner_btn">
       <el-button class="backBtn" @click="backFn" round>返回主页</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "error404",
  data() {
    return {};
  },
  mounted() {},
  components: {},
  created: function() {},
  methods: {
    backFn() {
      this.$router.push({ name: "homepage" });
    }
  }
};
</script>
<style lang="scss">

</style>