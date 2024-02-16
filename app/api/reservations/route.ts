import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { mailOptions, transporter } from "../email/nodemailer";
import useCountries from "@/app/hooks/useCountries";
import { format } from "date-fns";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const { getByValue } = useCountries();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });
  const listing = await prisma.listing.findFirst({
    where: {
      id: listingId,
    },
  });
  const location = getByValue(listing?.locationValue ?? "");
  const startDateOnly= new Date(startDate)
  const endDateOnly = new Date(endDate)
  try {
    await transporter.sendMail({
      ...mailOptions,
      to: currentUser.email,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              font-size: 28px;
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
          <body>
              <div class="container">
                  <h3 class="header">Thank You !!</h3>
                  <div class="content">
                  <p align="justify">We are thrilled to inform you that 
                  your hotel reservation has been successfully 
                  confirmed! Thank you for choosing
                   Hotel Rentals for your upcoming stay.
                  <p align="justify">Please find below your booking details:</p>
                  <p align="justify">Guest Name: ${currentUser.name} </p>
                  <p align="justify">Where: ${location?.region} , ${location?.label} </p>
                  <p align="justify">When: ${format(startDateOnly, "PP")} - ${format(endDateOnly, "PP")} </p>
                  <p align="justify">Total cost: $${totalPrice} 
                  <h3>Happy Journey, Have a great trip ahead!!</h3>
                  </div>
                  <small class="footer">By Pushti <br>pushti.ratanghayra@gmail.com</small>
              </div>
          </body>
      </head>
      <body>
          
      </body>
      </html>`,
      subject: `Thank you for the booking ${currentUser.name}`,
    });
  } catch (err) {
    console.log(err);
  }

  return NextResponse.json(listingAndReservation);
}
