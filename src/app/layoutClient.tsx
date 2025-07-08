"use client"

//import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./Components/Navbar";
import { Toaster } from "@/components/ui/sonner"; //A Shadcn Component
import { usePathname } from "next/navigation";
import "./globals.css";

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export default function LayoutClient({children,}: Readonly<{children: React.ReactNode;}>) {
  const pathname = usePathname();
  const hideNavOn = ['/Facebook'];
  const showNavOn = !hideNavOn.includes(pathname);
  return (
    <>
       {showNavOn &&<Navbar/>}
          {children}
          <Toaster className="bg-orange-400"/> {/* this is a shadcn componenent for the sonner component */}
    </>    
  );
}