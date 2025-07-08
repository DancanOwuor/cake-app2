"use client";
import React, {useEffect, useState} from 'react'

const Page = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState<string | null>(null);;

  useEffect(() => {
    const getMpesaToken = async () => {
      try {
        const res = await fetch('/api/Mpesa/oauth');
        const data = await res.json();

        if (res.ok) {
          setToken(data.access_token);
        } else {
          setError(data.error || 'Failed to fetch token');
        }
      } catch (error:unknown) {
         if (error instanceof Error) {
        setError(error.message);
      }
      }
    };
     getMpesaToken();
  }, []);

  return (
    <div className="p-4 mt-40">
      <h2 className="text-xl font-semibold">M-Pesa Token</h2>
      {token ? (
        <p className="text-green-600">Token: {token}</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Page
