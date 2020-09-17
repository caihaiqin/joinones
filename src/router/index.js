// import {
//   createApp
// } from 'vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/common/login/Login'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const Home = () => import('views/home/Home.vue')
// const Shopcar = () => import('../views/shopcar/Shopcar.vue')
// const Category = () => import('../views/category/Category.vue')
// const Profile = () => import('../views/profile/Profile.vue')
// const Detail = () => import('views/detail/Detail')
Vue.use(VueRouter)



const router = new VueRouter({
  routes: [{
      path: '',
      redirect: '/login'
    }, {
      path: '/home',
      component: Home
    },
    //{

    //   //动态路由
    //   path: '/detail/:iid',
    //   component: Detail


    {
      path: '/login',
      component: Login
    }
  ],
  mode: 'history'
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    return next()
  }
  if (!window.sessionStorage.getItem("token")) {
    return next("/login")
  } else {
    next()
  }
})
export default router
