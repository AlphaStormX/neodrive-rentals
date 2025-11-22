import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface Profile {
  name: string;
  email: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Count bookings
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);

      setBookingsCount(count || 0);

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roleData);
      setLoading(false);
    };

    checkAuth();
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
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="gradient-text">{profile?.name || "User"}</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your bookings and account settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass p-6 hover-scale">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text">
                  {bookingsCount}
                </div>
                <div className="text-muted-foreground">Total Bookings</div>
              </div>
            </div>
          </Card>

          <Card className="glass p-6 hover-scale">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-full">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <div className="text-3xl font-bold gradient-accent-text">
                  Active
                </div>
                <div className="text-muted-foreground">Account Status</div>
              </div>
            </div>
          </Card>

          {isAdmin && (
            <Card className="glass p-6 hover-scale glow-accent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-full">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-accent-text">
                    Admin
                  </div>
                  <div className="text-muted-foreground">Access Level</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/cars">
            <Card className="glass p-6 hover-scale cursor-pointer transition-all hover:glow-primary">
              <h3 className="text-xl font-bold mb-2">Browse Cars</h3>
              <p className="text-muted-foreground">
                Explore our premium fleet
              </p>
            </Card>
          </Link>

          <Link to="/bookings">
            <Card className="glass p-6 hover-scale cursor-pointer transition-all hover:glow-secondary">
              <h3 className="text-xl font-bold mb-2">My Bookings</h3>
              <p className="text-muted-foreground">
                View your rental history
              </p>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="glass p-6 hover-scale cursor-pointer transition-all hover:glow-accent">
              <h3 className="text-xl font-bold mb-2">Profile Settings</h3>
              <p className="text-muted-foreground">
                Update your information
              </p>
            </Card>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <Card className="glass p-6 hover-scale cursor-pointer transition-all hover:glow-accent">
                <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
                <p className="text-muted-foreground">
                  Manage cars & bookings
                </p>
              </Card>
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
