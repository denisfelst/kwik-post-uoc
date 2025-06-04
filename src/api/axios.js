import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = token;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Response interceptor for API calls
api.interceptors.response.use(
  async (response) => {
    // Add artificial delay of 1500ms
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Instead of accessing store directly, we'll dispatch an event
      window.dispatchEvent(new CustomEvent("auth:expired"));
    }
    return Promise.reject(error);
  }
);

export default api;
