import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast({
        title: "Subscribed successfully!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{t("newsletter.title")}</h2>
        <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
          {t("newsletter.subtitle")}
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <Input
            type="email"
            placeholder={t("newsletter.placeholder")}
            className="flex-1 text-foreground bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="input-email-newsletter"
          />
          <Button
            type="submit"
            variant="secondary"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isSubmitting}
            data-testid="button-subscribe"
          >
            {isSubmitting ? t("newsletter.subscribing") : t("newsletter.subscribe")}
          </Button>
        </form>
        <p className="text-sm text-primary-foreground/70 mt-4">
          {t("newsletter.privacy")}
        </p>
      </div>
    </section>
  );
}
