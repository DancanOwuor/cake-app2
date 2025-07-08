"use client";
import React, { useState, useEffect } from 'react'
import SearchBar from '@/app/Components/SearchBar';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type CartItem= {
  _id: string; // This is the MongoDB document ID in your cart collection
  userId: string;
  username: string;
  cakeId: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  quantity: number;
};

const Page = () => {
  const {cart, fetchCart}: { cart: CartItem[]; fetchCart: () => void } = useCart();  // function is already defined in the context provider, did this because we wanted cart to be shared across components
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const router = useRouter();

useEffect(()=>{
     fetchCart();
  },[]);
  
useEffect(()=>{
        //calculating total of cart items
        if (cart.length > 0) {
          const total = cart.reduce((acc, item)=> acc + (item.price) * item.quantity, 0);
          setTotal(total);
        } else{
          setTotal(0);
        }
    }, [cart]);

    const handleDelete = async (id: string) => {
          try {
            // Send a DELETE request to your API
            const res = await fetch(`/api/Cart?id=${id}`, {
              method: "DELETE",
            });

            if (!res.ok) toast.error("Failed to delete Cart Item");
            // Optionally, you can refetch the cakes or update state locally
            toast.success("Cart Item deleted successfully!");
            fetchCart(); // refress cart after deletion
          } catch (error) {
            toast.error("Error deleting CartItem:" + " " + error);
          }
  };       
    const PlaceOrder = async ()=>{
       router.push("/CheckOut");
  }
  return (
    <div className='flex'>
      <SearchBar search={search} setSearch={setSearch}/>
        <div className=' relative mt-35 md:flex bg-gray-300 p-2 gap-3 shadow-2xl h-full md:h-screen w-full'>
              <div className={cart.length !== 0 ? 'grid grid-cols-2 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 gap-2 h-s p-2 border-1 border-gray-400 h-full bg-amber-600 w-full md:w-[80%] ' : "flex h-[70%] justify-center items-center md:w-[80%] w-full "}>
              {cart.length === 0 ? 
              (<div className='flex bg-blue-200 w-[500px] h-[300px] rounded-[5px] justify-center items-center'>
                  <p className='text-center font-extrabold text-white text-2xl'>No cakes yet 🥲</p>
                </div>) : (cart.map((cake, i) => (
                <div key={i}
                      className=" h-[280px] md:h-[339px] w-[144px] md:w-[244px] rounded-[2px] overflow-hidden shadow-lg ">
                    <div className="h-[140px] md:h-[173px] w-[144px] md:w-[244px] relative">
                      <Image
                        className=" object-cover"
                        src={cake.imageUrl}
                        alt={cake.name}
                        sizes="200px"
                        fill
                      />             
                    </div>
                    <div className=" relative  text-center flex flex-col  bg-white">
                      <div className=' '>
                        <p className="font-bold text-purple-700 md:text-lg">{cake.name}</p>
                        <p className="text-sm text-gray-600">{cake.quantity}</p>
                        <p className="font-semibold text-black">Ksh {cake.price}</p>
                      </div>
                      
                      <div className=' md:py-2  py-2 '>
                        <button onClick={()=>handleDelete(cake._id)} className="md:mt-2 border-2 border-orange-500 hover:bg-red-700 hover:text-white text-black transition-all duration-150 bg-transparent md:px-7 md:py-1 px-4 rounded-[3px]">
                            Remove-item
                        </button>
                        <button className="md:mt-2 mt-1 bg-orange-500 hover:bg-green-600 transition-all duration-150 text-white px-7 md:px-10 md:py-1 rounded-[3px]">
                            Check Out
                        </button>         
                      </div>
                    
                    </div>
                </div>
              )))}
            </div>
          <div className='flex flex-col md:h-[160px] w-full md:w-[220px] sticky shadow-2xl bg-white rounded-[4px]'>
              <div className='border-b-1 border-gray-400 py-2 text-center font-bold'><h1>CART SUMMARY</h1></div>
              <div className='border-b-1 border-gray-400 md:pb-10 pb-3 flex justify-between px-2'><p>Subtotal</p> <p className='text-[18px] font-bold'>Ksh {total} </p></div>
              <div className='flex justify-center items-center py-1 '><button onClick={PlaceOrder} className='bg-orange-500 hover:bg-orange-400 rounded-[3px] md:p-2 p-1 flex justify-center items-center text-white font-bold w-[95%]'>Checkout (Ksh {total} )</button></div>
          </div>
        </div>
    </div>
  )
}

export default Page
