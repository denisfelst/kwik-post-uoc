import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import PostForm from "../views/PostForm.vue";
import PostDetail from "../views/PostDetail.vue";
import Profile from "../views/Profile.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/post/form/:id?",
      name: "post-form",
      component: PostForm,
      meta: { requiresAuth: true },
    },
    {
      path: "/post/:id",
      name: "post-detail",
      component: PostDetail,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile/:username",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard: triggers before each route change
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access a protected route while not authenticated
    next({ name: "login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
