import axios from "@/utils/request"
export default {
    getSysBankList(data) {
        return axios({
            method: "get",
            url: "/erong-cfss-tass/baofoo/getSysBankList",
            data: data
        })
    },
}