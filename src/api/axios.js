import axios from "axios";
import { useAuthStore } from "../stores/auth";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      // Send just the token without 'Bearer'
      config.headers.Authorization = authStore.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  async (response) => {
    // Add artificial delay of 1500ms
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();

    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      authStore.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
