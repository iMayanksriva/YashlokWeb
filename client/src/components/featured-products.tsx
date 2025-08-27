import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { type MedicineWithCategory } from "@shared/schema";

export default function FeaturedProducts() {
  const { data: medicines = [], isLoading } = useQuery<MedicineWithCategory[]>({
    queryKey: ["/api/medicines", { limit: 4 }],
    queryFn: async () => {
      const response = await fetch("/api/medicines?limit=4");
      if (!response.ok) throw new Error("Failed to fetch medicines");
      return response.json();
    },
  });

  const { addToCart } = useCart();
  const { t } = useLanguage();

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const stars = [];
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(ratingNum);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4" />);
    }

    return stars;
  };

  const getStockStatus = (stockCount: number, threshold: number = 10) => {
    if (stockCount === 0) {
      return { label: t("products.outOfStock"), color: "destructive", icon: AlertCircle };
    } else if (stockCount <= threshold) {
      return { label: t("products.lowStock"), color: "amber-500", icon: AlertCircle };
    } else {
      return { label: t("products.inStock"), color: "accent", icon: CheckCircle };
    }
  };

  const getStockPercentage = (stockCount: number, maxStock: number = 100) => {
    return Math.min((stockCount / maxStock) * 100, 100);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("products.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("products.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-48 bg-muted"></div>
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t("products.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("products.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => {
            const stockStatus = getStockStatus(medicine.stockCount, medicine.stockThreshold);
            const stockPercentage = getStockPercentage(medicine.stockCount);
            const StockIcon = stockStatus.icon;

            return (
              <div key={medicine.id} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow" data-testid={`card-medicine-${medicine.id}`}>
                <Link href={`/medicine/${medicine.id}`}>
                  <img
                    src={medicine.imageUrl || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                    alt={medicine.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {medicine.category.name}
                    </Badge>
                    <Badge
                      variant={stockStatus.color === "accent" ? "default" : "destructive"}
                      className={`text-xs flex items-center ${
                        stockStatus.color === "amber-500" ? "bg-amber-500 text-white" : ""
                      }`}
                    >
                      <StockIcon className="w-3 h-3 mr-1" />
                      {stockStatus.label}
                    </Badge>
                  </div>
                  
                  <Link href={`/medicine/${medicine.id}`}>
                    <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                      {medicine.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{medicine.description}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-amber-400 text-sm">
                      {renderStars(medicine.averageRating)}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {medicine.averageRating} ({medicine.reviewCount} {t("products.reviews")})
                    </span>
                  </div>

                  {/* Stock Indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Stock:</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-muted rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            stockStatus.color === "accent" ? "bg-accent" : 
                            stockStatus.color === "amber-500" ? "bg-amber-500" : "bg-destructive"
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        stockStatus.color === "accent" ? "text-accent" :
                        stockStatus.color === "amber-500" ? "text-amber-600" : "text-destructive"
                      }`}>
                        {medicine.stockCount} {t("products.units")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-foreground">₹{medicine.price}</span>
                      {medicine.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-1">
                          ₹{medicine.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(medicine.id, 1);
                      }}
                      disabled={medicine.stockCount === 0}
                      data-testid={`button-add-to-cart-${medicine.id}`}
                    >
                      {t("products.addToCart")}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" data-testid="button-view-all-medicines">
            {t("products.viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}
