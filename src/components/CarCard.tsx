import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Gauge, Fuel } from "lucide-react";

interface CarCardProps {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
  transmission: string;
  seats: number;
  fuelType: string;
}

const CarCard = ({
  id,
  brand,
  model,
  year,
  pricePerDay,
  imageUrl,
  transmission,
  seats,
  fuelType,
}: CarCardProps) => {
  return (
    <Card className="glass overflow-hidden group hover-scale cursor-pointer transition-all duration-300 border-primary/20 hover:border-primary/50 hover:glow-primary">
      <Link to={`/cars/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-primary">{year}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Brand & Model */}
          <div>
            <h3 className="text-xl font-bold gradient-text">{brand}</h3>
            <p className="text-muted-foreground">{model}</p>
          </div>

          {/* Specifications */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{seats}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              <span>{transmission}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{fuelType}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-2xl font-bold gradient-accent-text">
                ${pricePerDay}
              </span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
            <Button size="sm" className="glow-primary">
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CarCard;
