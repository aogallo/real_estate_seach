import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealEstateSearch } from "@/hooks/useRealEstate"
import type { Property } from "@/types/RealEstate"
import { RealEstateCard } from "./RealEstateCard"

const RealEstate = () => {
  const [query, setQuery] = useState("")

  const searchMutation = useRealEstateSearch()

  const handleSearch = () => {
    if (!query.trim()) return
    searchMutation.mutate(query)
  }

  const results = searchMutation.data || []

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-center text-3xl font-bold">
          🏠 Búsqueda Inmobiliaria
        </h1>

        <div className="flex gap-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: casas de 3 habitaciones"
          />

          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>

        {searchMutation.isPending && <p>Buscando...</p>}

        {searchMutation.isError && (
          <p className="text-red-500">Error al buscar</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {results.map((property: Property) => (
            <RealEstateCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RealEstate
