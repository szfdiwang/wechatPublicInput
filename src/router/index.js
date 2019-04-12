/*
 * @Author: wangchenchen@myerong.com 
 * @Date: 2018-10-11 21:16:15 
 * @Last Modified by: wangchenchen@myerong.com
 * @Last Modified time: 2018-10-11 21:45:06
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/index.js'
Vue.use(Router)

//登录
const homepage = r => require.ensure([], () => r(require('@/components/login/homepage')), 'homepage');
const login = r => require.ensure([], () => r(require('@/components/login/login')), 'login');
const register = r => require.ensure([], () => r(require('@/components/login/register')), 'register');
const invitationCode = r => require.ensure([], () => r(require('@/components/login/invitationCode')), 'invitationCode');
const nameAhc = r => require.ensure([], () => r(require('@/components/Authentication/nameAhc')), 'nameAhc');
const userFace = r => require.ensure([], () => r(require('@/components/Authentication/userFace')), 'userFace');
const installmentInfo = r => require.ensure([], () => r(require('@/components/Authentication/installmentInfo')), 'installmentInfo');
const basicInfo = r => require.ensure([], () => r(require('@/components/Authentication/basicInfo')), 'basicInfo');
const imgUpload = r => require.ensure([], () => r(require('@/components/Authentication/imgUpload')), 'imgUpload');
const bindCar = r => require.ensure([], () => r(require('@/components/Authentication/bindCar')), 'bindCar');
const bindCarList = r => require.ensure([], () => r(require('@/components/Authentication/bindCarList')), 'bindCarList');
const successful = r => require.ensure([], () => r(require('@/components/Authentication/successful')), 'successful');
const failure = r => require.ensure([], () => r(require('@/components/Authentication/failure')), 'failure');
const faceSuccess = r => require.ensure([], () => r(require('@/components/Authentication/faceSuccess')), 'faceSuccess');
const jumPage = r => require.ensure([], () => r(require('@/components/login/jumPage')), 'jumPage');
const jxBank = r => require.ensure([], () => r(require('@/components/Authentication/jxBank')), 'jxBank');
const midone = r => require.ensure([], () => r(require('@/components/Authentication/midone')), 'midone');
const submitInstallment = r => require.ensure([], () => r(require('@/components/Authentication/submitInstallment')), 'submitInstallment');
const successInfo = r => require.ensure([], () => r(require('@/components/Authentication/successInfo')), 'successInfo');
const getPdfInfo = r => require.ensure([], () => r(require('@/components/Authentication/getPdfInfo')), 'getPdfInfo');
const xgInstallmentInfo = r => require.ensure([], () => r(require('@/components/Authentication/xgInstallmentInfo')), 'xgInstallmentInfo');
const getPdfInfoliu = r => require.ensure([], () => r(require('@/components/Authentication/getPdfInfoliu')), 'getPdfInfoliu');
const getPdfInfoWang = r => require.ensure([], () => r(require('@/components/Authentication/getPdfInfoWang')), 'getPdfInfoWang');
const supportBank = r => require.ensure([], () => r(require('@/components/Authentication/supportBank')), 'supportBank');
const nextTick = r => require.ensure([], () => r(require('@/components/Authentication/nextTick')), 'nextTick');
//错误提示
// const error404 = r => require.ensure([], () => r(require('@/components/error404')), 'error404');
const routes = [{
    path: '/',
    redirect: 'homepage'
  }, {
    path: '/homepage',
    name: "homepage",
    component: homepage,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/register',
    name: 'register',
    component: register,
    meta: {
      keepAlive: true // 不需要缓存
    }
  },
  {
    path: '/invitationCode',
    name: 'invitationCode',
    component: invitationCode,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/nameAhc',
    name: 'nameAhc',
    component: nameAhc,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/userFace',
    name: 'userFace',
    component: userFace,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/installmentInfo',
    name: 'installmentInfo',
    component: installmentInfo,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/basicInfo',
    name: 'basicInfo',
    component: basicInfo,
    meta: {
      keepAlive: true // 不需要缓存 存在照片上传 需要缓存
    }
  },
  {
    path: '/imgUpload',
    name: 'imgUpload',
    component: imgUpload,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/bindCar',
    name: 'bindCar',
    component: bindCar,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/bindCarList',
    name: 'bindCarList',
    component: bindCarList,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/successful',
    name: 'successful',
    component: successful,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/failure',
    name: 'failure',
    component: failure,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/faceSuccess',
    name: 'faceSuccess',
    component: faceSuccess,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/jumPage',
    name: 'jumPage',
    component: jumPage,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/jxBank',
    name: 'jxBank',
    component: jxBank,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/midone',
    name: 'midone',
    component: midone,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  // {midone
  {
    path: '/submitInstallment',
    name: 'submitInstallment',
    component: submitInstallment,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/successInfo',
    name: 'successInfo',
    component: successInfo,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/getPdfInfo',
    name: 'getPdfInfo',
    component: getPdfInfo,
    meta: {
      keepAlive: false // 不需要缓存
    }
  },
  {
    path: '/xgInstallmentInfo',
    name: 'xgInstallmentInfo',
    component: xgInstallmentInfo,
    meta: {
      keepAlive: false // 不需要缓存
    },
  },
  {
    path: '/getPdfInfoliu',
    name: 'getPdfInfoliu',
    component: getPdfInfoliu,
    meta: {
      keepAlive: false // 不需要缓存
    },
  },
  {
    path: '/getPdfInfoWang',
    name: 'getPdfInfoWang',
    component: getPdfInfoWang,
    meta: {
      keepAlive: false // 不需要缓存
    },
  },
  {
    path: '/supportBank',
    name: 'supportBank',
    component: supportBank,
    meta: {
      keepAlive: false // 不需要缓存
    },
  },
  {
    path: '/nextTick',
    name: 'nextTick',
    component: nextTick,
    meta: {
      keepAlive: false // 不需要缓存
    },
  },
  // {
  //   path: '*',
  //   component: error404
  // }
]
var router = new Router({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.path == '/login' || to.name == 'login') {
//     next();
//   } else if (to.path != "login" && to.fullPath.indexOf("direct2myHome") == -1 && from.path == "/") {
//     next({
//       name: 'homepage',
//       query: {
//         redirect: "direct2myHome"
//       }
//     })
//   } else if (from.name == "overDueoverdueMsg") {

//     let phoneDom = document.querySelector('.udesk-callcenter-component')
//     if (phoneDom) {
//       phoneDom.parentNode.removeChild(phoneDom);
//     }
//     next();

//   } else {
//     // 对路由进行验证     
//     if (store.state.user.islogin && store.state.user.islogin == 1) {
//       // 已经登陆
//       next();
//     } else if (sessionStorage.islogin && sessionStorage.islogin == 1) {
//       store.commit('islogin', sessionStorage.islogin);
//       //是否因为刷新导致vuex变量失效
//       next();
//     } else if (from.fullPath.indexOf("?user") > -1) {
//       next();
//     } else {
//       Message({
//         type: "error",
//         message: '您还没有登录,已为您切换登录页'
//       });
//       setTimeout(router.push({
//         path: '/login'
//       }), 1000);
//     }
//   }
// })

export default router;
