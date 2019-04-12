import Vue from "vue"
import axios from "axios"
import store from "@/vuex/index.js"
import router from '@/router/index'
import {
  loginApi
} from "@/Api/index"

axios.defaults.timeout = 50000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

console.log(process.env);
axios.defaults.baseURL = process.env.BASEURL; //procss.env.BASEURL
axios.interceptors.request.use(config => {
  if (config.url.indexOf("oauth/token") >= 0) {
    if (process.env && process.env.NODE_ENV == "development") {
      config.baseURL = config.baseURL + "/inner/";
    }
    config.headers.Authorization = process.env.BASIC;
  } else {
    if (process.env && process.env.NODE_ENV == "development") {
      config.baseURL = config.baseURL + "/asssets/inner/";
    }
    if (sessionStorage.token) {
      config.headers.Authorization = `bearer ${sessionStorage.token}`
      store.commit("saveToken", sessionStorage.token);
    }
  }
  return config;
}, err => {
  return Promise.reject(err)
});
axios.interceptors.response.use(
  response => {
    if (response.data.resultCode == "0") {
      if (response.data.errorDesc.indexOf("token过期") >= 0) {
        //重新请求一次token
        loginApi
          .getUserToekn()
          .then(result => {
            if (typeof result.data.access_token != "undefined") {
              sessionStorage.setItem("myToken", result.data.access_token);
              sessionStorage.setItem("token", result.data.access_token);
            }
          })
        return false;
      }
    }
    return response
  },
  error => {
    if (error.response) {}
    return Promise.reject(error)
  },
)
export default axios
