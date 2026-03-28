import type { Property } from "./RealEstate"

export type RealEstateSearchResponse = {
  sql: string
  results: Property[]
}
