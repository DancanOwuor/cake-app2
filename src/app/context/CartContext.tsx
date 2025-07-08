"use client";
import React, { createContext, useContext, useState} from "react";
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner";

interface JwtPayload {
  userId: string;
}

export type CartItem = {
   _id: string;
  userId: string;
  username: string;
  cakeId: string;
  name: string
  description: string
  price: number
  imageUrl: string
  quantity: number;
}

type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = ()=>{
    const context = useContext(CartContext);
    if (!context) throw new Error("CartContext is undefined!");
    return context;
}
export const CartProvider = ({children}: { children: React.ReactNode })=>{
    const [cart, setCart] = useState<CartItem[]>([]);

   
        const fetchCart = async ()=>{
            try{
                const token = localStorage.getItem("token");
                if(!token) 
                return alert("token not found");
                const decoded: JwtPayload = jwtDecode(token); //decodes the token
                const userId = decoded.userId;  //gets userId from the decoded token
                
                const res = await fetch(`/api/Cart?userId=${userId}`,{
                                                  method: "GET",
                                                  headers: { "Content-Type": "application/json" }
                                              });
                      if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || "Failed to fetch cart");
                      }                        
                      const data:CartItem[] = await res.json();
                      setCart(data);
            } catch(error:unknown){
                 if (error instanceof Error) {
                        toast.error("Cart fetch failed");
                        console.error(error)
                 }
            }
        };
    /*useEffect(()=>{
        fetchCart();
    }, []);*/

    return (
        <CartContext.Provider value={{cart, setCart, fetchCart}}>   {/*cartcontext.provider makes the cart data available to any component inside it. value is what gets shared i.e the current items in the cart and perhaps function to update them */}
            {children} {/*the items that access the shared state variable i.e any componenents that are wrapped inside cart context*/}
        </CartContext.Provider>
    );
};