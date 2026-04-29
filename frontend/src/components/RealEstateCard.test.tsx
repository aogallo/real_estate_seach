import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { RealEstateCard } from "./RealEstateCard"
import { mockProperty } from "@/test/fixtures/property"

describe("RealEstateCard", () => {
  it("renders the property title in a heading", () => {
    render(<RealEstateCard property={mockProperty} />)
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      mockProperty.title,
    )
  })

  it("renders the property description", () => {
    render(<RealEstateCard property={mockProperty} />)
    expect(screen.getByText(mockProperty.description)).toBeInTheDocument()
  })

  it("renders the price with dollar sign and locale formatting", () => {
    render(<RealEstateCard property={mockProperty} />)
    expect(screen.getByText(/\$[\d,.]+/)).toBeInTheDocument()
  })

  it("renders the rooms count", () => {
    render(<RealEstateCard property={mockProperty} />)
    expect(screen.getByText(String(mockProperty.rooms))).toBeInTheDocument()
  })

  it("renders the restroom count", () => {
    render(<RealEstateCard property={mockProperty} />)
    expect(screen.getByText(String(mockProperty.restroom))).toBeInTheDocument()
  })

  it("renders area with m² suffix", () => {
    render(<RealEstateCard property={mockProperty} />)
    expect(screen.getByText(`${mockProperty.area_m2} m²`)).toBeInTheDocument()
  })

  it("renders the property location", () => {
    render(<RealEstateCard property={mockProperty} />)
    expect(screen.getByText(mockProperty.location)).toBeInTheDocument()
  })

  it("renders image with correct src and alt attributes", () => {
    render(<RealEstateCard property={mockProperty} />)
    const img = screen.getByRole("img", { name: mockProperty.title })
    expect(img).toHaveAttribute("src", mockProperty.image_url)
  })
})
