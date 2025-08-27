import { Button } from "@/components/ui/button";
import { Award, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-accent/20 px-3 py-1 rounded-full text-sm font-medium">
                <Award className="w-4 h-4 mr-1 inline" />
                {t("hero.established")}
              </div>
            </div>
            <h2 className="text-5xl font-bold mb-4">{t("hero.title")}</h2>
            <p className="text-xl mb-6 text-primary-foreground/90">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-primary-foreground/90">
                <CheckCircle className="w-5 h-5 mr-2 text-accent" />
                {t("hero.licensed")}
              </div>
              <div className="flex items-center text-primary-foreground/90">
                <CheckCircle className="w-5 h-5 mr-2 text-accent" />
                {t("hero.emergency")}
              </div>
              <div className="flex items-center text-primary-foreground/90">
                <CheckCircle className="w-5 h-5 mr-2 text-accent" />
                {t("hero.delivery")}
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-card text-primary hover:bg-card/90"
                data-testid="button-browse-medicines"
              >
                {t("hero.browse")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                data-testid="button-upload-prescription"
              >
                {t("hero.upload")}
              </Button>
            </div>
          </div>
          <div className="flex-1 max-w-md ml-8">
            <img
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Modern pharmacy interior"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
