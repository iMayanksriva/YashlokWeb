import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type CartItemWithMedicine } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItemWithMedicine[];
  isLoading: boolean;
  addToCart: (medicineId: string, quantity: number) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

// Generate session ID for anonymous users
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sessionId] = useState(getSessionId);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart", {
        headers: {
          "x-session-id": sessionId,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ medicineId, quantity }: { medicineId: string; quantity: number }) => {
      return apiRequest("POST", "/api/cart", { medicineId, quantity }, {
        headers: {
          "x-session-id": sessionId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ medicineId, quantity }: { medicineId: string; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${medicineId}`, { quantity }, {
        headers: {
          "x-session-id": sessionId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (medicineId: string) => {
      return apiRequest("DELETE", `/api/cart/${medicineId}`, undefined, {
        headers: {
          "x-session-id": sessionId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/cart", undefined, {
        headers: {
          "x-session-id": sessionId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  const cartTotal = cartItems.reduce((total: number, item: CartItemWithMedicine) => {
    return total + (parseFloat(item.medicine.price) * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count: number, item: CartItemWithMedicine) => {
    return count + item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart: (medicineId, quantity) => addToCartMutation.mutate({ medicineId, quantity }),
        updateQuantity: (medicineId, quantity) => updateQuantityMutation.mutate({ medicineId, quantity }),
        removeFromCart: (medicineId) => removeFromCartMutation.mutate(medicineId),
        clearCart: () => clearCartMutation.mutate(),
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
