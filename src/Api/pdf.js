import axios from "@/utils/request"
export default {
  getDataArray(data) {
    return axios({
      method: "get",
      url: `/erong-cfss-phss/loanInfo/getPdfStreamWithParams?appNo=${data.appNo}`,
    })
  },
}
