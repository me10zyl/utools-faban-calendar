import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'
import Options from './components/Options.vue'
import Calendar from "./components/Calendar.vue";

const routes = [
    { path: '/', component: Calendar },
    { path: '/options', component: Options },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;