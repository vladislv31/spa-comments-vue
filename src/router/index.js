import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]
const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
export default router
