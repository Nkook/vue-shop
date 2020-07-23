import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'
import Cate from '@/components/goods/Cate.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate }
      ]
    }
  ]
})

// 路由导航首位 判断是否有 token 值
router.beforeEach((to, from, next) => {
  // to  将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //    next() 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token字符串不存在
  if (!tokenStr) return next('/login')
  next()
})

export default router
