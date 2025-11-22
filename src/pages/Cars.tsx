import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

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

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_available", true)
        .order("brand", { ascending: true });

      if (!error && data) {
        setCars(data);
        setFilteredCars(data);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  useEffect(() => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (car) =>
          car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (brandFilter !== "all") {
      filtered = filtered.filter((car) => car.brand === brandFilter);
    }

    setFilteredCars(filtered);
  }, [searchTerm, brandFilter, cars]);

  const brands = ["all", ...Array.from(new Set(cars.map((car) => car.brand)))];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Premium</span> Fleet
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our exclusive collection of the world's finest supercars
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 animate-fade-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass pl-10"
            />
          </div>

          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="glass w-full md:w-48">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.filter(b => b !== "all").map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">
              No cars found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cars;
