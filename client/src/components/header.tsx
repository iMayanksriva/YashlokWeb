import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingCart, Menu, X, Phone, Mail, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { useQuery } from "@tanstack/react-query";
import { type Category } from "@shared/schema";
import LanguageSwitcher from "@/components/language-switcher";

export default function Header({ onCartToggle }: { onCartToggle: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const { cartCount } = useCart();
  const { t } = useLanguage();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground border-b border-border">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              +91 98765 43210
            </span>
            <span className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              info@yashlokmedical.com
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Shield className="w-3 h-3 mr-1 text-accent" />
              {t("header.pharmacy")}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {t("header.open")}
            </span>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0" data-testid="link-home">
              <div>
                <h1 className="text-2xl font-bold text-primary">Yashlok Medical Hall</h1>
                <p className="text-sm text-muted-foreground">Trusted Since 1982 • 40+ Years of Service</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder={t("header.search")}
                className="w-full pl-10 pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                data-testid="button-search"
              >
                {t("search")}
              </Button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" data-testid="button-account">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-wishlist">
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartToggle}
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center cart-item-count">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-3 border-t border-border">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                href="/"
                className={`font-medium transition-colors hover:text-primary ${
                  location === "/" ? "text-primary" : "text-foreground"
                }`}
                data-testid="link-nav-home"
              >
                {t("header.home")}
              </Link>
            </li>
            <li className="relative group">
              <button
                className="text-foreground hover:text-primary font-medium transition-colors flex items-center"
                data-testid="button-categories"
              >
                {t("header.categories")}
                <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {/* Categories Dropdown */}
              <div className="absolute top-full left-0 bg-card border border-border rounded-lg shadow-lg mt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-3 py-2 text-sm hover:bg-muted rounded-md"
                      data-testid={`link-category-${category.slug}`}
                    >
                      <i className={`${category.icon} mr-2`}></i>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <button className="text-foreground hover:text-primary font-medium transition-colors" data-testid="button-prescription">
                {t("header.prescription")}
              </button>
            </li>
            <li>
              <button className="text-foreground hover:text-primary font-medium transition-colors" data-testid="button-blog">
                {t("header.blog")}
              </button>
            </li>
            <li>
              <button className="text-foreground hover:text-primary font-medium transition-colors" data-testid="button-contact">
                {t("header.contact")}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
