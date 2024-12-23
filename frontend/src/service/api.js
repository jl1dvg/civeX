import axios from "axios";
import jwtDecode from "jwt-decode";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Base URL de tu API
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("access_token");
        window.location.href = "/signin"; // Redirigir al inicio de sesión
        return Promise.reject(new Error("Token expirado"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
