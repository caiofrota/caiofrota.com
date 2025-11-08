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
      from: `Website <website@caiofrota.com>`,
      replyTo: `${name} <${email}>`,
      to: process.env.SMTP_MAIL_TO,
      subject: `Uma nova mensagem de: ${name}`,
      text: message,
      html: `<p>${message}</p><p>De: ${name} (${email})</p>`,
    });
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}
