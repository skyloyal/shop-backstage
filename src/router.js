import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login'
import Home from './components/Home'
import Welcome from './components/Welcome'
import Rights from './components/power/rights/Rights'
import Users from './components/user/Users'
import Roles from './components/power/roles/Roles'
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
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      }
    ]
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