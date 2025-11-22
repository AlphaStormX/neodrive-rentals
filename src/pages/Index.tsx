import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedCars />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
