import axios from "axios";

const api = axios.create({
  baseURL: "https://eventify-0ibh.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error:", error);
    const message = error.response?.data?.message || "An error occurred";
    const code = error.response?.status || null; // Capture the error code
    return Promise.reject({ message, code }); // Return both message and code
  }
);

export default api;
