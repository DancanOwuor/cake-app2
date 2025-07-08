import { NextResponse } from "next/server";
import { getMpesaToken } from "../../../../../utils/mpesaToken";

export const GET = async()=>{
   try {
    const token = await getMpesaToken();
    return NextResponse.json({ access_token: token });
  } catch (error: unknown) {
     if (error instanceof Error) {
    console.error("GET Token Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
     }
  }
}


export const POST = async (request:Request)=>{
  try{
      const {phoneNumber, amount} = await request.json();
      let normalizedPhone = phoneNumber.trim();

      if (normalizedPhone.startsWith("0")) {
        normalizedPhone = "254" + normalizedPhone.substring(1);
      } else if (normalizedPhone.startsWith("+")) {
        normalizedPhone = normalizedPhone.replace("+", "");
      }

      // Check final format
      if (!/^2547\d{8}$/.test(normalizedPhone)) {
        return NextResponse.json({ error: "Bad Request - Invalid PhoneNumber" }, { status: 400 });
      }

        if (!phoneNumber || !amount) {
          return NextResponse.json({ error: "Phone number and amount required" }, { status: 400 });
        }


        const shortcode = "174379";
        const passkey = process.env.MPESA_PASSKEY!;       
        const access_token = await getMpesaToken();
        console.log("Access Token:", access_token);
        console.log("using passkey", passkey)


        // 2. Generate Timestamp
        const timestamp = new Date()
          .toISOString()
          .replace(/[-T:.Z]/g, '')
          .substring(0, 14); // Format: 
          
        console.log("Raw string for password:", shortcode + passkey + timestamp);
        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');
        console.log("Timestamp:", timestamp);
        console.log("Password (base64):", password);

        const stkPushBody = {
          BusinessShortCode: shortcode,  // sandbox Paybill number
          Password: password, // base64 encoded password for stk push
          Timestamp: timestamp,  // timestamp in YYYYMMDDHHMMSS format
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: "254708374149",          // customer phone number
          PartyB: shortcode,             // Paybill number
          PhoneNumber: normalizedPhone, //"0702160026",
          CallBackURL: 'https://14ee-102-135-174-111.ngrok-free.app/api/Mpesa/callback',
          AccountReference: 'CakeOrder123',
          TransactionDesc: 'Payment for cake',
        }
        console.log("→ Shortcode:", shortcode);
        console.log("→ Consumer Key:", process.env.MPESA_CONSUMER_KEY);
        console.log("→ Consumer Secret:", process.env.MPESA_CONSUMER_SECRET?.slice(0, 4) + "…");
        console.log("→ Password:", password);


        const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stkPushBody),

        });
        const data = await response.json();

        if (!response.ok) {
           console.error("Safaricom STK Error Response:", data);
          return NextResponse.json({ error: data.errorMessage || 'Failed to initiate payment' }, { status: response.status });
        }
        console.log("Access Token:", access_token);
        return NextResponse.json(data);

  }catch(error:unknown){
     if (error instanceof Error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
     }
  }
}