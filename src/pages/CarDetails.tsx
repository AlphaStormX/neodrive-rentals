import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Gauge, Fuel, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  description: string;
  image_url: string;
  transmission: string;
  seats: number;
  fuel_type: string;
  features: string[];
}

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setCar(data);
      }
      setLoading(false);
    };

    fetchCar();
  }, [id]);

  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !car) return 0;
    const days = differenceInDays(returnDate, pickupDate);
    return days > 0 ? days * car.price_per_day : 0;
  };

  const handleBooking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to book a car");
      navigate("/auth");
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    if (returnDate <= pickupDate) {
      toast.error("Return date must be after pickup date");
      return;
    }

    setBooking(true);

    const { error } = await supabase.from("bookings").insert({
      user_id: session.user.id,
      car_id: id,
      pickup_date: format(pickupDate, "yyyy-MM-dd"),
      return_date: format(returnDate, "yyyy-MM-dd"),
      total_price: calculateTotal(),
      status: "Confirmed",
    });

    if (error) {
      toast.error("Booking failed. Please try again.");
    } else {
      toast.success("Car booked successfully!");
      navigate("/bookings");
    }

    setBooking(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-primary">Loading...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-muted-foreground">Car not found</p>
          <Button onClick={() => navigate("/cars")} className="mt-4">
            Back to Cars
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/cars")}
          className="mb-6 glass"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cars
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image & Details */}
          <div className="space-y-6 animate-fade-up">
            {/* Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden glass">
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {car.brand}
              </h1>
              <p className="text-2xl text-muted-foreground">{car.model}</p>
              <p className="text-lg text-muted-foreground">{car.year}</p>
            </div>

            {/* Description */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-3">About This Car</h3>
              <p className="text-muted-foreground">{car.description}</p>
            </Card>

            {/* Specifications */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4">Specifications</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Seats</div>
                  <div className="font-bold">{car.seats}</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <Gauge className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Trans.</div>
                  <div className="font-bold">{car.transmission}</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <Fuel className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">Fuel</div>
                  <div className="font-bold">{car.fuel_type}</div>
                </div>
              </div>
            </Card>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <Card className="glass p-6">
                <h3 className="text-xl font-bold mb-4">Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Right: Booking */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Card className="glass-strong p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Book This Car</h2>

              {/* Price */}
              <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                <div className="text-4xl font-bold gradient-text">
                  ${car.price_per_day}
                  <span className="text-lg text-muted-foreground">/day</span>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pickup Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal glass",
                          !pickupDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={pickupDate}
                        onSelect={setPickupDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Return Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal glass",
                          !returnDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) => date < (pickupDate || new Date())}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Total */}
              {pickupDate && returnDate && calculateTotal() > 0 && (
                <div className="mb-6 p-4 glass rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">
                      {differenceInDays(returnDate, pickupDate)} days
                    </span>
                    <span className="text-muted-foreground">
                      ${car.price_per_day} × {differenceInDays(returnDate, pickupDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="gradient-accent-text">
                      ${calculateTotal()}
                    </span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                disabled={booking || !pickupDate || !returnDate}
                className="w-full glow-primary text-lg py-6"
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </Button>

              {/* Info */}
              <p className="text-sm text-muted-foreground text-center mt-4">
                Free cancellation up to 24 hours before pickup
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarDetails;
