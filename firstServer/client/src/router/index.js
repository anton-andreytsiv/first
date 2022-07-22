import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/homePage'
import About from '../components/aboutPage'
import Products from '../components/productsPage'
import Cart from '../components/cartPage'
import RegisterPage from '../components/register'

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
    },
    {
        path: "/register",
        name: "register",
        component: RegisterPage
    }
]

const router = createRouter ({
    history: createWebHistory(),
    routes
})
export default router