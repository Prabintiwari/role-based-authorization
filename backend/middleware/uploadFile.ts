import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { fileUpload } from "../utils/fileServices";

const prisma = new PrismaClient();

const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (file) {
      const filePath = fileUpload(file);
      await prisma.fileUploads.create({ data: { file: filePath } });
    }
  } catch (error) {
    console.error("Upload file error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export { uploadFile };
