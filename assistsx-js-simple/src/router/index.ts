import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomePage from '../pages/home-page.vue'
import LogPage from '../pages/log-page.vue'
import UnfollowOfficialAccountPage from '../pages/unfollow-official-account-page.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/logs',
            name: 'logs',
            component: LogPage
        },
        {
            path: '/unfollow-official-account',
            name: 'UnfollowOfficialAccount',
            component: UnfollowOfficialAccountPage
        }
    ]
})

export default router 