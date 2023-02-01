import { createRouter, createWebHistory, onBeforeRouteLeave } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "../stores/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/devices",
      name: "devices",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/DevicesView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/dashboard/:floorId",
      // Dynamic Route Matching with Params
      // https://router.vuejs.org/guide/essentials/dynamic-matching.html
      name: "floor",
      component: () => import("../components/Dashboard/Floor.vue"),
      props: true
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach(async (to, from, next) => {
  //console.log('beforeEach - getAuthUser:', store.getters['getAuthUserToken']['token']);
  if (to.path !== '/login' && store.getters['getAuthUserToken']['token'] === null) {
    next({ name: 'login' });
  } else {
    next();
  }
})

export default router;
