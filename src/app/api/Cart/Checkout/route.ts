import { NextResponse } from "next/server";
import Order from "@/app/lib/modals/Order";
import Cart from "@/app/lib/modals/Cart";
import User from "@/app/lib/modals/users";
import connectdb from "@/app/lib/database";
import nodemailer from 'nodemailer';

export const POST = async(request:Request) => {
    const ticket = Math.floor(1000 + Math.random() * 9000);
    
     try{
           
        const {cart, Itemtotal, Email, Name} = await request.json(); // we are getting the email from the body so that we can send an email to the user who checkedout
                if (!cart) {
                    return NextResponse.json({ message: 'Invalid checkout' }, { status: 400 });
                }
                 if (!Name) {
                    return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }
            await connectdb()
            const createdOrder = await Order.create({items:cart, Itemtotal });

            if(createdOrder){
                    const getUser = await User.findOne({username:Name});
                    if (!getUser) {
                        return NextResponse.json({error:'User not found'})
                        }
                    const ID = getUser._id; // getting the user id associated with a particular username
                    if (!ID) {
                        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
                    }
                    await Cart.deleteMany({userId:ID}); //deleting all cart items that were associated with the user who checked out
            }

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
            to: Email,
            subject: 'Order PlaceMent',
            html: `Your Order has been successfully placed. Order ticket is: <strong>${ticket}</strong>`,
            
        });

        return new NextResponse(JSON.stringify({
                    message: "Order is Successfully created",
                    user: createdOrder
            }), {status:200});

     } catch(error:unknown){
         if (error instanceof Error) {
            return new NextResponse("Error Placing Order " + error.message, {
                        status:500,
                    })
            }
     }
   
}