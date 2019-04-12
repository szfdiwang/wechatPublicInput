import axios from "@/utils/request"
export default {
    // 获取省
    getProvince(data) {
        return axios({
            method: "post",
            url: "/erong-cfss-pms/acct/pms/Area/queryArea",
            data: data
        })
    },
    // 保存用户基本信息
    addPersonalInfo(data) {
        return axios({
            method: "post",
            url: "/erong-cfss-phss/personalInfo/addPersonalInfo",
            data: data
        })
    },
    // 获取用户基本信息
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
    getLoanStep(data) {
        return axios({
            method: "post",
            url: "/erong-cfss-phss/loanInfo/getLoanStep",
            data: data
        })
    },
}