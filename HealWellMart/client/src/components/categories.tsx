import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useLanguage } from "@/context/language-context";
import { type Category } from "@shared/schema";

export default function Categories() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("categories.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("categories.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6 text-center animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground",
      "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
      "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
      "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
      "bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white",
      "bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t("categories.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("categories.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="bg-card rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-primary/20 relative overflow-hidden category-card"
              data-testid={`card-category-${category.slug}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6 ${getCategoryColor(index)}`}>
                <i className={`${category.icon} text-2xl transition-all duration-300 group-hover:text-3xl`}></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">{category.name}</h3>
              <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">{category.itemCount} {t("categories.items")}</p>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
