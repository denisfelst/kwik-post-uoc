<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin" class="input-group">
      <div class="form-group">
        <label for="username">Username </label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password </label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button type="submit" class="btn btn--cta" :disabled="isLoading">
        {{ isLoading ? "Logging in..." : "Login" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../api/axios";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const data = await api.post("/login", {
      username: username.value,
      password: password.value,
    });

    authStore.login({ user: data.data.user, token: data.data.token });

    const redirectPath = "/profile/" + data.data.user.username;
    router.push(redirectPath);
  } catch (err) {
    console.error("Error logging in:", err);
    error.value = err.response?.data?.message || "Invalid credentials";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Login form container */
form {
  display: grid;
  place-items: center;
  gap: 20px;
}
</style>
