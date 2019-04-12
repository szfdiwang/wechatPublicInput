<template>
  <div ref="codeBox" class="warpper_box" v-if="isShow">
    <div class="code_box">
      <div class="title_box">
        <span>请输入驾校专属邀请码</span>
      </div>
      <div class="line_box"></div>
      <div class="password_box">
        <ul @click="focus">
          <input
            ref="pwd"
            v-model="msg"
            class="hiddenInput"
            type="number"
            oninput="if(value.length>6)value=value.slice(0,6)"
            @blur="lostYou"
          >
          <li v-for="(item,key) in digits" :key="key">
            <span class="code_type" v-if="msgLength > key">{{msg.substring(key,key+1)}}</span>
          </li>
        </ul>
      </div>
      <div class="submit_box" @mousedown.stop.prevent @click.stop.prevent="submitInvitationCode() ">
        <span>确定</span>
      </div>
      <!-- <div class="cancle_box"></div> -->
    </div>
    <div class="cancle_box" @click="cancleBtn()">
      <div class="cancle_btn"></div>
    </div>
  </div>
</template>
<script>
import { loginApi } from "@/Api/index";
export default {
  name: "invitationCode",
  data() {
    return {
      digits: ["", "", "", "", "", ""],
      msg: "",
      msgLength: 0,
      isShow: false,
      onFocus: false
    };
  },
  props: ["visible"],
  watch: {
    msg(curVal) {
      //监听输入的长度，如果输入完，自动调用校验接口函数
      // if (curVal.trim().length === this.digits.length) {
      //   this.verifyTels();
      // }
      if (curVal.trim().length > this.digits.length) {
        this.msg = curVal.substring(0, 6);
      }
      this.msgLength = curVal.length;
    },
    visible(val) {
      console.log(val);
      this.isShow = val;
      this.msg = "";
    }
  },
  mounted() {
    // this.focus();
  },
  methods: {
    lostYou() {
      $(".warpper_box").css("top", "9.375rem");
    },
    cancleBtn() {
      this.isShow = false;
      this.msg = "";
      this.$emit("close", "true");
    },
    focus() {
      $(".warpper_box").css("top", "3.5rem");
      this.msg = "";
      this.$nextTick(() => {
        this.$refs.pwd.focus();
      });
    },
    submitInvitationCode() {
      this.$refs.pwd.blur();
      //校验6位邀请码 写公共msg
      var reg = new RegExp(/^\d{6}$/);
      if (this.msg == "") {
        this.$toast("请输入驾校邀请码", 2000);
      } else if (reg.test(this.msg)) {
        let data = {
          invitationCode: this.msg
        };
        loginApi
          //查询驾校
          .getSchoolByCode(data)
          .then(result => {
            console.log(result);
            if (result.data.resultCode == 1) {
              if (result.data.data.drivingSchoolName) {
                let school = result.data.data.drivingSchoolName;
                this.isShow = false;
                this.$emit("code", this.msg);
                this.$emit("whichSchool", school);
                this.$emit("payTypeSchool", result.data.data.payType);
                this.$emit("querySchool", "success");
              } else {
                this.$toast("您输入驾校邀请码有误", 2000);
              }
            } else {
              this.$toast(result.data.errorDesc, 2000);
            }
          })
          .catch(error => {
            this.$toast(result.data.errorDesc, 2000);
          });
      } else {
        this.$toast("请输入6位数字邀请码", 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.warpper_box {
  z-index: 10001;
  width: 19.84375rem;
  height: 15.03125rem;
  margin: 0 auto;
  text-align: center;
  position: fixed;
  top: 9.375rem;
  left: 0;
  right: 0;
  .code_box {
    background-color: #ffffff;
    overflow: hidden;
    border-radius: 0.625rem;
    .title_box {
      margin: 1.3rem auto;
      span {
        width: 11.15625rem;
        height: 1.0625rem;
        font-size: 1.125rem;
        font-weight: 500;
        color: rgba(246, 171, 0, 1);
        line-height: 1.125rem;
      }
    }
    .line_box {
      margin: 0 auto;
      // border: 0.0625rem dashed rgba(236, 236, 236, 1);
      width: 17.71875rem;
      height: 1px;
      background-image: linear-gradient(
        to right,
        rgb(168, 168, 168) 0%,
        rgba(168, 168, 168, 1) 50%,
        transparent 50%
      );
      background-size: 1.25rem 0.03125rem;
      background-repeat: repeat-x;
    }
    .password_box {
      width: 17.53125rem;
      margin: 1.59375rem auto;
      .hiddenInput {
        // display: none;
        color: transparent;
        position: absolute;
        z-index: -100;
        opacity: 0;
        right: -12rem;
      }
      ul {
        display: flex;

        li {
          // flex: 1;
          margin: 0 auto;
          // padding-left: 0.3125rem;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(247, 244, 248, 1);
          border: 1px solid rgba(51, 51, 51, 0.18);
          border-radius: 6px;
          .code_type {
            width: 0.71875rem;
            height: 2.4rem;
            font-size: 1.3125rem;
            font-weight: 500;
            color: rgba(246, 171, 0, 1);
            line-height: 2.4rem;
          }
        }
      }
    }

    .submit_box {
      width: 19.9rem;
      height: 2.84rem;
      background: linear-gradient(
        248deg,
        rgba(246, 122, 0, 1) 0%,
        rgba(246, 171, 0, 1) 99%
      );
      border-radius: 0 0 0.625rem 0.625rem;
      // position: absolute;
      // bottom: 0;
      span {
        width: 2.1875rem;
        height: 1.0625rem;
        font-size: 1.125rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 2.8rem;
      }
    }
  }
  .cancle_box {
    width: 1.75rem;
    height: 1.75rem;
    background: url(../../assets/images/index/close2@2x.png) 100% 100% no-repeat;
    background-size: 1.75rem;
    position: absolute;
    bottom: 0px;
    z-index: 10001;
    left: 50%;
    transform: translate(-50%, 0%);
  }
}
</style>
