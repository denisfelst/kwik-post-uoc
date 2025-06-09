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
        <router-link to="/post/form"
          ><button class=".btn.new-post">New Post</button></router-link
        >
      </template>
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <nav class="menu">
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

/******************************* HEADER *******************************/

/* Header of the application */
header {
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0px 4px 9px 0px rgba(194, 194, 194, 0.25);
  z-index: 1;
}

/* Button to create a new post inside Header */
.btn.new-post {
  position: absolute;
  right: 10px;
  top: 10px;
}

/******************************* NAVIGATION *******************************/
footer {
  bottom: 0;
  position: fixed;
  width: 100%;
}
/* Bottom Navigation menu wrapper */
.menu {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  border-top: 1px solid #ddd;
  background: white;
  border-end-end-radius: 20px;
  border-end-start-radius: 20px;
  box-shadow: 0px -4px 9px 0px rgba(194, 194, 194, 0.25);
  z-index: 1;
}

/* Nav button style */
.menu-link {
  text-decoration: none;
  color: inherit;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--grey-color);
}

/* Active nav button style */
.menu-link.active {
  color: var(--primary-color);
}

/* Profile image style */
.profile-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
