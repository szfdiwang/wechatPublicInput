import * as types from './types'
const user = {
  state: {
    token: "",
    user: {},
    status: "",
    userId: "",
    appNo: "",
    userInfo: {},
    nonce: "",
    mobilePhone: "",
    userName:"",
    userIdNo:"",

  },
  mutations: {
    [types.SAVETOKEN]: (state, data) => {
      sessionStorage.setItem("token", data);
      state.token = data;
    },
    [types.SAVEUSER]: (state, data) => {
      sessionStorage.setItem("user", JSON.stringify(data));
      state.user = data;
    },
    [types.SAVESTATUS]: (state, data) => {
      sessionStorage.setItem("status", data);
      state.status = data;
    },
    [types.SAVEUSERID]: (state, data) => {
      sessionStorage.setItem("userId", data);
      state.userId = data;
    },
    [types.SAVEAPPNO]: (state, data) => {
      sessionStorage.setItem("appNo", data);
      state.appNo = data;
    },
    [types.SAVEUSERNAME]: (state, data) => {
      sessionStorage.setItem("name", data.name);
      state.userName = data;
    },
    [types.SAVEUSERIDNO]: (state, data) => {
      sessionStorage.setItem("idNo", data.idNo);
      state.userIdNo = data;
    },
    [types.SAVENONCE]: (state, data) => {
      sessionStorage.setItem("nonce", data);
      state.nonce = data;
    },
    [types.SAVEPHONE]: (state, data) => {
      sessionStorage.setItem("mobilePhone", data);
      state.mobilePhone = data;
    }
  },
}

export default user
