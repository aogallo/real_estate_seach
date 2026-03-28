import { apiClient } from "@/lib/axios"
import type { RealEstateSearchResponse } from "@/types/Api"
import { useMutation } from "@tanstack/react-query"

export const useRealEstateSearch = () => {
  return useMutation({
    mutationFn: async (query: string) => {
      const response = await apiClient.post<RealEstateSearchResponse>(
        "/search",
        { query }
      )

      return response.data
    },
  })
}
