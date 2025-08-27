import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-4">Yashlok Medical Hall</h3>
            <p className="text-muted-foreground mb-4">
              Serving the community with quality healthcare solutions since 1982. Your trusted partner in health and wellness.
            </p>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <button className="text-lg hover:text-primary transition-colors" data-testid="button-facebook">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="text-lg hover:text-primary transition-colors" data-testid="button-twitter">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="text-lg hover:text-primary transition-colors" data-testid="button-instagram">
                <i className="fab fa-instagram"></i>
              </button>
              <button className="text-lg hover:text-primary transition-colors" data-testid="button-linkedin">
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors" data-testid="link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors" data-testid="link-services">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors" data-testid="link-blog">
                  Health Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors" data-testid="link-contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Info</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">123 Main Street, Medical District, City 400001</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">info@yashlokmedical.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">Open 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Yashlok Medical Hall. All rights reserved. | Licensed Pharmacy Est. 1982</p>
        </div>
      </div>
    </footer>
  );
}
