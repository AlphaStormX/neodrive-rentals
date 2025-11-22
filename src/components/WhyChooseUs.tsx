import { Shield, Clock, Award, CreditCard, Headphones, MapPin } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance whenever you need us",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Comprehensive coverage for complete peace of mind",
  },
  {
    icon: Award,
    title: "Premium Fleet",
    description: "Only the finest supercars from legendary brands",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Protected transactions with industry-leading security",
  },
  {
    icon: Headphones,
    title: "Easy Booking",
    description: "Seamless online reservation process in minutes",
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    description: "Convenient pickup points across major cities",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose <span className="gradient-text">NeoDrive</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the difference with our premium service and attention to detail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 hover-scale transition-all duration-300 hover:glow-secondary animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6 glow-primary">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
