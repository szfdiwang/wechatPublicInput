import axios from "@/utils/request"
export default {
  //注册获取短信验证码
  getValidCode(data) {
    return axios({
      method: "post",
      url: "/cfss/loanApply/aps/aps/app/getValidCode",
      data: data
    })
  },
  registerAction(data) {
    return axios({
      method: "post",
      url: "/erong-user-center/user/smsLogin",
      data: data
    })
  },

  bindRegisterUser(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-wechat/wechat/bindRegisterUser",
      data: data
    })
  }
}
