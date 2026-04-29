import type { Property } from "@/types/RealEstate"
import type { RealEstateSearchResponse } from "@/types/Api"

export const mockProperty: Property = {
  id: 1,
  title: "Casa en Zona 14",
  description: "Amplia casa familiar con jardín",
  type: "casa",
  price: 350000,
  rooms: 3,
  restroom: 2,
  area_m2: 220,
  image_url: "https://example.com/image.jpg",
  location: "Zona 14, Ciudad de Guatemala",
}

export const mockSearchResponse: RealEstateSearchResponse = {
  sql: "SELECT * FROM properties WHERE zone = 14",
  results: [mockProperty],
}

export const mockEmptyResponse: RealEstateSearchResponse = {
  sql: "SELECT * FROM properties WHERE price < 10",
  results: [],
}
