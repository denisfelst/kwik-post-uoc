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
  // TODO: check if this solves bug
  // window.removeEventListener("auth:expired", handleAuthExpired);
});
</script>

<template>
  <header>
    <router-link to="/">
      <img src="@/assets/icon.png" alt="logo" />
    </router-link>

    <template v-if="authStore.isAuthenticated">
      <router-link to="/post/form"
        ><button class="btn new-post">New Post</button></router-link
      >
    </template>
  </header>

  <main>
    <router-view></router-view>
  </main>

  <footer>
    <nav class="menu">
      <router-link to="/">
        <img src="@/assets/house.png" alt="home" class="nav-profile-img" />
      </router-link>
      <template v-if="authStore.isAuthenticated">
        |
        <router-link :to="'/profile/' + authStore.user?.username">
          <template v-if="authStore.user.profileImg">
            <img
              :src="authStore.user.profileImg"
              alt="profile"
              class="nav-profile-img"
            />
          </template>
          <template v-else>
            <img
              src="@/assets/no-user.png"
              alt="profile"
              class="nav-profile-img" /></template
        ></router-link>
      </template>
    </nav>
  </footer>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/******************************* HEADER *******************************/

header {
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0px 4px 9px 0px rgba(194, 194, 194, 0.25);
  z-index: 100;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: white;
}

header img {
  width: 50px;
  height: 50px;
}

header button {
  height: 100%;
}

.btn .new-post {
  position: absolute;
  right: 10px;
  top: 10px;
}

/******************************* MAIN *******************************/

main {
  padding: 20px 8px;
  height: 100%;
  overflow-y: scroll;
}

/******************************* NAVIGATION *******************************/
footer {
  bottom: 0;
  position: sticky;
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

.menu-link.active {
  color: var(--primary-color);
}

.nav-profile-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
