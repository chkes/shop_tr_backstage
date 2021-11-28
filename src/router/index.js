import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Cate from '../components/goods/Cate.vue'
import addCate from '../components/goods/addCate.vue'
import goodsList from '../components/goods/goodsList.vue'
import addGoods from '../components/goods/addgoods.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/category', component: Cate },
      { path: '/addCategary', component: addCate },
      { path: '/goodsList', component: goodsList },
      { path: '/addgoods', component: addGoods }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
// 为路由对象，添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
Vue.use(VueRouter)
export default router
