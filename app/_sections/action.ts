"use server";
import nodemailer from "nodemailer";

export async function sendEmail({ name, email, message }: { name: string; email: string; message: string }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <website@caiofrotasss.com>`,
      replyTo: email,
      to: process.env.SMTP_MAIL_TO,
      subject: `New message from ${name}`,
      text: message,
      html: `<p>${message}</p><p>From: ${name} (${email})</p>`,
    });
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}
