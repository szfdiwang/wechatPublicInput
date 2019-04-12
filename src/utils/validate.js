// 手机号验证
export function isvalidMobile(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
//固定电话
export function isvalidPhone(str) {
  const reg = /^0\d{2,3}-\d{7,8}$/
  return reg.test(str)
}
