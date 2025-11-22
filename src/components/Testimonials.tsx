import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Tech Executive",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5,
    text: "Absolutely incredible experience! The Ferrari F8 Tributo was a dream to drive. The booking process was seamless and the customer service was top-notch.",
  },
  {
    name: "Sarah Williams",
    role: "Entrepreneur",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5,
    text: "NeoDrive delivers on every promise. Rented the Lamborghini Huracán for a special occasion, and it exceeded all expectations. Will definitely be back!",
  },
  {
    name: "David Rodriguez",
    role: "Investment Banker",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    rating: 5,
    text: "Professional service, pristine vehicles, and competitive pricing. The BMW M8 was in perfect condition. This is now my go-to for luxury car rentals.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            What Our <span className="gradient-accent-text">Clients Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust NeoDrive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="glass p-8 hover-scale transition-all duration-300 hover:glow-accent animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
                />
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
