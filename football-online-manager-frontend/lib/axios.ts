import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import cookiesStorage from "./cookieStorage";
import clearStorages from "./clearStorages";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const auth_storage_state = cookiesStorage.getItem("auth");
    if (auth_storage_state) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${auth_storage_state}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor
Axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const { status } = error.response;
    if ([403, 401].includes(status)) {
      const info = status == 401 ? "Unauthorized: Redirecting to login..." : "Forbidden: You don't have permission to access this resource."
      clearStorages().then(() => {
        toast.info(info
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      });

    }
    return Promise.reject(error);
  }
);

export default Axios;