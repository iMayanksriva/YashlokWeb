import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Header
    "header.pharmacy": "Licensed Pharmacy",
    "header.open": "Open 24/7",
    "header.search": "Search medicines, health products...",
    "header.home": "Home",
    "header.categories": "Categories",
    "header.prescription": "Prescription Upload",
    "header.blog": "Health Blog",
    "header.contact": "Contact Us",
    
    // Hero
    "hero.established": "Established 1982",
    "hero.title": "Your Trusted Healthcare Partner",
    "hero.subtitle": "Over 40 years of dedicated service to our community. Quality medicines, expert guidance, and compassionate care.",
    "hero.licensed": "Licensed & Certified Pharmacy",
    "hero.emergency": "24/7 Emergency Service",
    "hero.delivery": "Free Home Delivery",
    "hero.browse": "Browse Medicines",
    "hero.upload": "Upload Prescription",
    
    // Categories
    "categories.title": "Shop by Category",
    "categories.subtitle": "Find the right medication quickly with our organized categories and expert guidance.",
    "categories.items": "items",
    
    // Featured Products
    "products.title": "Featured Medicines",
    "products.subtitle": "Popular and trusted medications with excellent customer reviews and fast delivery.",
    "products.outOfStock": "Out of Stock",
    "products.lowStock": "Low Stock",
    "products.inStock": "In Stock",
    "products.reviews": "reviews",
    "products.units": "units",
    "products.addToCart": "Add to Cart",
    "products.viewAll": "View All Medicines",
    
    // Services
    "services.title": "Why Choose Yashlok Medical Hall?",
    "services.subtitle": "Four decades of trust, innovation, and compassionate healthcare service.",
    "services.delivery.title": "Free Home Delivery",
    "services.delivery.desc": "Fast and secure delivery to your doorstep within 2 hours for orders above ₹500.",
    "services.consultation.title": "Expert Consultation",
    "services.consultation.desc": "Licensed pharmacists available for free consultation and medication guidance.",
    "services.emergency.title": "24/7 Emergency Service",
    "services.emergency.desc": "Round-the-clock availability for urgent medication needs and emergencies.",
    "services.quality.title": "Quality Assured",
    "services.quality.desc": "Only genuine medicines from authorized manufacturers with proper storage conditions.",
    "services.digital.title": "Digital Prescriptions",
    "services.digital.desc": "Upload prescriptions digitally and get medicines delivered with proper verification.",
    "services.prices.title": "Best Prices",
    "services.prices.desc": "Competitive pricing with regular discounts and special offers for senior citizens.",
    
    // Reviews
    "reviews.title": "What Our Customers Say",
    "reviews.subtitle": "Real reviews from real customers who trust us with their healthcare needs.",
    
    // Newsletter
    "newsletter.title": "Stay Updated with Health Tips",
    "newsletter.subtitle": "Subscribe to our newsletter for health tips, medication reminders, and exclusive offers.",
    "newsletter.placeholder": "Enter your email address",
    "newsletter.subscribe": "Subscribe",
    "newsletter.subscribing": "Subscribing...",
    "newsletter.privacy": "We respect your privacy and never spam.",
    
    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.continue": "Continue Shopping",
    "cart.total": "Total:",
    "cart.checkout": "Proceed to Checkout",
    "cart.clear": "Clear Cart",
    
    // Common
    "search": "Search",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "price": "Price",
    "quantity": "Quantity",
    "rating": "Rating",
  },
  hi: {
    // Header
    "header.pharmacy": "लाइसेंसीकृत फार्मेसी",
    "header.open": "24/7 खुला",
    "header.search": "दवाइयां, स्वास्थ्य उत्पाद खोजें...",
    "header.home": "होम",
    "header.categories": "श्रेणियां",
    "header.prescription": "प्रेस्क्रिप्शन अपलोड",
    "header.blog": "स्वास्थ्य ब्लॉग",
    "header.contact": "संपर्क करें",
    
    // Hero
    "hero.established": "स्थापित 1982",
    "hero.title": "आपका विश्वसनीय स्वास्थ्य साझेदार",
    "hero.subtitle": "हमारे समुदाय की 40 साल से अधिक की समर्पित सेवा। गुणवत्तापूर्ण दवाएं, विशेषज्ञ मार्गदर्शन और दयालु देखभाल।",
    "hero.licensed": "लाइसेंसीकृत और प्रमाणित फार्मेसी",
    "hero.emergency": "24/7 आपातकालीन सेवा",
    "hero.delivery": "मुफ्त होम डिलीवरी",
    "hero.browse": "दवाइयां देखें",
    "hero.upload": "प्रेस्क्रिप्शन अपलोड करें",
    
    // Categories
    "categories.title": "श्रेणी के अनुसार खरीदारी करें",
    "categories.subtitle": "हमारी संगठित श्रेणियों और विशेषज्ञ मार्गदर्शन के साथ सही दवा जल्दी खोजें।",
    "categories.items": "वस्तुएं",
    
    // Featured Products
    "products.title": "विशेष दवाइयां",
    "products.subtitle": "उत्कृष्ट ग्राहक समीक्षाओं और तेज़ डिलीवरी के साथ लोकप्रिय और विश्वसनीय दवाएं।",
    "products.outOfStock": "स्टॉक में नहीं",
    "products.lowStock": "कम स्टॉक",
    "products.inStock": "स्टॉक में उपलब्ध",
    "products.reviews": "समीक्षाएं",
    "products.units": "यूनिट",
    "products.addToCart": "कार्ट में जोड़ें",
    "products.viewAll": "सभी दवाइयां देखें",
    
    // Services
    "services.title": "यशलोक मेडिकल हॉल क्यों चुनें?",
    "services.subtitle": "चार दशक का भरोसा, नवाचार और दयालु स्वास्थ्य सेवा।",
    "services.delivery.title": "मुफ्त होम डिलीवरी",
    "services.delivery.desc": "₹500 से अधिक के ऑर्डर पर 2 घंटे के भीतर आपके घर तक तेज़ और सुरक्षित डिलीवरी।",
    "services.consultation.title": "विशेषज्ञ परामर्श",
    "services.consultation.desc": "मुफ्त परामर्श और दवा मार्गदर्शन के लिए लाइसेंसीकृत फार्मासिस्ट उपलब्ध।",
    "services.emergency.title": "24/7 आपातकालीन सेवा",
    "services.emergency.desc": "तत्काल दवा की जरूरत और आपातकाल के लिए चौबीसों घंटे उपलब्धता।",
    "services.quality.title": "गुणवत्ता का आश्वासन",
    "services.quality.desc": "उचित भंडारण स्थितियों के साथ केवल अधिकृत निर्माताओं से असली दवाएं।",
    "services.digital.title": "डिजिटल प्रेस्क्रिप्शन",
    "services.digital.desc": "प्रेस्क्रिप्शन डिजिटल रूप से अपलोड करें और उचित सत्यापन के साथ दवाएं प्राप्त करें।",
    "services.prices.title": "बेहतरीन कीमतें",
    "services.prices.desc": "वरिष्ठ नागरिकों के लिए नियमित छूट और विशेष ऑफ़र के साथ प्रतिस्पर्धी मूल्य निर्धारण।",
    
    // Reviews
    "reviews.title": "हमारे ग्राहक क्या कहते हैं",
    "reviews.subtitle": "वास्तविक ग्राहकों की वास्तविक समीक्षाएं जो अपनी स्वास्थ्य आवश्यकताओं के लिए हम पर भरोसा करते हैं।",
    
    // Newsletter
    "newsletter.title": "स्वास्थ्य टिप्स के साथ अपडेट रहें",
    "newsletter.subtitle": "स्वास्थ्य टिप्स, दवा रिमाइंडर और विशेष ऑफ़र के लिए हमारे न्यूज़लेटर की सदस्यता लें।",
    "newsletter.placeholder": "अपना ईमेल पता दर्ज करें",
    "newsletter.subscribe": "सदस्यता लें",
    "newsletter.subscribing": "सदस्यता ली जा रही है...",
    "newsletter.privacy": "हम आपकी गोपनीयता का सम्मान करते हैं और कभी स्पैम नहीं करते।",
    
    // Cart
    "cart.title": "शॉपिंग कार्ट",
    "cart.empty": "आपका कार्ट खाली है",
    "cart.continue": "खरीदारी जारी रखें",
    "cart.total": "कुल:",
    "cart.checkout": "चेकआउट पर जाएं",
    "cart.clear": "कार्ट साफ़ करें",
    
    // Common
    "search": "खोजें",
    "loading": "लोड हो रहा है...",
    "error": "त्रुटि",
    "success": "सफलता",
    "price": "कीमत",
    "quantity": "मात्रा",
    "rating": "रेटिंग",
  },
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}