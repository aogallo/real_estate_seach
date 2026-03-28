import { Card, CardContent } from "@/components/ui/card"
import type { Property } from "@/types/RealEstate"
import { Bed, Bath, MapPin, Expand } from "lucide-react"

interface RealEstateCardProps {
  property: Property
}

export function RealEstateCard({ property }: RealEstateCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md">
      <img
        src={property.image_url}
        alt={property.title}
        className="h-56 w-full object-cover"
      />

      <CardContent className="space-y-3 p-4">
        <div>
          <h2 className="text-lg font-semibold">{property.title}</h2>
          <p className="text-sm text-muted-foreground">
            {property.description}
          </p>
        </div>

        <div className="text-xl font-bold">
          ${property.price.toLocaleString()}
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            {property.rooms}
          </div>

          <div className="flex items-center gap-1">
            <Bath size={16} />
            {property.restroom}
          </div>

          <div className="flex items-center gap-1">
            <Expand size={16} />
            {property.area_m2} m²
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={16} />
          {property.location}
        </div>
      </CardContent>
    </Card>
  )
}
