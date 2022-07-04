import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/homePage'
import About from '../components/aboutPage'
import Products from '../components/productsPage'
import Cart from '../components/cartPage'

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/about",
        name: "about",
        component: About
    },
    {
        path: "/products",
        name: "products",
        component: Products
    },
    {
        path: "/cart",
        name: "cart",
        component: Cart
    }
]

const router = createRouter ({
    history: createWebHistory(),
    routes
})
export default router