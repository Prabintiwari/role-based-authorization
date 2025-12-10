import { Request, Response, NextFunction } from "express";

const responseHandler = (
  response: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!response.success) {
      if (response.status > 499) throw new Error(response.message);
      res
        .status(response.status)
        .json({ success: false, message: response.message });
    }
    res
      .status(response.status || 200)
      .json({ success: true, data: response.data, message: response.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: response.message });
  }
};
export default responseHandler;
