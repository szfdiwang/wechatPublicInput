<template>
  <div id="toastWrap" v-if="show">
    <span class="text_box">{{text}}</span>
  </div>
</template>
<script>
export default {
  name: "toast",
  data() {
    return {};
  },
  methods: {}
}
</script>

<style  lang="scss" scoped>
#toastWrap {
  z-index: 10000000000;
  width: auto;
  max-width: 15.875rem;
  padding: 0.4rem 1rem 0.4rem 1rem;
  height: auto;
  border-radius: 1.0625rem;
  position: fixed;
  left: 50%;
  bottom: 4.65625rem;
  background: rgba(51, 51, 51, 1);
  opacity: 1;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
  .text_box {
    height: auto;
    font-size: 0.8125rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    // line-height: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>