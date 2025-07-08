"use client";
import React, {useEffect}from 'react'
import { useCart } from '@/app/context/CartContext'
import Image from 'next/image';
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
    const router = useRouter();
    const {cart, fetchCart}: { cart: CartItem[]; fetchCart: () => void } = useCart();  // function is already defined in the context provider, did this because we wanted cart to be shared across components
    const total = cart.reduce((acc, item)=> acc + (item.price) * item.quantity, 0)
    const tax = cart.length > 0 ? 0.03 : 0.044
    const deliveryfees = total * tax
    const itemTotal = deliveryfees + total;
    
    useEffect(()=>{
         fetchCart();
      }, []);

const handleCheckout = async ()=>{
      const storedUser = localStorage.getItem("Userdata");
       if (storedUser) {
          const Userinfo = JSON.parse(storedUser);// converts the storedUser into valid JSON
          const Email = Userinfo.email
          console.log(Userinfo)
          const Name = Userinfo.username;
          console.log(Name)
           if (!Email) {
              toast.error("User not authenticated.");
                return;
        }

      try{
        const res = await fetch('/api/Cart/Checkout', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({cart, itemTotal, Email, Name })
        });

         if (res.ok) {
            toast.success('Checked out successfully!');
            router.push('/Mpesa-pay')
          fetchCart(); // refresh the cart afterwards
      } else {
         toast.error('Checkout failed');
      }
      }catch(error:unknown){
         if (error instanceof Error) {
         toast.error('Error during checkout:' + " " + error);
         }
      }
    }
  }
  return (
    <div className=' flex flex-col md:flex gap-5 h-full mt-20 bg-gray-100 px-10  w-screen'>
        <div className='flex flex-col px-2 py-3 gap-3 md:w-[73%]'>
            <div className='flex flex-col shadow-2xl bg-white rounded-[4px]'>
                <div className='border-b-1 border-gray-300'>
                    <h1 className='font-bold px-2 py-1'>CUSTOMER ADDRESS</h1>
                </div>
                <div className=' py-6 px-2'>
                    <h1>{cart.length > 0 ? cart[0].username:"No item added to cart"}</h1>
                </div>
            </div>

            <div className='shadow-2xl flex flex-col gap- bg-white p-3 rounded-[5px] gap-4'>
                
                    <h1 className='font-bold'> 2. DELIVERY DETAILS</h1>
                
                    <div className='flex flex-col '>
                        <h1>Pick-up Station</h1>
                        <p>Delivery between 09 june</p>
                        <div className=' border-1 border-gray-300 flex flex-col rounded-[4px]'>
                            <div className='border-b-1 px-2 border-gray-300'>Pickup Station</div>
                            <div className='p-2'>
                                <h1 className='font-bold'>Kloss Mathare Station</h1>
                                <p>Location details</p>
                            </div>
                        </div>
                    </div>
                    <h1 className='font-bold'>Shipment 1/1</h1>
                    <div className='flex flex-col border-1 border-gray-300 rounded-[4px] '>
                        <div className='border-b-1 border-gray-300 px-2 '>
                             <h1 className='font-bold'>Pick-up Station</h1>
                             <p>Delivery between</p>
                        </div>
                        {cart.map((item, i)=>(
                            <div key={i} className={cart.length > 0 ? "border-b-1 border-gray-300 flex justify-between p-2":' min-h-[70px]  flex justify-between p-2'}>
                                    <div className='relative h-[50px] w-[60px] p-2 flex '>
                                        <Image
                                        src={item.imageUrl}
                                        fill
                                        sizes='45'
                                        alt='product'/>
                                    </div>
                                    <div className=' w-[95%] px-2'>
                                        <h1 className='font-bold'>{item.name}</h1>
                                    </div>
                            </div>
                            ))}    
                    </div>
            </div>

            <div className='flex flex-col shadow-2xl border-1 border-gray-200 rounded-[4px] bg-white'>
                <div className='p-2 border-b-1 border-gray-200'>PAYMENT METHOD</div>
                <div className='px-2 py-6'>
                    <h1>Pay on delivery with Mobile Money and Bank cards</h1>
                </div>
            </div>
            <button className='bg-orange-500 hover:bg-orange-400 font-extrabold text-white w-[200px] p-2 rounded-[2px]'>Modify Cart</button>

        </div>

        <div className='flex flex-col w-[280px] h-[290px] bg-white shadow-2xl rounded-[4px] mt-3'>
            <div className='px-3 py-1 border-b-1 border-b-gray-300'>
                <h1 className='font-bold'>Order summary</h1>
            </div>
            <div className='flex flex-col border-b-1 border-b-gray-300 font-bold'>
                <div className='px-2 py-3 flex  justify-between '>
                    <p>Item &apos; s total</p>
                    <p >Ksh {total}</p>
                </div>
                <div className=' px-2 flex justify-between'> 
                    <p>Delivery fees</p>
                    <p>Ksh {deliveryfees}</p>
                </div>
            </div>
            <div className='border-b-1 border-b-gray-300 flex justify-between px-2 py-3'>
                <p>Total</p>
                <p>Ksh {itemTotal}</p>
            </div>
            <div className='border-b-1 border-b-gray-300 py-4 px-2 flex items-center gap-4'>
               <input type="text" placeholder='Enter code' className='border-1 border-gray-500 rounded-[4px] w-[190px] p-3'/>
               <p>APPLY</p>
            </div>
            <div className='flex justify-center items-center h-[80px]'>
                <button onClick={handleCheckout} className='bg-orange-500 rounded-[4px] w-[250px] h-[35px] text-white font-bold hover:bg-orange-400'>
                    Confirm Order
                </button>
            </div>
        </div>
    </div>
  )
}
export default Page