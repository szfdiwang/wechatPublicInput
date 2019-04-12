<template></template>
<script>
import { nameAhcApi } from "@/Api/index";
export default {
  /**
             *  A0000("A0000","未实名"), 增加一个状态 身份证认证通过 而人脸未通过或者未进行
                A0010("A0010","实名认证成功"),
                A0020("A0020","保存分期信息成功"),
                A0030("A0030","保存基本信息成功"),
                A0035("A0035","保存车辆影像信息成功"),
                A0040("A0040","保存银行卡信息成功"),
                A0045("A0045","贷款提交中间态"),
                A0050("A0050","保全回调成功"),
                // A0060("A0060","推送APS系统失败");
             */
  data() {
    return {};
  },
  mounted() {
    this.getLoanInfo();
    this.getStep();
  },
  methods: {
    getLoanInfo() {},
    getStep() {
      let data = {
        userId: sessionStorage.userId,
        appNo: sessionStorage.appNo
      };
      nameAhcApi
        .getLoanStep(data)
        .then(result => {
          if (result.data.resultCode == "1") {
            if (result.data.data.status == "A0000") {
              //未认证
              this.$router.push({
                name: "nameAhc"
              });
            } else if (result.data.data.status == "A0010") {
              //实名认证成功  跳第二步
              this.$router.push({
                name: "installmentInfo"
              });
            } else if (result.data.data.status == "A0020") {
              //保存分期信息成功 跳基本信息
              this.$router.push({
                name: "basicInfo"
              });
            } else if (result.data.data.status == "A0030") {
              //保存基本信息成功 跳绑卡
              this.$router.push({
                name: "bindCar"
              });
            } else if (result.data.data.status == "A0040") {
              //保存银行卡信息成功 //最终状态？
              this.$router.push({
                name: "bindCar"
              });
            } else {
              this.$router.push({
                name: "nameAhc"
              });
            }
          }
        })
        .catch(err => {
          this.$toast(result.data.errorDesc, 2000);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
