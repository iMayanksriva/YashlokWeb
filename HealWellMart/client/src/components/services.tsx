import { Truck, UserCheck, Clock, Tag, Smartphone, Percent } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Services() {
  const { t } = useLanguage();
  const services = [
    {
      icon: Truck,
      title: t("services.delivery.title"),
      description: t("services.delivery.desc"),
      color: "bg-accent/10 text-accent",
    },
    {
      icon: UserCheck,
      title: t("services.consultation.title"),
      description: t("services.consultation.desc"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Clock,
      title: t("services.emergency.title"),
      description: t("services.emergency.desc"),
      color: "bg-destructive/10 text-destructive",
    },
    {
      icon: Tag,
      title: t("services.quality.title"),
      description: t("services.quality.desc"),
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      icon: Smartphone,
      title: t("services.digital.title"),
      description: t("services.digital.desc"),
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: Percent,
      title: t("services.prices.title"),
      description: t("services.prices.desc"),
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t("services.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="text-center" data-testid={`service-${index}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${service.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
