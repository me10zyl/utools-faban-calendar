import { createMemoryHistory, createRouter } from 'vue-router'
import Options from './components/Options.vue'

const routes = [
    { path: '/', component: Options },
    { path: '/options', component: Options },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;