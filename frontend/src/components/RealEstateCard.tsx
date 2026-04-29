import type { Property } from "@/types/RealEstate"
import { Bed, Bath, MapPin, Expand } from "lucide-react"

interface RealEstateCardProps {
  property: Property
}

export function RealEstateCard({ property }: RealEstateCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-pe-outline-variant bg-pe-surface-container">
      <div className="relative h-48">
        <img
          src={property.image_url}
          alt={property.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-pe-secondary/20 px-2 py-0.5 font-grotesk text-xs font-medium text-pe-secondary">
            SQL GENERADO
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-lg font-bold text-white">
            ${property.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h2 className="text-sm font-semibold text-pe-on-surface">
            {property.title}
          </h2>
          <p className="mt-0.5 text-xs text-pe-on-surface-variant">
            {property.description}
          </p>
        </div>

        <div className="flex gap-4 text-xs text-pe-on-surface-variant">
          <div className="flex items-center gap-1">
            <Bed size={14} />
            {property.rooms}
          </div>
          <div className="flex items-center gap-1">
            <Bath size={14} />
            {property.restroom}
          </div>
          <div className="flex items-center gap-1">
            <Expand size={14} />
            {property.area_m2} m²
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-pe-on-surface-variant">
          <MapPin size={14} />
          {property.location}
        </div>
      </div>
    </div>
  )
}
