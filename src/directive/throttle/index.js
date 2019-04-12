import throttle from "./throttle.js"
const install = function (Vue) {
  Vue.directive("throttle", throttle)
}
throttle.install = install;
export default throttle
