import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        data-testid="cart-overlay"
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{t("cart.title")}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-cart"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("cart.empty")}</p>
              <Button className="mt-4" onClick={onClose} data-testid="button-continue-shopping">
                {t("cart.continue")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 pb-4 border-b border-border"
                  data-testid={`cart-item-${item.medicine.id}`}
                >
                  <img
                    src={item.medicine.imageUrl || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                    alt={item.medicine.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.medicine.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.medicine.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-semibold text-foreground">
                        ₹{(parseFloat(item.medicine.price) * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-6 h-6"
                          onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.medicine.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-8 text-center" data-testid={`quantity-${item.medicine.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-6 h-6"
                          onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.medicine.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 text-destructive"
                          onClick={() => removeFromCart(item.medicine.id)}
                          data-testid={`button-remove-${item.medicine.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-foreground">{t("cart.total")}</span>
              <span className="text-xl font-bold text-primary" data-testid="cart-total">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>
            <Button className="w-full mb-2" data-testid="button-checkout">
              {t("cart.checkout")}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              data-testid="button-continue-shopping-footer"
            >
              {t("cart.continue")}
            </Button>
            <Button
              variant="ghost"
              className="w-full mt-2 text-destructive"
              onClick={clearCart}
              data-testid="button-clear-cart"
            >
              {t("cart.clear")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
