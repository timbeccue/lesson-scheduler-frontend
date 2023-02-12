
import { createRouter, createWebHistory } from 'vue-router'
//const Home = { template: '<div>Home</div>' }
import Scheduling from './views/Scheduling.vue'
import Roadmap from './views/Roadmap.vue'
//const About = { template: '<div>About</div>' }
//import Contact from './views/Contact.vue'

const routes = [
    { path: '/', component: Scheduling },
    { path: '/roadmap', component: Roadmap},
    //{ path: '/contact', component: Contact }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
