import axios from "@/utils/request"
export default {
    // 获取省
    userCertPhotoUpload(data) {
        return axios({
            method: "post",
            url: "/erong-cfss-phss/userPhotoUpload/userCertPhotoUpload",
            data: data
        })
    },
    
}