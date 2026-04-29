import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { http, HttpResponse } from "msw"
import type { ReactNode } from "react"
import { server } from "@/test/server"
import RealEstate from "./RealEstate"

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

const renderRealEstate = () =>
  render(<RealEstate />, { wrapper: createWrapper() })

describe("RealEstate", () => {
  describe("Initial render", () => {
    it("renders the search input with placeholder text", () => {
      renderRealEstate()
      expect(
        screen.getByPlaceholderText(/casas con 3 habitaciones/i),
      ).toBeInTheDocument()
    })

    it("renders the Buscar button, enabled by default", () => {
      renderRealEstate()
      expect(screen.getByRole("button", { name: "Buscar" })).not.toBeDisabled()
    })

    it("does not show the SQL card on mount", () => {
      renderRealEstate()
      expect(screen.queryByText(/traducción automática/i)).not.toBeInTheDocument()
    })

    it("does not show the loading text on mount", () => {
      renderRealEstate()
      expect(
        screen.queryByText("Buscando propiedades..."),
      ).not.toBeInTheDocument()
    })
  })

  describe("Search interaction", () => {
    it("updates the input value as the user types", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 10")
      expect(input).toHaveValue("casas en zona 10")
    })

    it("does not trigger a mutation when Buscar is clicked with empty input", async () => {
      renderRealEstate()
      await userEvent.click(screen.getByRole("button", { name: "Buscar" }))
      expect(screen.queryByText("Buscando...")).not.toBeInTheDocument()
    })

    it("triggers a mutation when Buscar is clicked with valid input", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14")
      await userEvent.click(screen.getByRole("button", { name: "Buscar" }))
      await waitFor(() =>
        expect(screen.queryByText("Buscando...")).not.toBeInTheDocument(),
      )
      expect(screen.getByText(/traducción automática/i)).toBeInTheDocument()
    })

    it("triggers a mutation when Enter is pressed with valid input", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(screen.getByText(/traducción automática/i)).toBeInTheDocument(),
      )
    })
  })

  describe("Loading state", () => {
    beforeEach(() => {
      server.use(
        http.post("http://localhost:8000/search", async () => {
          await new Promise((resolve) => setTimeout(resolve, 200))
          return HttpResponse.json({ sql: "SELECT 1", results: [] })
        }),
      )
    })

    it("shows Buscando... button text while pending", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas{Enter}")
      expect(await screen.findByRole("button", { name: "Buscando..." })).toBeInTheDocument()
    })

    it("disables the Buscar button while pending", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas{Enter}")
      expect(await screen.findByRole("button", { name: "Buscando..." })).toBeDisabled()
    })

    it("shows the loading paragraph while pending", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas{Enter}")
      expect(await screen.findByText("Buscando propiedades...")).toBeInTheDocument()
    })
  })

  describe("Success state with results", () => {
    it("renders the SQL card after a successful search", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(screen.getByText(/traducción automática/i)).toBeInTheDocument(),
      )
    })

    it("shows the generated SQL in a pre element", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(
          screen.getByText("SELECT * FROM properties WHERE zone = 14"),
        ).toBeInTheDocument(),
      )
    })

    it("renders property cards equal to the number of results", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(screen.getAllByRole("img")).toHaveLength(1),
      )
    })

    it("shows the Copiar button after a successful search", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /copiar/i })).toBeInTheDocument(),
      )
    })
  })

  describe("Success state with empty results", () => {
    it("shows the empty state message when no properties are returned", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "empty{Enter}")
      await waitFor(() =>
        expect(
          screen.getByText("No se encontraron propiedades"),
        ).toBeInTheDocument(),
      )
    })

    it("renders the three example search buttons in the empty state", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "empty{Enter}")
      await waitFor(() =>
        expect(screen.getByText("casas en zona 14")).toBeInTheDocument(),
      )
      expect(screen.getByText("apartamentos menores a 200000")).toBeInTheDocument()
      expect(screen.getByText("terrenos grandes")).toBeInTheDocument()
    })

    it("clicking an example button triggers a new mutation", async () => {
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "empty{Enter}")
      await waitFor(() =>
        expect(screen.getByText("casas en zona 14")).toBeInTheDocument(),
      )
      await userEvent.click(screen.getByText("casas en zona 14"))
      await waitFor(() =>
        expect(screen.getByText(/traducción automática/i)).toBeInTheDocument(),
      )
    })
  })

  describe("Error state", () => {
    it("shows an error heading when the server is unreachable", async () => {
      server.use(
        http.post("http://localhost:8000/search", () => HttpResponse.error()),
      )
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(
          screen.getByText("No se pudo completar la búsqueda"),
        ).toBeInTheDocument(),
      )
    })

    it("shows the specific error message from the hook", async () => {
      server.use(
        http.post("http://localhost:8000/search", () => HttpResponse.error()),
      )
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(
          screen.getByText(
            "No se pudo conectar al servidor. Verificá que el backend esté corriendo.",
          ),
        ).toBeInTheDocument(),
      )
    })

    it("shows a server error message when the server responds with 500", async () => {
      server.use(
        http.post("http://localhost:8000/search", () =>
          HttpResponse.json({ detail: "Internal Server Error" }, { status: 500 }),
        ),
      )
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(
          screen.getByText("Error en el servidor. Intentá de nuevo en un momento."),
        ).toBeInTheDocument(),
      )
    })

    it("does not show the SQL card when there is an error", async () => {
      server.use(
        http.post("http://localhost:8000/search", () => HttpResponse.error()),
      )
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      await waitFor(() =>
        expect(
          screen.getByText("No se pudo completar la búsqueda"),
        ).toBeInTheDocument(),
      )
      expect(screen.queryByText(/traducción automática/i)).not.toBeInTheDocument()
    })
  })

  describe("Copy SQL button", () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it("calls clipboard.writeText with the SQL and toggles button text", async () => {
      vi.useRealTimers()
      renderRealEstate()
      const input = screen.getByPlaceholderText(/casas con 3 habitaciones/i)
      await userEvent.type(input, "casas en zona 14{Enter}")
      const copyBtn = await screen.findByRole("button", { name: /copiar/i })
      await userEvent.click(copyBtn)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "SELECT * FROM properties WHERE zone = 14",
      )
      expect(screen.getByRole("button", { name: /copiado/i })).toBeInTheDocument()
    })
  })
})
