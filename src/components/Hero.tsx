import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToCars = () => {
    const carsSection = document.getElementById("featured-cars");
    carsSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Futuristic supercars"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 text-primary animate-glow-pulse" />
            <span className="text-sm font-medium">Premium Car Rental Experience</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Rent the{" "}
            <span className="gradient-text animate-glow-pulse">Future</span>
            <br />
            Drive the{" "}
            <span className="gradient-accent-text">Legend</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Experience the ultimate in luxury and performance. From Ferrari to Lamborghini, drive the car of your dreams today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="glow-primary text-lg px-8 py-6 group"
              onClick={scrollToCars}
            >
              Browse Cars
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 glass border-primary/50 hover:bg-primary/10"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            {[
              { value: "50+", label: "Luxury Cars" },
              { value: "24/7", label: "Support" },
              { value: "5K+", label: "Happy Clients" },
            ].map((stat, index) => (
              <div key={index} className="glass rounded-lg p-4 hover-scale">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
