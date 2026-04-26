import nodemailer from "nodemailer";
import env from "../config/env.js";

export const sendEmail = (from, to, subject, html) => {
     // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL,
        pass: env.PASSWORD_APP_EMAIL,
      },
    });

    // Email configuration
    const mailOptions = {
      name: "Farmer Trading System",
      from: from,
      to: to,
      subject: subject,
      html: html
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Email sent");
    });
}  
