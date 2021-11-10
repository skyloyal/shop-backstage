import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/elementUIImport.js'
import './plugins/zktableImport.js'
import './plugins/quillEditorImport'
import echarts from 'echarts'
import axios from 'axios'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})

Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
// Vue
Vue.config.productionTip = false

Vue.filter('dateFomat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')