<template>
  <div id="message_box_warpper" v-if="show" @touchmove.prevent>
    <div id="loading"></div>
    <div id="messageWrap">
      <div class="img_box">
        <img :src="src">
      </div>
      <div class="text_box">
        <span v-if="showText">{{text}}</span>
        <p v-else>分期信息<span class="orangeFont">提交后不可修改</span>,是否确认提交
        </p>
      </div>
      <div @click="closeBox" class="submitBtn" v-if="showDubleBtn">
        <span>我知道了</span>
      </div>
      <div class="dubleBtn" v-else>
        <div class="canleBtn" @click="closeBox">取消</div>
        <div class="comfirmBtn" v-if="!goMyloan" @click="nextBox">确认</div>
        <div class="comfirmBtn" v-else @click="goToLoanList">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from "../bus";
import router from "@/router";
export default {
  name: "message",
  data() {
    return {
      show: false,
      showDubleBtn: false,
      goMyloan: false,
      nextUrlName: "",
      showText: false
    };
  },
  methods: {
    closeBox() {
      this.show = false;
    },
    nextBox() {
      this.closeBox();
      Bus.$emit("goNextStep");
    },
    goToLoanList() {
      this.closeBox();
      Bus.$emit("goToLoanList");
    }
  }
};
</script>

<style  lang="scss" scoped>
#messageWrap {
  z-index: 100000000;
  width: 19.375rem;
  height: 15.78125rem;
  position: fixed;
  left: 50%;
  top: 40%;
  background: #ffffff;
  opacity: 1;
  border-radius: 0.3125rem;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
  img {
    width: 5rem;
    height: 5rem;
    margin-top: 1.90625rem;
    display: inline-block;
  }
  .text_box {
    margin: 0 auto;
    width: 14rem;
    height: 2.46875rem;
    font-size: 1rem;
    color: rgba(51, 51, 51, 1);
    line-height: 1.5rem;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    .orangeFont {
      color: rgba(246, 171, 0, 1);
    }
  }
  .submitBtn {
    margin: 0 auto;
    margin-top: 1.59375rem;
    width: 15.3125rem;
    height: 2.3125rem;
    background: rgba(246, 171, 0, 1);
    border-radius: 1.15625rem;
    span {
      width: 4.09375rem;
      height: 0.96875rem;
      font-size: 1.0625rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 2.3125rem;
    }
  }
  .dubleBtn {
    margin: 0 auto;
    margin-top: 1.9rem;
    width: 15.3125rem;
    height: 2.3125rem;
    border-radius: 1.15625rem;
    font-size: 1.03125rem;
    div.canleBtn {
      float: left;
      width: 6.25rem;
      height: 2.3125rem;
      border: 0.0625rem solid rgba(216, 216, 216, 1);
      border-radius: 1.15625rem;
      line-height: 2.3125rem;
    }
    div.comfirmBtn {
      float: right;
      width: 6.25rem;
      height: 2.3125rem;
      background: rgba(246, 171, 0, 1);
      border: 0.0625rem solid rgba(246, 171, 0, 1);
      border-radius: 1.15625rem;
      color: #fff;
      line-height: 2.3125rem;
    }
  }
}
#loading {
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #000;
  z-index: 9999;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}
</style>