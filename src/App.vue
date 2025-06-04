<script setup>
import { onMounted, onUnmounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleAuthExpired = () => {
  authStore.logout();
  router.push("/login");
};

onMounted(() => {
  authStore.initializeAuth();
  window.addEventListener("auth:expired", handleAuthExpired);
});

onUnmounted(() => {
  window.removeEventListener("auth:expired", handleAuthExpired);
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div id="app">
    <header>
      <router-link to="/">
        <img src="@/assets/vue.svg" alt="logo" />
      </router-link>
      <template v-if="authStore.isAuthenticated">
        <router-link to="/post/form">New Post</router-link>
      </template>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <nav>
        <router-link to="/">Home</router-link> |
        <template v-if="authStore.isAuthenticated">
          <router-link :to="'/profile/' + authStore.user?.username"
            >Profile</router-link
          >
        </template>
        <template v-else>
          <router-link to="/login">login</router-link>
        </template>
      </nav>
    </footer>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav {
  padding: 20px;
  background-color: #f8f9fa;
  margin-bottom: 20px;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

footer {
  /* width: 100%; */
  bottom: 0;
  position: fixed;
}
</style>
