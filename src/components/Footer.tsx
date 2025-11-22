import { Link } from "react-router-dom";
import { Car, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-strong border-t border-primary/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">NeoDrive</span>
            </div>
            <p className="text-muted-foreground">
              Experience the future of luxury car rentals. Drive the legends.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/cars", label: "Browse Cars" },
                { to: "/auth", label: "Sign Up" },
                { to: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Support</h3>
            <ul className="space-y-2">
              {["FAQ", "Terms & Conditions", "Privacy Policy", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@neodrive.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            © {currentYear} NeoDrive Rentals. All rights reserved. Built with cutting-edge technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
