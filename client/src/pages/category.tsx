import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Category, type MedicineWithCategory } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartSidebar from "@/components/cart-sidebar";
import FeaturedProducts from "@/components/featured-products";

export default function CategoryPage() {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", slug],
  });

  const { data: medicines = [], isLoading } = useQuery<MedicineWithCategory[]>({
    queryKey: ["/api/medicines", { categoryId: category?.id, search: searchQuery }],
    queryFn: async () => {
      if (!category?.id) return [];
      const params = new URLSearchParams();
      params.append("categoryId", category.id);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/medicines?${params}`);
      if (!response.ok) throw new Error("Failed to fetch medicines");
      return response.json();
    },
    enabled: !!category?.id,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatically handled by the query
  };

  // Sort medicines
  const sortedMedicines = [...medicines].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.averageRating) - parseFloat(a.averageRating);
      default:
        return 0;
    }
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center">
              <i className={`${category.icon} text-2xl`}></i>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
          <p className="text-muted-foreground mb-4">{category.description}</p>
          <p className="text-sm text-muted-foreground">{category.itemCount} items available</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder={`Search in ${category.name}...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-category-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </form>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                data-testid="button-grid-view"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                data-testid="button-list-view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-48 bg-muted"></div>
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedMedicines.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No medicines found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 
                `No results for "${searchQuery}" in ${category.name}` :
                `No medicines available in ${category.name} category`
              }
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {sortedMedicines.length} of {category.itemCount} medicines
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Use the existing FeaturedProducts component structure but pass filtered medicines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* We'll render the medicines here similar to FeaturedProducts but simpler */}
              {sortedMedicines.map((medicine) => (
                <div key={medicine.id} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {/* This would be the same structure as in FeaturedProducts */}
                  <p className="p-4 text-center">{medicine.name}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
