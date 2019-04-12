<template>
  <div id="message_warpper" @touchmove.prevent>
    <div id="loading"></div>
    <div id="messageWrap" v-if="show">
      <div class="img_box">
        <img :src="src">
      </div>
      <span class="text_box">{{text}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "message",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style  lang="scss" scoped>
#messageWrap {
  z-index: 100000000;
  width: 7.5rem;
  height: 7.5rem;
  position: fixed;
  left: 50%;
  top: 40%;
  background: rgba(0, 0, 0, 1);
  opacity: 1;
  border-radius: 0.3125rem;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
  img {
    width: 3.125rem;
    height: 3.125rem;
    margin-top: 1.59375rem;
    display: inline-block;
  }
  .text_box {
    height: 0.875rem;
    font-size: 0.8125rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    display: inline-block;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }
}
#loading {
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #888888;
  z-index: 9999;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}
</style>