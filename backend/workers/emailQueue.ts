import { Queue } from "bullmq";
import redisInstance from "./redisConnection";



export const emailQueue = new Queue("email", { connection:redisInstance });