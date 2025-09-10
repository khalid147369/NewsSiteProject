import { useCallback } from "react";
import axios, { type AxiosInstance } from "axios";

// Puedes inyectar una instancia de axios o una función personalizada
export function useRefreshToken(apiClient?: AxiosInstance) {
  const client =
    apiClient ||
    axios.create({
      baseURL:  import.meta.env.VITE_ENV !=='production'?import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_PRO,

      withCredentials: true,
    });

  // Función para pedir un nuevo accessToken usando el refreshToken (en la cookie)
  const refresh = useCallback(async () => {
    try {
      const response = await client.post(
        "/api/users/refreshtoken",
        {},
        { withCredentials: true }
      );

      // Suponiendo que el backend responde con { accessToken: "..." }
      return response.data;
    } catch (error) {
      console.error("Error refreshing token", error);
      return null;
    }
  }, [client]);

  return refresh;
}
