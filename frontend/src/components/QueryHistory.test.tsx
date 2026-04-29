import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, beforeEach } from "vitest"
import { QueryHistory } from "./QueryHistory"
import type { QueryHistoryEntry } from "@/types/QueryHistory"

const STORAGE_KEY = "pe_query_history"

const makeEntry = (
  overrides?: Partial<QueryHistoryEntry>
): QueryHistoryEntry => ({
  id: crypto.randomUUID(),
  naturalLanguage: "casas en zona 14",
  sql: "SELECT * FROM properties WHERE zone = 14",
  resultCount: 3,
  executedAt: new Date().toISOString(),
  ...overrides,
})

const renderHistory = (entries: QueryHistoryEntry[] = []) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return render(
    <MemoryRouter>
      <QueryHistory />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe("QueryHistory", () => {
  describe("Empty state", () => {
    it("shows the empty state when there is no history", () => {
      renderHistory([])
      expect(screen.getByText("Sin historial todavía")).toBeInTheDocument()
    })

    it("shows a link to go to search", () => {
      renderHistory([])
      expect(
        screen.getByRole("button", { name: /ir a búsqueda/i })
      ).toBeInTheDocument()
    })
  })

  describe("With history entries", () => {
    it("renders the natural language query", () => {
      const entry = makeEntry()
      renderHistory([entry])
      expect(screen.getByText(`"${entry.naturalLanguage}"`)).toBeInTheDocument()
    })

    it("renders the SQL for each entry", () => {
      const entry = makeEntry()
      renderHistory([entry])
      expect(screen.getByText(entry.sql)).toBeInTheDocument()
    })

    it("renders the result count", () => {
      const entry = makeEntry({ resultCount: 5 })
      renderHistory([entry])
      expect(screen.getByText("5 resultados")).toBeInTheDocument()
    })

    it("renders singular result count for 1 result", () => {
      const entry = makeEntry({ resultCount: 1 })
      renderHistory([entry])
      expect(screen.getByText("1 resultado")).toBeInTheDocument()
    })

    it("removes an entry when Eliminar is clicked", async () => {
      const entry = makeEntry()
      renderHistory([entry])
      await userEvent.click(screen.getByRole("button", { name: /eliminar/i }))
      expect(
        screen.queryByText(`"${entry.naturalLanguage}"`)
      ).not.toBeInTheDocument()
    })

    it("shows Re-ejecutar button for each entry", () => {
      const entry = makeEntry()
      renderHistory([entry])
      expect(
        screen.getByRole("button", { name: /re-ejecutar/i })
      ).toBeInTheDocument()
    })
  })

  describe("Filter", () => {
    it("filters entries by natural language text", async () => {
      renderHistory([
        makeEntry({ naturalLanguage: "casas en zona 14" }),
        makeEntry({ naturalLanguage: "terrenos grandes" }),
      ])
      const filterInput = screen.getByPlaceholderText(/filtrar/i)
      await userEvent.type(filterInput, "terrenos")
      expect(screen.queryByText(/"casas en zona 14"/)).not.toBeInTheDocument()
      expect(screen.getByText(/"terrenos grandes"/)).toBeInTheDocument()
    })
  })
})
