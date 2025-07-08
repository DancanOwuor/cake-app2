import { NextResponse } from "next/server";
import connectdb from "@/app/lib/database";
import Cart from "@/app/lib/modals/Cart";
import { Types } from 'mongoose';
import mongoose from "mongoose";


export const GET = async (request: Request)=> {

   try{
            const {searchParams} = new URL(request.url);
            const userId = searchParams.get("userId");

            if (!userId) 
                return NextResponse.json({ error: "Missing userId" }, { status: 400 });

            await connectdb();

            const cartItems = await Cart.find({userId});
        return NextResponse.json(cartItems);

        } catch(error:unknown){
         if (error instanceof Error) {
             return NextResponse.json({ error: "Error in fetching Cakes: " + error.message },
                { status: 500 })
            }
}
}

export const POST = async(request: Request)=>{
    try{
        const body = await request.json();
         console.log("Raw body received:", body);
        const { userId, username, cakeId, name, price, imageUrl, quantity } = body;
        
        if(!userId || !cakeId ||!username || !name || !price || !imageUrl)
            return NextResponse.json({error: "Missing required fields"}, {status:400})
        await connectdb();
        const exists = await Cart.findOne({userId, cakeId});

        if(exists){
            exists.quantity += 1;
            await exists.save();
            return NextResponse.json({message: "Cart updated", item:username}, { status: 200 })
        }
        console.log("Preparing to save Cart:", {
  userId,
  cakeId,
  username,
  name,
  price,
  imageUrl,
  quantity
});
        if(username){
            const createdCart = await Cart.create({ userId:new mongoose.Types.ObjectId(userId), cakeId:new mongoose.Types.ObjectId(cakeId), username, name, price, imageUrl, quantity:typeof quantity === "number" ? quantity : 1});
            console.log(createdCart)
            if(!createdCart){
                return NextResponse.json({error: "Could not create cart"})
            }
        }
    return NextResponse.json({message: "Added to Cart", item:username}, { status: 200 });

    } catch(error: unknown){
         if (error instanceof Error) {
              return NextResponse.json(
            { error: "Error in Adding Cart items: " + error.message },
            { status: 500 }
        );
         }  
    }
}

export const DELETE = async(request:Request)=>{
    try{
        const {searchParams} = new URL(request.url);
        const cakeId = searchParams.get("id");

         if (!cakeId) {
                        return NextResponse.json({ error: "Missing Cake ID" }, { status: 400 });
                    } 
                    if (!Types.ObjectId.isValid(cakeId)) {  //if id is not a valid mongodb object
                        return NextResponse.json(
                            { error: "Invalid User ID format" },
                            { status: 400 }
                        );
                        }
        await connectdb();
        const deleted = await Cart.findByIdAndDelete(new Types.ObjectId(cakeId));
                 if(!deleted){
                    return new NextResponse(
                        JSON.stringify({message: "Cake not found in the database"}),
                        { status:400 }
                    )
                }
                return new NextResponse(
                  JSON.stringify({message:"Cake is successfullu deleted", Cake: deleted}),
                  { status: 200 }
              );       
    } catch(error:unknown){
        if (error instanceof Error) {
                return new NextResponse("Error deleting User " + error.message, {
                    status:500,
                })
               }
    }
}