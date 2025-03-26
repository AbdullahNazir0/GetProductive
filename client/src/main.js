import { createApp } from 'vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastPlugin from 'vue-toast-notification'
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import './style.css'
// import 'primeicons/primeicons.css'
import App from './App.vue'

createApp(App)
  .use(router)
  .use(ToastPlugin)
  .use(PrimeVue, {
    theme: {
        preset: Aura
    }
  })
  .mount('#app')
