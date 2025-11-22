import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast.error("Access denied. Admin only.");
        navigate("/dashboard");
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8">
          <span className="gradient-text">Admin</span> Panel
        </h1>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="glass">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="glass p-6">
              <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>
              <p className="text-muted-foreground">View and manage all customer bookings</p>
            </Card>
          </TabsContent>

          <TabsContent value="cars">
            <Card className="glass p-6">
              <h2 className="text-2xl font-bold mb-4">Manage Cars</h2>
              <p className="text-muted-foreground">Add, edit, or remove cars from the fleet</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
