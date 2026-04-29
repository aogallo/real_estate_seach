import axios from "axios"
import { apiClient } from "@/lib/axios"
import type { RealEstateSearchResponse } from "@/types/Api"
import { useMutation } from "@tanstack/react-query"

const toSearchError = (err: unknown): Error => {
  if (axios.isAxiosError(err)) {
    if (err.code === "ECONNABORTED") {
      return new Error(
        "La búsqueda tardó demasiado. Verificá tu conexión e intentá de nuevo.",
      )
    }
    if (!err.response) {
      return new Error(
        "No se pudo conectar al servidor. Verificá que el backend esté corriendo.",
      )
    }
    if (err.response.status >= 500) {
      return new Error("Error en el servidor. Intentá de nuevo en un momento.")
    }
    if (err.response.status === 422) {
      return new Error("La búsqueda no es válida. Intentá reformularla.")
    }
    if (err.response.status >= 400) {
      return new Error("Hubo un problema con la búsqueda. Intentá de nuevo.")
    }
  }
  return new Error("Ocurrió un error inesperado.")
}

export const useRealEstateSearch = () => {
  return useMutation({
    mutationFn: async (query: string) => {
      try {
        const response = await apiClient.post<RealEstateSearchResponse>(
          "/search",
          { query },
        )
        return response.data
      } catch (err) {
        throw toSearchError(err)
      }
    },
  })
}
