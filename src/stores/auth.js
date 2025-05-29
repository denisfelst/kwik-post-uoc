import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),

  actions: {
    login({ user, token }) {
      this.isAuthenticated = true;
      this.user = user;
      this.token = token;
      // Store token in localStorage for persistence
      localStorage.setItem("auth_token", token);
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      // Remove token from localStorage
      localStorage.removeItem("auth_token");
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem("auth_token");
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        // TODO: Fetch user data using token if needed
      }
    },
  },
});
