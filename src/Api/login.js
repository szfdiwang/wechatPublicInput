import axios from "@/utils/request"
export default {
  getUserToekn() {
    return axios({
      method: "get",
      url: "/auth/oauth/token?grant_type=client_credentials",
    })
  },
  queryLoginUserData(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-wechat/wechat/getRegisterUser",
      // header: {
      //   "Content-Type": "json"
      // },
      data: data
    })
  },
  //根据邀请码获取驾校信息
  getSchoolByCode(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/getNewDrivingSchoolName",
      data: data
    })
  },
  //查询贷款信息
  getLoanInfo(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/getLoanInfo",
      data: data
    })
  },
  //校验邀请码 此时绑定
  getCoachLoans(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/getCoachLoans",
      data: data
    })
  },
  //新增用户登录信息
  insertOrUpdateLoginUser(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loginUser/insertOrUpdateLoginUser",
      data: data
    })
  },
  //查询订单是否超过24小时
  getLoanInfoTime(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/getLoanInfoTime",
      data: data
    })
  },
  //取消订单erong-cfss-phss/loanInfo/updateLoanInfo
  updateLoanInfo(data) {
    return axios({
      method: "post",
      url: "erong-cfss-phss/loanInfo/updateLoanInfo",
      data: data
    })
  },
  //获取个人信息
  getPersonalInfo(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/personalInfo/getPersonalInfo",
      data: data
    })
  },
}
