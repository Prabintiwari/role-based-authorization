import fs from "fs";
import path from "path";

const fileUpload = (file: Express.Multer.File, subDirectory?: string) => {
  try {
    const uploadFolder = `uploads/${subDirectory ? subDirectory + "/" : ""}`;

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.originalname}`;

    const filePath = path.join(uploadFolder, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const finalPath = `${uploadFolder}${fileName}`;
    console.log(finalPath);

    return finalPath;
  } catch (error) {
    console.error(error);
    throw new Error("File Upload Failed!");
  }
};

const deleteFile = async (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("delete file error:", error);
    throw new Error("File Upload Failed!");
  }
};
export { fileUpload,deleteFile };
