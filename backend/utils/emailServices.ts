import nodemailer from "nodemailer";
import { emailQueue } from "../workers/emailQueue";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const queueEmail = async (email: string, otp: number, name: string) => {
  await emailQueue.add("send-email", {
    email,
    otp,
    name,
  });

  console.log("Email queued successfully");
};
export { transporter, queueEmail };
