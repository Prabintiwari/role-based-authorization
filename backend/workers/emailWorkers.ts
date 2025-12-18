import { Worker } from "bullmq";
import { transporter } from "../utils/emailServices";
import registration_otp_template from "../templetes/registration_otp";
import redisInstance from "./redisConnection";

const emailWorker = new Worker(
  "email",
  async (job) => {
    console.log(`Processing email job ${job.id}`);

    const { email, otp, name } = job.data;

    try {
      await transporter.sendMail({
        from: `"Product team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your registration OTP",
        text: "Here is your registration OTP",
        html: registration_otp_template(otp, name),
      });
      console.log(`Email sent successfully to ${email}`);
      return { success: true, email };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  },
  {
    connection: redisInstance,
    lockDuration: 600000,
    maxStalledCount: 1,
    stalledInterval: 30000,
    concurrency: 1,
    autorun: true,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error: ${err.message}`);
});

export default emailWorker;
