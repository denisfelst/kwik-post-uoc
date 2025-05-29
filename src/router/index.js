import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import PostFormView from "../views/PostFormView.vue";
import PostDetailView from "../views/PostDetailView.vue";
import ProfileView from "../views/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/post/form/:id?",
      name: "post-form",
      component: PostFormView,
      meta: { requiresAuth: true },
    },
    {
      path: "/post/:id",
      name: "post-detail",
      component: PostDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile/:username",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard
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
