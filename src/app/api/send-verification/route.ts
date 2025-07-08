import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectdb from '@/app/lib/database';
import VerificationCode from '@/app/lib/modals/VerificationCode';


export const GET = async () => {
  return NextResponse.json(
    { error: "Use POST with { email: 'your@email.com' }" },
    { status: 200 }
  );
};
export const POST = async(request: Request)=>{
     const { email } = await request.json();
      await connectdb();

        // Delete any existing code first to prevent unique conflicts
     const code = Math.floor(10000 + Math.random() * 90000).toString();
     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

     
await VerificationCode.findOneAndUpdate(
    { email },
    { code, expiresAt },
    { upsert: true }
  );

     try{
         const transporter = nodemailer.createTransport({
             host: 'smtp.gmail.com',
             port: 465,
             secure: true,
             service: 'gmail', // or your SMTP provider
             auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Cake App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `Your verification code is: <strong>${code}</strong>`,
    });

  return NextResponse.json({ 
      success: true,
      code: code // Remove in production!
    });
     } catch(error:unknown){
        if (error instanceof Error) {
           return new NextResponse("Failed to send email" + error.message, {status:500})
       }
     }
}