import Vue from 'vue'
import App from './App'
import router from './router'
import vuex from 'vuex'
import store from './vuex/'
import Loading from "@/components/loading.js"
import "@/assets/css/common.scss"
import debounce from "@/directive/debounce/index"
import throttle from "@/directive/throttle/index"
import "@/assets/css/common.scss"

// Vue.use(Loading);
// Vue.use(debounce);
Vue.use(throttle);
Vue.config.productionTip = false;
import messageRegistry from '@/components/message/index'
import toastRegistry from '@/components/toast/index'
import messageBox from '@/components/messageBox/index'
Vue.use(messageRegistry);
Vue.use(messageBox);
Vue.use(toastRegistry);

// window.onresize = setHtmlFontSize;

// function setHtmlFontSize() {
//   const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
//   const htmlDom = document.getElementsByTagName('html')[0];
//   htmlDom.style.fontSize = htmlWidth / 19.2 + 'px';
// };
// setHtmlFontSize();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuex,
  store,
  components: {
    App
  },
  template: '<App/>'
})
