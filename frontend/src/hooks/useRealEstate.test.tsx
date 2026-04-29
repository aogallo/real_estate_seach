import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, it, expect } from "vitest"
import { http, HttpResponse } from "msw"
import type { ReactNode } from "react"
import { server } from "@/test/server"
import { mockSearchResponse, mockEmptyResponse } from "@/test/fixtures/property"
import { useRealEstateSearch } from "./useRealEstate"

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe("useRealEstateSearch", () => {
  it("returns idle state before any mutation is called", () => {
    const { result } = renderHook(() => useRealEstateSearch(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it("returns sql and results after a successful mutation", async () => {
    const { result } = renderHook(() => useRealEstateSearch(), {
      wrapper: createWrapper(),
    })
    act(() => {
      result.current.mutate("casas en zona 14")
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.sql).toBe(mockSearchResponse.sql)
    expect(result.current.data?.results).toHaveLength(1)
  })

  it("returns empty results array when server responds with no properties", async () => {
    const { result } = renderHook(() => useRealEstateSearch(), {
      wrapper: createWrapper(),
    })
    act(() => {
      result.current.mutate("empty")
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.results).toHaveLength(0)
    expect(result.current.data?.sql).toBe(mockEmptyResponse.sql)
  })

  it("sets isError to true when server responds with 500", async () => {
    server.use(
      http.post("http://localhost:8000/search", () =>
        HttpResponse.json({ detail: "Internal Server Error" }, { status: 500 }),
      ),
    )
    const { result } = renderHook(() => useRealEstateSearch(), {
      wrapper: createWrapper(),
    })
    act(() => {
      result.current.mutate("casas en zona 14")
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe(
      "Error en el servidor. Intentá de nuevo en un momento.",
    )
  })

  it("returns a connection error message when the server is unreachable", async () => {
    server.use(
      http.post("http://localhost:8000/search", () => HttpResponse.error()),
    )
    const { result } = renderHook(() => useRealEstateSearch(), {
      wrapper: createWrapper(),
    })
    act(() => {
      result.current.mutate("casas en zona 14")
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe(
      "No se pudo conectar al servidor. Verificá que el backend esté corriendo.",
    )
  })

  it("returns a validation error message when server responds with 422", async () => {
    server.use(
      http.post("http://localhost:8000/search", () =>
        HttpResponse.json({ detail: "Unprocessable Entity" }, { status: 422 }),
      ),
    )
    const { result } = renderHook(() => useRealEstateSearch(), {
      wrapper: createWrapper(),
    })
    act(() => {
      result.current.mutate("casas en zona 14")
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe(
      "La búsqueda no es válida. Intentá reformularla.",
    )
  })
})
