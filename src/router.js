import { createMemoryHistory, createRouter } from 'vue-router'
import Options from './components/Options.vue'
import Calendar from "./components/Calendar.vue";

const routes = [
    { path: '/', component: Calendar },
    { path: '/options', component: Options },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;