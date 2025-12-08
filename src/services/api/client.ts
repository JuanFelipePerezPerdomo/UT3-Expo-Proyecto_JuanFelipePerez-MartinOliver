import { env } from "@/src/config";
import axios, { type AxiosError, type AxiosInstance } from "axios";

/**
 * Cliente HTTP base con Axios
 * Configurado con timeout e interceptores para logging
 */
export const apiClient: AxiosInstance = axios.create({
  timeout: env.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request para logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor de response para logging y manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `[API] Response ${response.status} from ${response.config.url}`
    );
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Error de respuesta del servidor
      console.error(
        `[API] Error ${error.response.status}:`,
        error.response.data
      );
    } else if (error.request) {
      // No hubo respuesta (timeout, red, etc.)
      console.error("[API] No response received:", error.message);
    } else {
      // Error de configuración
      console.error("[API] Config error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Tipo para errores de API normalizados
 */
export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Extrae un mensaje de error legible de un error de Axios
 */
export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError;
  if (axiosError.isAxiosError) {
    if (axiosError.response) {
      return `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
    }
    if (axiosError.code === "ECONNABORTED") {
      return "Tiempo de espera agotado";
    }
    return "Error de conexión";
  }
  return "Error desconocido";
}