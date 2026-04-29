import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, it, expect } from "vitest"
import type { ReactNode } from "react"
import App from "./App"

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />, { wrapper: createWrapper() })
  })

  it("renders a main element", () => {
    render(<App />, { wrapper: createWrapper() })
    expect(screen.getByRole("main")).toBeInTheDocument()
  })

  it("renders the search input inside main", () => {
    render(<App />, { wrapper: createWrapper() })
    expect(
      screen.getByPlaceholderText(/casas con 3 habitaciones/i),
    ).toBeInTheDocument()
  })
})
