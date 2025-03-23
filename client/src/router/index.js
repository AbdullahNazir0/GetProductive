import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', component: Register },
  { name: 'Register', path: '/auth/register', component: Register },
  { name: 'Login', path: '/auth/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
