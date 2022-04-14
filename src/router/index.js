import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";

const routes = [
  {
    path: "/",
    name: "welcome",
    component: Index,
    meta: {
      title: "Welcome",
    },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/Home.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "Log In",
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/Signup.vue"),
    meta: {
      title: "Sign Up",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
});

export default router;
