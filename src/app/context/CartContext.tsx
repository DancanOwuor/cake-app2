"use client"
import React, { createContext, useContext, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

interface JwtPayload {
  userId: string;
}

export type CartItem = {
  _id: string;
  userId: string;
  username: string;
  cakeId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext is undefined!");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token not found");
        return;
      }

      const decoded: JwtPayload = jwtDecode(token);
      const userId = decoded.userId;

      const res = await fetch(`/api/Cart?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch cart");
      }

      const data: CartItem[] = await res.json();
      setCart(data);
    } catch (error) {
      toast.error("Cart fetch failed");
      console.error(error);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};