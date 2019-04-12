import axios from "@/utils/request"
export default {
  //获取支持银行列表
  getSysBankList(data) {
    return axios({
      method: "get",
      url: "/erong-cfss-phss/bankCard/getNewSysBankList",
      data: data
    })
  },
  //银行卡ocr 
  ocrCardSend(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/userPhotoUpload/ocrCardSend",
      data: data
    })
  },
  //获取
  getPersonalInfo(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/personalInfo/getPersonalInfo",
      data: data
    })
  },
  //新增银行卡信息
  addUserBankcard(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/bankCard/addUserBankcard",
      data: data
    })
  },
  //查询用户绑定银行卡信息
  getUserBankcardOne(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/bankCard/getUserBankcardOne",
      data: data
    })
  },
  //江西银行开户form页面
  getBankForm(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/applyP2PRegister/newWeChat",
      data: data
    })
  },
  //查询是否开户
  p2pRegisterResQuery(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/p2pRegisterResQuery",
      data: data
    })
  },
  //查询是否设置密码
  queryPlatformPwd(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/queryPlatformPwd",
      data: data
    })
  },
  //密码设置秒单 /erong-cfss-phss-zp/newRegister/setTradePwd
  setTradePwd(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/setNewTradePwd",
      data: data
    })
  },
  //查询是否 /erong-cfss-phss-zp/newRegister/queryLoanRegStatus
  queryLoanRegStatus(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/queryLoanRegStatus",
      data: data
    })
  },
  //驾培分期受托支付标的登记
  queryLoanRegStatus(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/queryLoanRegStatus",
      data: data
    })
  },
  //登记申请 /erong-cfss-phss-zp/newRegister/queryLoanRegStatus
  driveTrainStagingReg(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/driveTrainStagingReg",
      data: data
    })
  },
  //查询是否受托/erong-cfss-phss-zp/newRegister/trusteePayQuery
  trusteePayQuery(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/trusteePayQuery",
      data: data
    })
  },
  //借款人受托支付申请 /erong-cfss-phss-zp/newRegister/trusteePay
  trusteePay(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/newRegister/newtrusteePay",
      data: data
    })
  },
  //是否授权接口 erong-cfss-phss/newRegister/getAccountStatus
  getAccountStatus(data) {
    return axios({
      method: "post",
      url: "erong-cfss-phss/newRegister/getAccountStatus",
      data: data
    })
  },
  //授权表单 erong-cfss-phss/newRegister/repayAuth/newWeChat

  repayAuth(data) {
    return axios({
      method: "post",
      url: "erong-cfss-phss/newRegister/repayAuth/newWeChat",
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
  ///erong-cfss-tass/baofoo/readySignOfXY
  //新的发送验证码的接口
  readySignOfXY(data) {
    return axios({
      method: "post",
      url: "erong-cfss-tass/baofoo/readySignOfXY",
      data: data
    })
  },
  //新的绑定银行卡的接口 erong-cfss-phss/bankCard/confirmBindCard
  confirmBindCard(data) {
    return axios({
      method: "post",
      url: "erong-cfss-phss/bankCard/confirmBindCard",
      data: data
    })
  },
  //银行卡卡宾校验
  getCardForBank(data) {
    return axios({
      method: "post",
      url: "erong-cfss-wechat/baofu/getCardForBank",
      data: data
    })
  },
}
