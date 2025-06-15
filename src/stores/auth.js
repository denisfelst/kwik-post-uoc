import { defineStore } from "pinia";
import { setAuthToken } from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    token: null,
    user: null,
    // profileImg: null,
    // registrationDate: null,
    // name: null,
    // surname: null,
    // username: null,
  }),

  actions: {
    login({ user, token }) {
      console.log("Login: ", user, token);

      this.isAuthenticated = true;
      this.user = user;
      this.token = token;

      // Set token in API instance
      setAuthToken(token);
      // Store token in localStorage for persistence
      localStorage.setItem("auth_token", token);
    },

    logout() {
      this.isAuthenticated = false;
      this.token = null;
      this.user = null;

      // Remove token from API instance
      setAuthToken(null);

      // Remove token from localStorage
      localStorage.removeItem("auth_token");
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Set token in API instance
        setAuthToken(token);
        this.token = token;
        this.isAuthenticated = true;
      }
    },
  },
});
