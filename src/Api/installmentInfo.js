import axios from "@/utils/request"
export default {
  //获取用户分期信息
  queryLoanInfo(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/queryLoanInfo",
      data: data
    })
  },
  getLoanStep(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/getLoanStep",
      data: data
    })
  },
  queryProductDeployEncapsulationList(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-pms/acct/pms/product/queryProductDeployEncapsulationList",
      data: data
    })
  },
  repayPlanTrial(data) {
    return axios({
      method: "post",
      url: "/erong-core-acct/acct/entry/repayPlanTrial",
      data: data
    })
  },
  addLoanInfo(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/addLoanInfo",
      data: data
    })
  },
  //查询是否提交进件
  queryApplyInfoByThreeFactors(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-aps/aps/app/queryApplyInfoByThreeFactors",
      data: data
    })
  },
  //推送借款信息到APS系统
  sendAPS(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/sendAPS",
      data: data
    })
  },
  //查询标的是否已登记
  queryLoanRegStatus(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss-zp/newRegister/queryLoanRegStatus",
      data: data
    })
  },
  //调用君子签，获取签约链接
  signContract(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/signContract",
      data: data
    })
  },
  addLoanInfoForWX(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/addLoanInfoForWX",
      data: data
    })
  },

}
