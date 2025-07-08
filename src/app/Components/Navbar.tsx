"use client";
import React from 'react'
import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import { IoNotifications } from 'react-icons/io5'
import { BiCategory, BiHome } from 'react-icons/bi'
import { FcAbout } from 'react-icons/fc';
import Image from 'next/image'
import { useCart } from '../context/CartContext';
import { BiMenu } from 'react-icons/bi';
import { useState } from 'react';


const Navbar = () => {
  const {cart} = useCart();
  const [menu, setMenu] = useState(false)
  
  const handleMenu = ()=>{
    setMenu(!menu)
  }
  return (
    <div className='flex justify-between items-center px-5 bg-pink-400 h-[74px] w-full fixed top-0 z-200'>
        <div>
          <p className='text-pink-600 md:flex font-extrabold text-3xl hidden'>CakeMania</p>
        </div>
        <div className=''>
            <nav>
            <ul className='flex gap-6 font-bold text-black text-[18px]'>
                <Link className='hover:text-white transition-all duration-200 md:flex items-center justify-baseline gap-1 hidden' href='/home'><BiHome size={20}/>Home</Link>
                <Link className='hover:text-white transition-all duration-200 md:flex items-center justify-baseline gap-1 hidden' href="/About"><FcAbout size={20}/>About</Link>
                <Link className='hover:text-white transition-all duration-200 md:flex items-center justify-baseline gap-1 hidden' href='/Categories'><BiCategory size={20}/>Categories</Link>
                <Link className='hover:text-white transition-all duration-200 md:flex items-center justify-baseline gap-1 hidden' href='/BestSellers'>Best Sellers</Link>
                <div className='relative'>
                    <Link className='hover:text-white transition-all duration-200 md:flex items-center justify-baseline gap-1 ml-2 hidden' href='/cart'><FaShoppingCart size={20}/>Cart
                     {cart.length > 0 && (
                        <span className="absolute -top-2 left-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cart.length}
                        </span>
                     )}
                     </Link>
                </div>
                <Link className='hover:text-white transition-all duration-200 md:flex items-center justify-baseline gap-1 hidden' href='/notifications1'><IoNotifications size={20}/>Notifications</Link>
                <Link className='hover:text-white transition-all duration-200 md:flex items-center justify-baseline gap-1 hidden' href='/Facebook'><IoNotifications size={20}/>Facebook</Link>

            </ul>
        </nav>
        </div>
        <div className='relative flex gap-4  w-[250px]'>
            <button className=' md:flex rounded-[36px] bg-black p-2 h-[40px] w-[110px] text-white justify-center items-center hover:z-100 hover:bg-gray-200 hover:text-black transition-all duration-300 hidden'><Link href='/login'>Login</Link></button>
            <button className='absolute left-[78px] md:flex rounded-3xl bg-green-500 p-4 h-[40px] w-[100px] text-white justify-center items-center hover:bg-green-400 transition-all duration-200 hidden'><Link href="/Register"> Sign Up</Link></button>
        </div>

      <div className='flex'>
        <Image className='md:flex rounded-full hidden'
        src="/shop logo.jpg"
        width={50}
        height={50}
        alt="Bakery"/>

        <BiMenu onClick={handleMenu} size={32} className='relative md:hidden'/>
          <div className={menu? "absolute top-[50px] right-[5px] h-fit z-50 flex bg:hover:text-orange w-[150px] text-white rounded-[3px] md:hidden ":'hidden'}>
            <ul className='bg-blue-500 p-2 w-full flex flex-col gap-2'>
              <li className='hover:text-orange'><Link href='/home'>Home</Link></li>
              <li className='hover:text-orange'><Link href='/About'>About</Link></li>
              <li className='hover:text-orange'><Link href='/Categories'>Categories</Link></li>
              <li className='hover:text-orange'><Link href='/BestSellers'>Best</Link></li>
              <li className='relative hover:text-orange'><Link href='/cart'>Cart
               </Link>{cart.length > 0 && (
                        <span className="absolute -top-2 left-5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cart.length}
                        </span>
                     )}
              </li>
              <li className='hover:text-orange'><Link href='/notifications1'>Notifications</Link></li>
              <li className='relative hover:text-orange'><Link href='/login'>Login</Link></li>
              <li className='relative hover:text-orange'><Link href='/Register'>SignUp</Link></li>
              <li className='relative hover:text-orange'><Link href='/Admin/HandleCake'>Cake upload</Link></li>
            </ul>
          </div>
      </div>
    </div>
  )
}

export default Navbar
