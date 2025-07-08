"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { jwtDecode } from "jwt-decode";
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';

type Cake = {
   _id: string;
  name: string
  description: string
  price: string
  imageUrl: string
}
interface AdminCakeCardProps {
  search: string
}

interface JwtPayload {
  userId: string;
}

  /*code below was moved into cakeCard function below
  const AddToCart = async (cake: Cake)=>{
    try{
      //if (typeof window === 'undefined') return;

       const token = localStorage.getItem("token");
       if (!token) return alert("User not logged in");
       const decoded: any = jwtDecode(token);
       const userId = decoded.userId; 
       const payload = {
        userId,
        cakeId: cake._id || "cake-001", // make sure cake has _id
        name: cake.name,
        price: parseFloat(cake.price),
        description: cake.description,
        imageUrl: cake.imageUrl,
        quantity: 1,
      };
      console.log("Sending payload to /api/Cart:", payload);
       const res = await fetch("http://localhost:3000/api/Cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        if(res.ok){
            const data = await res.json();
            alert(data.message || "Added to Cart!")
        }
        } catch(error:any){
              console.error("Failed to add to Cart:", error)
              alert("Error adding to cart.");
            }
            };*/
const CakeCard = ({search}: AdminCakeCardProps) => {
  const {fetchCart } = useCart(); // 
  
  const AddToCart = async (cake: Cake)=>{
    try{
      //if (typeof window === 'undefined') return;
       const token = localStorage.getItem("token");
       if (!token) return alert("User not logged in");

       const decoded: JwtPayload = jwtDecode(token);
       const userId = decoded.userId; 
       const storedUser = localStorage.getItem("Userdata")
        if (!storedUser){
          alert("userdata not found");
          return;
        }
        const Userinfo = JSON.parse(storedUser);// converts the storedUser into valid JSON
        const username = Userinfo.username;
        if (!userId || !Userinfo.username) {
          alert("Invalid user info");
           return;
          }

       const payload = {
        userId,
        username,
        cakeId: cake._id || "cake-001", // make sure cake has _id
        name: cake.name,
        price: parseFloat(cake.price),
        description: cake.description,
        imageUrl: cake.imageUrl,
        quantity: 1,
      };

      console.log("Sending payload to /api/Cart:", payload);
       const res = await fetch("/api/Cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        if(res.ok){
            const data = await res.json();
            toast.success(data.message || "Added to Cart!");
            console.log(data.message)
            console.log(data.item)
            await fetchCart();
        }

        } catch(error:unknown){
           if (error instanceof Error) {
              toast.error("Error adding to cart." + " " + error);
           }
          }
        };

useEffect(()=>{  
            const fetchCakes = async ()=>{
                            const res = await fetch('/api/GetCakes',{
                                method: "GET",
                                headers: { "Content-Type": "application/json" }
                            })
                            const data:Cake[] = await res.json();
                            setCakes(data);
                        }
                  fetchCakes();
          }, []);
          
  const [cakes, setCakes] = useState<Cake[]>([]);
  const filteredCakes = search ? 
  (cakes.filter(cake =>cake.name.toLowerCase().includes(search.toLowerCase()) )) : cakes

        
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-5 gap-x-5 md:gap-8 w-fit md:w-fit py-4 px-6 '>
          {filteredCakes.map((cake: Cake, index:number)=>(
          <div key={index} className=' relative h-[233px] md:h-[333px] w-[144px] md:w-[244px] overflow-hidden flex flex-col shadow-2xl rounded-[4px] hover:scale-105 transition-all duration-300 '>
            <div className='relative h-[193px] md:h-[293px] w-[144px] md:w-[244px]'>
               <Image className='rounded-[4px] object-cover'
                  src={cake.imageUrl}
                  alt={cake.name}
                  sizes="250px"
                  priority={index < 4}
                  fill
                  />
            </div>
            <div className=' flex flex-col text-center justify-center items-center py-2  bg-white'>
              <p className='font-bold text-purple-500 md:text-2xl text-[18px]'>{cake.name}</p>
              <p className='font-bold'>{cake.description}</p>
              <p className='font-bold'>Ksh: {cake.price}</p>
              <button onClick={()=>AddToCart(cake)} className='bg-orange-600 h-[35px] w-[130px] text-white hover:bg-green-500 rounded-[4px] transition-all duration-150'>Add to Cart</button>
            </div>
          </div>
        ))}  
    </div>
  )
}

export default CakeCard
