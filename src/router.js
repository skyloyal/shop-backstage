import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue'
import Home from './components/Home'
Vue.use(Router)

const routes = [{
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home
  }
]
const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/login') {
    if (tokenStr) {
      return next('/home')
    } else {
      return next()
    }
  }
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router;