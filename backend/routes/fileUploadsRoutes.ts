import express from "express";
import {uploadFile} from "../middleware/uploadFile";
import { upload } from "../utils/upload";
const router = express.Router();

router.post("/file-upload",upload.single("image") ,uploadFile)

export default router