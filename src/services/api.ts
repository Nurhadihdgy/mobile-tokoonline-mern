import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutService } from "./auth";
import { Alert } from "react-native";
import { navigate } from "./navigation";
import { getToken, removeAuth } from "./auth";

const API = axios.create({
  baseURL: "https://backend-tokoonline-mern-1.onrender.com/api",
  timeout: 15000,
});

/* REQUEST → attach token */
// Interceptor untuk Request (Menambah Token)
API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk Response (Deteksi 401 / Expired)
API.interceptors.response.use(
  (response) => response, // Jika sukses, biarkan lewat
  async (error) => {
    // Jika error 401 berarti token tidak valid atau expired
    if (error.response && error.response.status === 401) {
      await removeAuth(); // Hapus data dari storage

      // Jika Anda menggunakan trigger manual:
      if (typeof window !== 'undefined' && (window as any).forceLogout) {
        (window as any).forceLogout();
      }
    }
    return Promise.reject(error);
  }
);

export default API;
