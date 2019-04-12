import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import messageComponent from './message.vue'

// 返回一个 扩展实例构造器
const MessageConstructor = vue.extend(messageComponent)

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
function showMessage(type, text, duration) {
  let MessageDom = "";
  if (type == "loading") {
    MessageDom = new MessageConstructor({
      el: document.createElement('div'),
      data() {
        return {
          text: text || "数据加载中",
          show: true,
          src: "static/images/tips/100px.gif"
        }
      }
    })
  } else if (type == "submit") {
    MessageDom = new MessageConstructor({
      el: document.createElement('div'),
      data() {
        return {
          text: text || "已提交成功",
          show: true,
          src: "static/images/tips/succeed@2x.png"
        }
      }
    })
  }
  document.body.appendChild(MessageDom.$el)
  // 过了 duration 时间后隐藏
  if (duration) {
    setTimeout(() => {
      MessageDom.show = false
    }, duration)
  }
}

function hideMessage() {
  let dom1 = document.getElementById("message_warpper");
  if (dom1) {
    dom1.parentNode.removeChild(dom1);
  }
}
// 注册为全局组件的函数
function registryMessage() {
  // 将组件注册到 vue 的 原型链里去,
  vue.prototype.$message = showMessage
  vue.prototype.$hideMessage = hideMessage
}

export default registryMessage
