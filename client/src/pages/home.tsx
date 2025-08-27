import { useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Categories from "@/components/categories";
import FeaturedProducts from "@/components/featured-products";
import Services from "@/components/services";
import Reviews from "@/components/reviews";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      
      {/* Quick Stats */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-pills text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">5000+</h3>
              <p className="text-muted-foreground">Medicines Available</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">50,000+</h3>
              <p className="text-muted-foreground">Satisfied Customers</p>
            </div>
            <div className="text-center">
              <div className="bg-destructive text-destructive-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">42</h3>
              <p className="text-muted-foreground">Years of Service</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">4.8</h3>
              <p className="text-muted-foreground">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      <Hero />
      <Categories />
      <FeaturedProducts />
      <Services />
      <Reviews />
      <Newsletter />
      <Footer />
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
