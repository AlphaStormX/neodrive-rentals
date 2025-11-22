import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Car as CarIcon } from "lucide-react";

interface Booking {
  id: string;
  pickup_date: string;
  return_date: string;
  total_price: number;
  status: string;
  cars: {
    brand: string;
    model: string;
    image_url: string;
  };
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          cars (brand, model, image_url)
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookings(data);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            View and manage your car rental history
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <CarIcon className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            <p className="text-2xl text-muted-foreground mb-4">No bookings yet</p>
            <button
              onClick={() => navigate("/cars")}
              className="text-primary hover:text-accent transition-colors"
            >
              Browse our fleet →
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="glass p-6 hover-scale animate-fade-up">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={booking.cars.image_url}
                    alt={`${booking.cars.brand} ${booking.cars.model}`}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold gradient-text mb-2">
                      {booking.cars.brand} {booking.cars.model}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(booking.pickup_date), "MMM dd, yyyy")}</span>
                        <span>→</span>
                        <span>{format(new Date(booking.return_date), "MMM dd, yyyy")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "Confirmed" ? "bg-primary/20 text-primary" :
                        booking.status === "Completed" ? "bg-secondary/20 text-secondary" :
                        booking.status === "Cancelled" ? "bg-destructive/20 text-destructive" :
                        "bg-accent/20 text-accent"
                      }`}>
                        {booking.status}
                      </div>
                      <div className="text-2xl font-bold gradient-accent-text">
                        ${booking.total_price}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Bookings;
