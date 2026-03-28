import { useState } from "react"
import { Search, Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useRealEstateSearch } from "@/hooks/useRealEstate"
import { RealEstateCard } from "./RealEstateCard"

const RealEstate = () => {
  const [query, setQuery] = useState("")
  const [copied, setCopied] = useState(false)
  const { mutate, data, isPending, isSuccess } = useRealEstateSearch()

  const sqlResult = data?.sql || ""
  const realEstates = data?.results || []

  const handleSearch = () => {
    if (!query.trim()) return
    mutate(query)
  }

  const handleCopy = async () => {
    if (!sqlResult) return
    await navigator.clipboard.writeText(sqlResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* 🔍 Buscador  */}
      <div className="flex items-center gap-2 rounded-xl border p-2 shadow-sm">
        <Search className="ml-2 text-muted-foreground" />
        <Input
          placeholder="Ej: casas con 3 habitaciones en zona 14"
          className="border-none focus-visible:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isPending}
          className="rounded-lg"
        >
          {isPending ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {/* 🧠 SQL generado */}
      {sqlResult && (
        <Card className="relative">
          <CardContent className="space-y-2 p-4">
            <p className="text-xs font-medium text-green-600">
              ✔ Traducción automática lenguaje natural → SQL
            </p>

            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
              {sqlResult}
            </pre>

            {/* 📋 Copy button */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 flex gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={16} /> Copiado
                </>
              ) : (
                <>
                  <Copy size={16} /> Copiar
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ⏳ Loading */}
      {isPending && (
        <p className="text-center text-muted-foreground">
          Buscando propiedades...
        </p>
      )}

      {/* 📦 Resultados */}
      {realEstates.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {realEstates.map((property) => (
            <RealEstateCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* ⚠️ Estado vacío  */}
      {isSuccess && realEstates.length === 0 && (
        <div className="rounded-xl border py-12 text-center">
          <p className="text-lg font-medium">No se encontraron propiedades</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Intenta con otra búsqueda como:
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              "casas en zona 14",
              "apartamentos menores a 200000",
              "terrenos grandes",
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(example)
                  mutate(example)
                }}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RealEstate
