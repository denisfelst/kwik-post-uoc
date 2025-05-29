<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.initializeAuth();
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <template v-if="authStore.isAuthenticated">
        <router-link to="/post/form">New Post</router-link> |
        <router-link :to="'/profile/' + authStore.user?.username"
          >Profile</router-link
        >
        |
        <a href="#" @click.prevent="handleLogout">Logout</a>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
      </template>
    </nav>
    <router-view></router-view>
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
</style>
