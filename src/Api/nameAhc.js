import axios from "@/utils/request"
export default {
  getLoanStep(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/getLoanStep",
      data: data
    })
  },
  getTicket(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-tass/Ocr/getTicket",
      data: data
    })
  },
  //ocr身份识别
  uploadPhoto(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/userPhotoUpload/ocrIdNoSend",
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  //人脸识别geth5faceid
  getFaceId(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-tass/Ocr/geth5faceid",
      data: data
    })
  },
  //人脸是否成功
  getResultSync(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/getSync",
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
  queryLoanInfo(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/loanInfo/queryLoanInfo",
      data: data
    })
  },
  //人脸识别后 查询同盾 /erong-cfss-phss/riskControl/checkUserRisk
  checkUserRisk(data) {
    return axios({
      method: "post",
      url: "/erong-cfss-phss/riskControl/checkUserRisk",
      data: data
    })
  },
}
