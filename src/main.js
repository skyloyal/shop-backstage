import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './elementUIImport.js'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
  router
}).$mount('#app')