import Cake from '@/app/lib/modals/CakeCategoriest'
import { NextResponse } from "next/server"
import connectdb from "@/app/lib/database"
import { Types } from 'mongoose';

interface D_Cake extends Document {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export const GET = async()=>{
    try{
        await connectdb();
        const cakes = await Cake.find();
        return new NextResponse(JSON.stringify(cakes))
    } catch(error:unknown){
        if (error instanceof Error) {
            return new NextResponse("Error in fetching Cakes"+ error.message,{
            status: 500,
        })
        }
    }
}

export const DELETE = async (request: Request)=>{
    try{
            const body = await request.json();
            const {cakeId} = body; // Extract ID from query params

            if (!cakeId) {
                return NextResponse.json({ error: "Missing cake ID" }, { status: 400 });
            } 
            if (!Types.ObjectId.isValid(cakeId)) {  //if id is not a valid mongodb object
                return NextResponse.json(
                    { error: "Invalid cake ID format" },
                    { status: 400 }
                );
                }        
            await connectdb();
            const deleted:D_Cake | null = await Cake.findByIdAndDelete(new Types.ObjectId(cakeId));
            if(!deleted){
                return new NextResponse(
                    JSON.stringify({message: "Cake not found in the database"}),
                    { status:400 }
                )
            }
    return new NextResponse(
        JSON.stringify({message:"Cake is deleted", Cake: deleted}),
        { status: 200 }
    );

        }catch(error:unknown){
        if (error instanceof Error) {
            return new NextResponse(" Error in Deleting Cake" + error.message, {
                status: 500,
            });
        }
        }
}

export const PATCH = async(request:Request)=>{
    try{
        const body = await request.json();
        const { id, ...updateFields } = body;
            if (!id || !Types.ObjectId.isValid(id)) {
                return NextResponse.json({ error: "Invalid or missing cake ID" }, { status: 400 });
            }
            await connectdb();
            const updated = await Cake.findByIdAndUpdate(id, updateFields, {new:true});

            if(!updated){
                console.error(body);
                return NextResponse.json({ error: "Cake not found" }, { status: 404 });
            }
         return NextResponse.json({ message: "Cake updated", data: updated }, { status: 200 });
    } catch(error:unknown){
         if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
         }
    }
}