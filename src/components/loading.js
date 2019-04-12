import LoadingComponent from "./coverTool.vue";
export default {
  install: function (Vue) {
    Vue.component("loading", LoadingComponent)
  }
}