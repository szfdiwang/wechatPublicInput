<template>
  <div class="appBg">
    <!-- <div class="bar_nav">
            <i @click="fhBtn">
                <img src="@/assets/images/Authentication/icon_40x40_1@2x.png">
            </i> 合同信息
    </div>-->
    <div class="urlInfo">
      <iframe :src="url" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: ""
    };
  },
  mounted() {
    this.url = this.$route.params.url;
  },
  methods: {
    fhBtn() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.urlInfo {
  width: 100%;
  height: 100%;
  // padding-top: 2.75rem;
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  iframe {
    border: none;
  }
}
</style>
