import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import About from "./pages/About.vue";
import Contact from "./pages/Contact.vue";
import NewGems from "./pages/NewGems.vue";
import AllProducts from "./pages/AllProducts.vue";
import GemDetail from "./pages/GemDetail.vue";

const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/about", name: "About", component: About },
    { path: "/contact", name: "Contact", component: Contact },
    { path: "/new-gems", name: "NewGems", component: NewGems },
    { path: "/products", name: "AllProducts", component: AllProducts },
    { path: "/product/:id", name: "GemDetail", component: GemDetail, props: true },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // když klikneš zpět, vrátí tě to na původní místo
        if (savedPosition) {
            return savedPosition;
        } else {
            // jinak skočí vždy na začátek stránky
            return { top: 0 };
        }
    },
});