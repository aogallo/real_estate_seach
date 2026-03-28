import { apiClient } from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"

export const useRealEstateSearch = () => {
  return useMutation({
    mutationFn: async (query: string) => {
      const response = await apiClient.post("/search", { query })

      return response.data.results
    },
  })
}
