import { defineStore } from "pinia";
import { setAuthToken } from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
    profileImg: null,
    registrationDate: null,
    name: null,
    surname: null,
    username: null,
  }),

  actions: {
    login({ user, token }) {
      console.log("login", user, token);
      this.isAuthenticated = true;
      this.user = user;
      this.token = token;
      this.profileImg = user.profileImg;
      this.registrationDate = user.registrationDate;
      this.name = user.name;
      this.surname = user.surname;
      this.username = user.username;
      // Set token in API instance
      setAuthToken(token);
      // Store token in localStorage for persistence
      localStorage.setItem("auth_token", token);
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      this.profileImg = null;
      this.registrationDate = null;
      this.surname = null;
      this.username = null;
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
        // TODO: Fetch user data using token if needed
      }
    },
  },
});
