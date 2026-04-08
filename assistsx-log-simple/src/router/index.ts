import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import FloatingLogExample from '../views/floating-log-example.vue'
import InlineLogExample from '../views/inline-log-example.vue'
import LogPanel from '../views/log-panel.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/index.html', redirect: '/' },
    { path: '/', name: 'home', component: Home },
    { path: '/examples/floating', name: 'floating', component: FloatingLogExample },
    { path: '/examples/inline', name: 'inline', component: InlineLogExample },
    { path: '/examples/log-panel', name: 'logPanel', component: LogPanel },
  ],
})
