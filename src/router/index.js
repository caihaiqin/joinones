// import {
//   createApp
// } from 'vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// const Home = () => import('../views/home/Home.vue')
// const Shopcar = () => import('../views/shopcar/Shopcar.vue')
// const Category = () => import('../views/category/Category.vue')
// const Profile = () => import('../views/profile/Profile.vue')
// const Detail = () => import('views/detail/Detail')
Vue.use(VueRouter)



const router = new VueRouter({
  routes: [{
    path: '',
    redirect: '/home'
    // }, {
    //   path: '/home',
    //   component: Home
    // }, {
    //   path: '/shopcar',
    //   component: Shopcar
    // }, {
    //   path: '/category',
    //   component: Category
    // }, {
    //   path: '/profile',
    //   component: Profile
    // }, {
    //   //动态路由
    //   path: '/detail/:iid',
    //   component: Detail
    // 
  }],
  mode: 'history'
})
export default router
