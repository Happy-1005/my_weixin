import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
//封装request插件
Vue.use(function(vue){

  //函数的返回值就是Vue构造函数，构造函数上有原型对象
  // 此处的Vue不是Vue实例 只是一个形参
  vue.prototype.$request = async function(opt){
      //请求前
      uni.showLoading({
        title:'加载中'
      })
        //封装函数用于baseurl路径的拼接 
        // opt是对象 传入的形参
    var baseUrl =  'https://api-ugo-web.itheima.net'
    const [err,res]= await uni.request({
      url:baseUrl+opt.url,
      data:opt.data,
      method:opt.method,
      Authorization: opt.token
    })
      //请求后
      uni.hideLoading()
      //返回数据
      return res.data
    }
})
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
