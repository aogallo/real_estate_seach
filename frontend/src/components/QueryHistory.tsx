import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Copy, Check, Trash2, RotateCcw, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQueryHistory } from "@/hooks/useQueryHistory"

const ITEMS_PER_PAGE = 10

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))

export function QueryHistory() {
  const { history, deleteEntry } = useQueryHistory()
  const navigate = useNavigate()
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = history.filter(
    (e) =>
      e.naturalLanguage.toLowerCase().includes(filter.toLowerCase()) ||
      e.sql.toLowerCase().includes(filter.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleCopy = async (id: string, sql: string) => {
    await navigator.clipboard.writeText(sql)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleRerun = (naturalLanguage: string) => {
    navigate(`/?q=${encodeURIComponent(naturalLanguage)}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 pb-20 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-pe-on-surface">
          Historial de Consultas
        </h1>
        <p className="mt-1 text-sm text-pe-on-surface-variant">
          Revisá, re-ejecutá o eliminá tus búsquedas anteriores
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 rounded-xl border border-pe-outline-variant bg-pe-surface-container p-2">
        <Search
          className="ml-2 shrink-0 text-pe-on-surface-variant"
          size={18}
        />
        <Input
          placeholder="Filtrar por consulta o SQL..."
          className="border-none bg-transparent text-pe-on-surface placeholder:text-pe-on-surface-variant focus-visible:ring-0"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {/* Empty state */}
      {history.length === 0 && (
        <div className="rounded-xl border border-pe-outline-variant py-16 text-center">
          <History
            size={40}
            className="mx-auto mb-4 text-pe-on-surface-variant opacity-40"
          />
          <p className="text-lg font-medium text-pe-on-surface">
            Sin historial todavía
          </p>
          <p className="mt-2 text-sm text-pe-on-surface-variant">
            Realizá una búsqueda para que aparezca aquí
          </p>
          <Button
            variant="outline"
            className="mt-4 border-pe-outline-variant text-pe-on-surface-variant hover:text-pe-on-surface"
            onClick={() => navigate("/")}
          >
            Ir a Búsqueda
          </Button>
        </div>
      )}

      {/* Table */}
      {history.length > 0 && (
        <>
          {/* Table header (desktop) */}
          <div className="hidden grid-cols-12 gap-4 px-4 py-2 text-xs font-medium tracking-wide text-pe-on-surface-variant uppercase md:grid">
            <div className="col-span-4">Consulta en lenguaje natural</div>
            <div className="col-span-2">Fecha y hora</div>
            <div className="col-span-4">SQL generado</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {paginated.map((entry) => (
              <div
                key={entry.id}
                className="space-y-3 rounded-xl border border-pe-outline-variant bg-pe-surface-container p-4 md:grid md:grid-cols-12 md:items-start md:gap-4 md:space-y-0"
              >
                {/* Natural language */}
                <div className="md:col-span-4">
                  <p className="mb-1 text-xs font-medium tracking-wide text-pe-on-surface-variant uppercase md:hidden">
                    Consulta
                  </p>
                  <p className="text-sm text-pe-on-surface">
                    "{entry.naturalLanguage}"
                  </p>
                  <p className="mt-1 text-xs text-pe-on-surface-variant">
                    {entry.resultCount} resultado
                    {entry.resultCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="md:col-span-2">
                  <p className="mb-1 text-xs font-medium tracking-wide text-pe-on-surface-variant uppercase md:hidden">
                    Fecha
                  </p>
                  <p className="text-xs text-pe-on-surface-variant">
                    {formatDate(entry.executedAt)}
                  </p>
                </div>

                {/* SQL */}
                <div className="relative md:col-span-4">
                  <p className="mb-1 text-xs font-medium tracking-wide text-pe-on-surface-variant uppercase md:hidden">
                    SQL
                  </p>
                  <div className="rounded-lg border-l-4 border-pe-secondary bg-pe-surface p-3 pr-8">
                    <pre className="line-clamp-3 overflow-x-auto font-grotesk text-xs break-all whitespace-pre-wrap text-pe-on-surface">
                      {entry.sql}
                    </pre>
                  </div>
                  <button
                    aria-label="Copiar SQL"
                    onClick={() => handleCopy(entry.id, entry.sql)}
                    className="absolute top-2 right-2 rounded p-1 text-pe-on-surface-variant transition-colors hover:text-pe-on-surface"
                  >
                    {copiedId === entry.id ? (
                      <Check size={12} />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 md:col-span-2 md:flex-col md:items-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex gap-1.5 border-pe-outline-variant text-pe-on-surface-variant hover:border-pe-primary hover:text-pe-primary"
                    onClick={() => handleRerun(entry.naturalLanguage)}
                  >
                    <RotateCcw size={12} />
                    Re-ejecutar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex gap-1.5 text-pe-on-surface-variant hover:text-pe-error"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 size={12} />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-pe-on-surface-variant">
                Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de{" "}
                {filtered.length} consultas
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-8 w-8 rounded-lg text-xs transition-colors ${
                        p === page
                          ? "bg-pe-primary text-pe-on-primary"
                          : "text-pe-on-surface-variant hover:bg-pe-surface-variant hover:text-pe-on-surface"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
