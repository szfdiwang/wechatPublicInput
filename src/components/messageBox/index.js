import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import messageBoxComponent from './messageBox.vue'

// 返回一个 扩展实例构造器
const MessageBoxConstructor = vue.extend(messageBoxComponent)

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function showMessageBox(type, text, nextUrlName) {
  let MessageDom = "";
  if (type == "bad") {
    MessageDom = new MessageBoxConstructor({
      el: document.createElement('div'),
      data() {
        return {
          text: text || "未能通过",
          showText:true,
          show: true,
          showDubleBtn: true,
          goMyloan: false,
          src: "static/images/tips/cry.png"
        }
      }
    })
  } else if (type == "warn") {
    MessageDom = new MessageBoxConstructor({
      el: document.createElement('div'),
      data() {
        return {
          text: text || "是否提交",
          show: true,
          showText:false,
          showDubleBtn: false,
          goMyloan: false,
          src: "static/images/tips/prompt2.png",
          nextUrlName: nextUrlName
        }
      }
    })
  } else if (type == "myLoan") {
    MessageDom = new MessageBoxConstructor({
      el: document.createElement('div'),
      data() {
        return {
          text: "您已成功申请过驾培分期，可至【我的借款】页面查看申请信息，是否立即跳转?",
          show: true,
          showText:true,
          showDubleBtn: false,
          goMyloan: true,
          src: "static/images/tips/prompt2.png",
        }
      }
    })
  }
  document.body.appendChild(MessageDom.$el)
  // 过了 duration 时间后隐藏
}

// 注册为全局组件的函数
function registryMessage() {
  // 将组件注册到 vue 的 原型链里去,
  vue.prototype.$messageBox = showMessageBox
}

export default registryMessage
