import { Star } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Reviews() {
  const { t } = useLanguage();
  const reviews = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Regular Customer",
      rating: 5,
      comment: "Been a customer for over 15 years. The staff is knowledgeable and always helpful. Their home delivery service has been a lifesaver, especially during emergencies.",
      initial: "R",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Verified Buyer",
      rating: 5,
      comment: "Excellent service and genuine medicines. The pharmacist took time to explain the dosage and precautions. Very professional and caring approach.",
      initial: "P",
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Long-time Customer",
      rating: 4,
      comment: "Trust and reliability - that's what Yashlok Medical Hall represents. They have been serving our family for decades. Highly recommended for genuine medicines.",
      initial: "A",
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-current text-amber-400" : "text-gray-300"}`}
        />
      );
    }
    return stars;
  };

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t("reviews.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("reviews.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-lg p-6" data-testid={`review-${review.id}`}>
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground ml-2">{review.rating}.0</span>
              </div>
              <p className="text-foreground mb-4">"{review.comment}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-semibold">
                  <span>{review.initial}</span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
