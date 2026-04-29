import { useState, useEffect } from "react"
import { Search, Copy, Check } from "lucide-react"
import { useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRealEstateSearch } from "@/hooks/useRealEstate"
import { useQueryHistory } from "@/hooks/useQueryHistory"
import { RealEstateCard } from "./RealEstateCard"

const RealEstate = () => {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(initialQuery)
  const [copied, setCopied] = useState(false)
  const { mutate, data, isPending, isSuccess, isError, error } =
    useRealEstateSearch()
  const { addEntry } = useQueryHistory()

  const sqlResult = data?.sql || ""
  const realEstates = data?.results || []

  useEffect(() => {
    if (initialQuery) {
      mutate(initialQuery, {
        onSuccess: (result) => {
          addEntry({
            naturalLanguage: initialQuery,
            sql: result.sql,
            resultCount: result.results.length,
          })
        },
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    if (!query.trim()) return
    mutate(query, {
      onSuccess: (result) => {
        addEntry({
          naturalLanguage: query,
          sql: result.sql,
          resultCount: result.results.length,
        })
      },
    })
  }

  const handleCopy = async () => {
    if (!sqlResult) return
    await navigator.clipboard.writeText(sqlResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 pb-20 md:pb-6">
      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-xl border border-pe-outline-variant bg-pe-surface-container p-2">
        <Search
          className="ml-2 shrink-0 text-pe-on-surface-variant"
          size={18}
        />
        <Input
          placeholder="Ej: casas con 3 habitaciones en zona 14"
          className="border-none bg-transparent text-pe-on-surface placeholder:text-pe-on-surface-variant focus-visible:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isPending}
          className="shrink-0 rounded-lg bg-pe-primary text-pe-on-primary hover:bg-pe-primary/90"
        >
          {isPending ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {/* SQL card */}
      {sqlResult && (
        <div className="relative rounded-xl border-l-4 border-pe-secondary bg-pe-surface-container p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-pe-secondary/20 px-2 py-0.5 font-grotesk text-xs font-medium text-pe-secondary">
              SQL GENERADO
            </span>
            <p className="text-xs text-pe-on-surface-variant">
              ✔ Traducción automática lenguaje natural → SQL
            </p>
          </div>
          <pre className="overflow-x-auto rounded-md bg-pe-surface p-3 font-grotesk text-sm text-pe-on-surface">
            {sqlResult}
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 flex gap-2 text-pe-on-surface-variant hover:text-pe-on-surface"
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
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-pe-error/30 bg-pe-error/10 px-6 py-5">
          <p className="font-medium text-pe-error">
            No se pudo completar la búsqueda
          </p>
          <p className="mt-1 text-sm text-pe-error/80">
            {error instanceof Error
              ? error.message
              : "Ocurrió un error inesperado."}
          </p>
        </div>
      )}

      {/* Loading */}
      {isPending && (
        <p className="text-center text-pe-on-surface-variant">
          Buscando propiedades...
        </p>
      )}

      {/* Results grid */}
      {realEstates.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {realEstates.map((property) => (
            <RealEstateCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {isSuccess && realEstates.length === 0 && (
        <div className="rounded-xl border border-pe-outline-variant py-12 text-center">
          <p className="text-lg font-medium text-pe-on-surface">
            No se encontraron propiedades
          </p>
          <p className="mt-2 text-sm text-pe-on-surface-variant">
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
                className="border-pe-outline-variant text-pe-on-surface-variant hover:bg-pe-surface-variant hover:text-pe-on-surface"
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
