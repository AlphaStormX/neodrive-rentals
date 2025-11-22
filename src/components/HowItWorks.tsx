import { UserPlus, Car, Calendar, Zap } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds and join thousands of satisfied customers",
  },
  {
    icon: Car,
    title: "Choose Your Car",
    description: "Browse our premium fleet and pick your dream supercar",
  },
  {
    icon: Calendar,
    title: "Select Dates",
    description: "Pick your rental dates and complete the booking instantly",
  },
  {
    icon: Zap,
    title: "Drive & Enjoy",
    description: "Hit the road and experience pure driving pleasure",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            How It <span className="gradient-accent-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get behind the wheel in just four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative glass rounded-2xl p-8 text-center hover-scale transition-all duration-300 hover:glow-primary animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl glow-primary">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <step.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 gradient-text">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>

              {/* Connector Line (not on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
