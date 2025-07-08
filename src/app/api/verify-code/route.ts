import { NextResponse } from 'next/server';
import VerificationCode from '@/app/lib/modals/VerificationCode';
import connectdb from '@/app/lib/database';

export async function POST(request: Request) {
  try{
    const { email, code } = await request.json();
  await connectdb();

  const validCode = await VerificationCode.findOneAndDelete({
    email,
    code,
    expiresAt: { $gt: new Date() },
  });

  if (!validCode){
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 401 }
    );
  }
  return NextResponse.json({ success: true }, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } // Explicit header
    });
  } catch(error:unknown){
       if (error instanceof Error) {
            console.error('Verification error:', error);
       }
    return NextResponse.json(
      { error: 'Verification failed' },
      { 
         status: 500,
         headers: { 'Content-Type': 'application/json' }
       }
    );
  }

}