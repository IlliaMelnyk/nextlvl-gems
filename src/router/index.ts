import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import AllProducts from "./pages/AllProducts.vue";
import GemDetail from "./pages/GemDetail.vue";
import Admin from "./pages/Admin.vue";
const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/products", name: "AllProducts", component: AllProducts },
    { path: "/product/:id", name: "GemDetail", component: GemDetail, props: true },
    { path: "/admin", name: "Admin", component: Admin }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    // OPRAVA ZDE: 'to' a 'from' jsou přejmenovány na '_to' a '_from'
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});