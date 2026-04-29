import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import { useQueryHistory } from "./useQueryHistory"

beforeEach(() => {
  localStorage.clear()
})

describe("useQueryHistory", () => {
  it("starts with empty history when localStorage is empty", () => {
    const { result } = renderHook(() => useQueryHistory())
    expect(result.current.history).toHaveLength(0)
  })

  it("addEntry adds an entry with generated id and executedAt", () => {
    const { result } = renderHook(() => useQueryHistory())
    act(() => {
      result.current.addEntry({
        naturalLanguage: "casas",
        sql: "SELECT *",
        resultCount: 3,
      })
    })
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].naturalLanguage).toBe("casas")
    expect(result.current.history[0].id).toBeDefined()
    expect(result.current.history[0].executedAt).toBeDefined()
    expect(result.current.history[0].resultCount).toBe(3)
  })

  it("addEntry prepends entries so newest is first", () => {
    const { result } = renderHook(() => useQueryHistory())
    act(() => {
      result.current.addEntry({
        naturalLanguage: "first",
        sql: "SELECT 1",
        resultCount: 0,
      })
    })
    act(() => {
      result.current.addEntry({
        naturalLanguage: "second",
        sql: "SELECT 2",
        resultCount: 0,
      })
    })
    expect(result.current.history[0].naturalLanguage).toBe("second")
    expect(result.current.history[1].naturalLanguage).toBe("first")
  })

  it("deleteEntry removes the entry with the matching id", () => {
    const { result } = renderHook(() => useQueryHistory())
    act(() => {
      result.current.addEntry({
        naturalLanguage: "test",
        sql: "SELECT *",
        resultCount: 1,
      })
    })
    const id = result.current.history[0].id
    act(() => {
      result.current.deleteEntry(id)
    })
    expect(result.current.history).toHaveLength(0)
  })

  it("persists entries to localStorage", () => {
    const { result } = renderHook(() => useQueryHistory())
    act(() => {
      result.current.addEntry({
        naturalLanguage: "test",
        sql: "SELECT *",
        resultCount: 1,
      })
    })
    const raw = localStorage.getItem("pe_query_history")
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toHaveLength(1)
  })

  it("loads persisted history from localStorage on init", () => {
    const entry = {
      id: "abc",
      naturalLanguage: "persisted",
      sql: "SELECT 1",
      resultCount: 0,
      executedAt: new Date().toISOString(),
    }
    localStorage.setItem("pe_query_history", JSON.stringify([entry]))
    const { result } = renderHook(() => useQueryHistory())
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].naturalLanguage).toBe("persisted")
  })

  it("limits history to 50 entries (FIFO)", () => {
    const { result } = renderHook(() => useQueryHistory())
    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.addEntry({
          naturalLanguage: `query ${i}`,
          sql: "SELECT *",
          resultCount: 0,
        })
      }
    })
    expect(result.current.history).toHaveLength(50)
  })
})
