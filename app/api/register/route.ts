import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { mailOptions, transporter } from "@/app/api/email/nodemailer";

// import emailTempl 

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;
  const exists = await prisma.user.findFirst({
    where: { email },
  });
  if (exists) {
    return NextResponse.json(
      { error: "User already exists" },
      {
        status: 409,
        //User already exists status code
      }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });
  //Welcome Email to User
  try {
    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: `Welcome ${name}`,
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Email template</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
            }
      
            .container {
              max-width: 700px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
      
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
      
            .header h1 {
              color: #333;
              font-size: 28 px;
              margin: 0;
            }
      
            .content {
              margin-bottom: 30px;
            }
      
            .content p {
              margin: 0 0 10px;
              line-height: 1.5;
              font-size: 16px;
            }
      
            .footer {
              text-align: center;
            }
          </style>
        </head>
      
        <body>
          <div class="container">
            <h3 class="header">Welcome to House Rentals</h3>
            <div class="content">
              <p>Dear ${name},</p>
              <p align="justify">
                Warm greetings from House Rentals! We are delighted to extend a
                heartfelt welcome to you as our esteemed guest. Your reservation with
                us is not just a booking; it marks the beginning of a wonderful
                experience.
              </p>
              <p align="justify">
                Our team is dedicated to providing you with exceptional service, and
                we want to make sure your stay exceeds your expectations. Should you
                require any assistance or have questions about local attractions,
                dining recommendations, or any other inquiries,our concierge team is
                available around the clock to assist you.
              </p>
              <p align="justify">
                Thank you for choosing House Rentals. We look forward to serving you
                and making your stay truly special.
              </p>
            </div>
            <h3>Safe Travels, and we will see you soon !!</h3>
            <br />
      
            <small class="footer">By Pushti <br />pushti.ratanghayra@gmail.com</small>
          </div>
        </body>
      </html>
      `,
    });
  } catch (err) {
    console.log(err);
  }

  return NextResponse.json(user);
}
