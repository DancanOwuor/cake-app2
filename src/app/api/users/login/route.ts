import { NextResponse } from 'next/server';
import User from "@/app/lib/modals/users"
import connectdb from "@/app/lib/database"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!;

export const POST = async (request: Request) =>{

    try{
        const { username, email, password, role } = await request.json();
           if (!username || !email || !password ||!role) {
                return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
        await connectdb();
        const user = await User.findOne({ email });
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);  //compares the password supplied from the request to the one stored in the database of the found user

        if(!passwordMatch){
            return NextResponse.json({ error: 'Invalid Credentials'}, {status:401})
        }
 
        const token = jwt.sign({userId: user._id}, JWT_SECRET,{expiresIn: "7d"})
            return NextResponse.json(
                { message:'Login successful', 
                  token,
                  user: { 
                        email: user.email, 
                        username: user.username, 
                        role: user.role 
                    }
                },
                {
                  status:200,
                  headers: {
                     "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
                    }
                }
            )

    } catch(error: unknown){
           if (error instanceof Error) {
                console.error('Login error:', error);
               }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }


}