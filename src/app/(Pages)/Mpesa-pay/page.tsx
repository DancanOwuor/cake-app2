"use client";
import { useState } from "react";
import { toast } from "sonner";


export default function PaymentForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(100);
  const [status, setStatus] = useState("");

  const handlePay = async () => {
    setStatus("Processing...");

    const res = await fetch("/api/Mpesa/oauth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ phoneNumber, amount }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Payment request sent to phone!");
    } else {
      toast.error(`Error: ${data.error}`)
      setStatus(`Error: ${data.error}`);
    }
  };

  return (
  <div className="bg-gray-200 flex justify-center mt-20 md:items-center h-screen">
    <div className="space-y-4 p-4 w-[300px] mt-5 md:mt-0 shadow-2xl rounded-[5px] bg-white h-[50%]">
      <h1 className="text-bold text-green-400 text-3xl text-center">Mpesa</h1>
      <input
        type="tel"
        placeholder="Enter Safaricom number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 rounded w-full"
      />
      <button onClick={handlePay} className="bg-green-500 text-white p-2 rounded">
        Pay Now
      </button>
      {status && <p>{status}</p>}
    </div>
  </div>
  );
}
