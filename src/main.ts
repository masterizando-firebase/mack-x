/* eslint-disable vue/multi-word-component-names,vue/no-reserved-component-names */
import { initializeApp } from 'firebase/app'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import Divider from 'primevue/divider'
import FileUpload from 'primevue/fileupload'
import InlineMessage from 'primevue/inlinemessage'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import 'primevue/resources/themes/lara-dark-blue/theme.css'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Firebase
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyB_d8vI060tCT_ESKuTCktu01HJRND5rLM',
  authDomain: 'mack-x-01.firebaseapp.com',
  projectId: 'mack-x-01',
  storageBucket: 'mack-x-01.appspot.com',
  messagingSenderId: '14663099644',
  appId: '1:14663099644:web:d5f95653da6e1bf386a379',
  measurementId: 'G-BN45GH76KC'
})
app.use(VueFire, { firebaseApp, modules: [VueFireAuth()] })

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Prime vue core modules
app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)

// Prime vue components
app.component('Button', Button)
app.component('InlineMessage', InlineMessage)
app.component('InputText', InputText)
app.component('Checkbox', Checkbox)
app.component('Divider', Divider)
app.component('Password', Password)
app.component('Toast', Toast)
app.component('Avatar', Avatar)
app.component('FileUpload', FileUpload)

// Router
app.use(router)

app.mount('#app')
