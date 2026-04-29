import { useState, useCallback } from "react"
import type { QueryHistoryEntry } from "@/types/QueryHistory"

const STORAGE_KEY = "pe_query_history"
const MAX_ENTRIES = 50

const loadHistory = (): QueryHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const persist = (entries: QueryHistoryEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const useQueryHistory = () => {
  const [history, setHistory] = useState<QueryHistoryEntry[]>(loadHistory)

  const addEntry = useCallback(
    (entry: Omit<QueryHistoryEntry, "id" | "executedAt">) => {
      setHistory((prev) => {
        const next: QueryHistoryEntry = {
          ...entry,
          id: crypto.randomUUID(),
          executedAt: new Date().toISOString(),
        }
        const updated = [next, ...prev].slice(0, MAX_ENTRIES)
        persist(updated)
        return updated
      })
    },
    []
  )

  const deleteEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      persist(updated)
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setHistory([])
    persist([])
  }, [])

  return { history, addEntry, deleteEntry, clearAll }
}
