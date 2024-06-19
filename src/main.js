import {createApp, onMounted} from 'vue'
import router from './router.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './style.css'
import App from './App.vue'
import myUtools from "./js/myUtools.ts"

createApp(App)
    .use(router)
    .use(ElementPlus, { size: 'small', zIndex: 3000 })
    .mount('#app')

myUtools.init(router)