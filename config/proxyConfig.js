module.exports = {
  proxy: {
    '/apis/loanInfo/getPdfStreamWithParams': {
      target: 'http://192.168.12.99:9093/', //'http://127.0.0.1:9060/',192.168.15.58 "http://192.168.12.46:9093/", //'https://test.myerong.com:5080/'
      secure: false, // 如果是ht tps接口，需要配置这个参数
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/apis': '' //需要rewrite的,
      }
    },
    '/apis': {
      target: 'https://test.myerong.com:5080/', //'http://127.0.0.1:9060/',192.168.15.58 "http://192.168.12.46:9093/", //
      secure: false, // 如果是ht tps接口，需要配置这个参数
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/apis': '' //需要rewrite的,
      }
    },
    '/wx': {
      target: 'https://test.myerong.com:5080/', //'http://127.0.0.1:9060/',192.168.15.58 "http://192.168.12.46:9093/", //
      secure: false, // 如果是ht tps接口，需要配置这个参数
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/apis': '' //需要rewrite的,
      }
    }
  }
}
