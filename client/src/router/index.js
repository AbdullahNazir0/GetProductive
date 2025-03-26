import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Layout from '../layouts/Layout.vue'

const routes = [
  { path: '/', component: Layout, children: [
    { path: '', component: () => import('../views/Home.vue') },
    // { path: 'settings', component: () => import('../views/Settings.vue') },
    // { path: 'profile', component: () => import('../views/Profile.vue') }
  ]},
  { name: 'Register', path: '/auth/register', component: Register },
  { name: 'Login', path: '/auth/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
