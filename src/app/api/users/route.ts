import connectdb from "@/app/lib/database"
import User from "@/app/lib/modals/users"
import Cart from "@/app/lib/modals/Cart";
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";
import { Types } from 'mongoose';

export const GET = async()=>{
    try{
        await connectdb();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users))
    } catch(error:unknown){
         if (error instanceof Error) {
           return new NextResponse("Error in fetching users"+ error.message,{
            status: 500,
        })
      }    
    }
}

export const POST  = async (request: Request)=>{
    try{
      const { username, email, password, role } = await request.json();

         if (!username || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
      await connectdb();
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
      return NextResponse.json({ error: 'Email or username already exists' }, { status: 400 });
    }
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = new User({ username, email, password: hashedPassword,role });
      await createdUser.save()

      return new NextResponse(JSON.stringify({
        message: "User is Successfully created",
        user: createdUser
      }), {status:200});
    } catch (error: unknown){
       if (error instanceof Error) {
        return new NextResponse("Error signing Up " + error.message, {
            status:500,
        })
       }
    }
}

export const DELETE = async(request:Request)=>{
  try{
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Extract ID from query params
    
            if (!id) {
                return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
            } 
            if (!Types.ObjectId.isValid(id)) {  //if id is not a valid mongodb object
                return NextResponse.json(
                    { error: "Invalid User ID format" },
                    { status: 400 }
                );
                }
        await connectdb();
        const deleted = await User.findByIdAndDelete(new Types.ObjectId(id));
        const deletedCart = await Cart.deleteMany({ userId: id }); // tells MongoDB to delete all cart items whose userId matches the deleted user.
         if(!deleted ){
            return new NextResponse(
                JSON.stringify({message: "User not found in the database"}),
                { status:400 }
            )
        }
        if(!deletedCart ){
            return new NextResponse(
                JSON.stringify({message: "No cart items for the deleted User wer found"}),
                { status:400 }
            )
        }
        return new NextResponse(
          JSON.stringify({message:"User is deleted", User: deleted, CartItems:deletedCart}),
          { status: 200 }
      );       
  } catch(error: unknown){
     if (error instanceof Error) {
        return new NextResponse("Error deleting User " + error.message, {
            status:500,
        })
       }
  }
}