// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 先安装插件 npm i vue-table-with-tree-grid -S
// 然后将这个插件导入到项目中
// 使用Vue.component注册为全局注册
import TreeTable from 'vue-table-with-tree-grid'

// 配置全局的axios
import axios from 'axios'
// 挂载到vue原型对象上，每一个vue组件都可以 通过 this 直接访问到$http，从而去发起请求
// 配置请求根路径
axios.defaults.baseURL = 'http://server.sineava.top/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config config是请求的所有内容
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
