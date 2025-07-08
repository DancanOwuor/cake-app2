import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📦 Callback received:", body);

    // You can handle success/failure here.
    // Save the transaction to your DB, check status codes, etc.

    return NextResponse.json({ message: "Callback received successfully" });
  } catch (error) {
    console.error("❌ Error handling callback:", error);
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 });
  }
}
