<template>
  <div v-if="shallWeTalk">
    <div id="out-cover-box">
    </div>
    <div id="inner-message-box">
      <img src="../assets/svg/loading.svg">
    </div>
  </div>
</template>
<script>
export default {
  name: "vLoading",
  props: ["shallWeTalk"],
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
#out-cover-box {
  z-index: 100000;
  background-color: rgb(221, 217, 217);
  display: flex;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

#inner-message-box {
  z-index: 100002; // border: 1px pink solid;
  width: 50px;
  height: 50px;
  position: fixed;
  opacity: 1.2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  -webkit-align-items:center;
  -webkit-justify-content: center;
  justify-content: center;
}
</style>