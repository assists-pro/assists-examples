import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import eruda from 'eruda'
// import './style.css'
import App from './app.vue'
import router from './router'

// 移动端 WebView 内调试控制台
eruda.init()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
