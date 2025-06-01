<template>
  <div class="home">
    <template v-if="authStore.isAuthenticated">
      <h1>Main Feed</h1>
      <!-- Add your feed content here -->
    </template>
    <template v-else>
      <h3>
        <router-link to="/login">Login</router-link> to connect with your
        community.
      </h3>
    </template>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>

<style scoped>
/* .home {
  padding: 20px;
} */
</style>
