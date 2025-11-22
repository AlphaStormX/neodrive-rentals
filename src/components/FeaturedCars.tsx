import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CarCard from "./CarCard";
import { Loader2 } from "lucide-react";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  image_url: string;
  transmission: string;
  seats: number;
  fuel_type: string;
}

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_available", true)
        .limit(6);

      if (!error && data) {
        setCars(data);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="featured-cars" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text">Featured</span> Supercars
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked selection of the world's most exclusive and powerful vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car.id} className="animate-fade-up">
              <CarCard
                id={car.id}
                brand={car.brand}
                model={car.model}
                year={car.year}
                pricePerDay={car.price_per_day}
                imageUrl={car.image_url}
                transmission={car.transmission}
                seats={car.seats}
                fuelType={car.fuel_type}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
