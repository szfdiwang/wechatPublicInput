export default {
  inserted: function (el, binding) {
    let that = this;
    let timer
    el.addEventListener('click', () => {
      that.$message("loading");
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          binding.value()
        }, 1000)
      }
    })
  }
}
