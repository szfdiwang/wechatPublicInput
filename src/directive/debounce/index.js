import debounce from "./debounce.js"
const install = function (Vue) {
  Vue.directive("debounce", debounce)
}
debounce.install = install;
export default debounce
