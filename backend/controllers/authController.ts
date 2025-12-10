import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { generateToken } from "../middleware/auth";
import Password_Reset_OTP from "../templetes/forgot_password_otp";
import registration_otp_template from "../templetes/registration_otp";
import welcomeEmail from "../templetes/WelcomeEmail";
import transporter from "../utils/emailServices";
import generateOTP from "../utils/generate_opt";
import prisma from "../utils/Prisma";

//User register
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    let tempuser;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next({
        status: 400,
        success: false,
        message: "User already exist!!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    const otp = generateOTP();

    const existinguser = await prisma.tempUser.findFirst({
      where: { email: email },
    });
    if (existinguser) {
      tempuser = await prisma.tempUser.update({
        where: { email: email },
        data: { otp: otp, expiry: date },
      });
    } else {
      tempuser = await prisma.tempUser.create({
        data: { email, name, password: hashedPassword, otp: otp, expiry: date },
      });
    }
    next({
      status: 200,
      success: true,
      message: `otp sends successfully to ${email}`,
      
    });
    await transporter.sendMail({
      from: `"Role-based-authorization Team" <${process.env.SMTP_USER}>`,
      to: `${email}`,
      subject: "Your registration OTP!",
      text: "Here is your registration OTP!",
      html: registration_otp_template(otp, name),
    });
  } catch (error) {
    console.error(error);
    next({ status: 500, success: false, message: "internal server error" });
  }
};

// verify otp and register
const verifyRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next({
        status: 400,
        success: false,
        message: "Email and otp is required!",
      });
    }
    // Check if user exists
    const existingTempUser = await prisma.tempUser.findUnique({
      where: { email },
    });
    if (!existingTempUser) {
      return next({
        status: 400,
        success: false,
        message: "Email not found! Please register first",
      });
    }
    const date = new Date();
    if (otp !== existingTempUser.otp) {
      next({ status: 401, success: false, message: "invalid OTP!!" });
      return;
    }
    if (date > existingTempUser.expiry) {
      next({
        status: 400,
        success: false,
        message: "OTP has expired please send again!!",
      });

      return;
    }
    // Create user
    const user = await prisma.user.create({
      data: {
        email: existingTempUser.email,
        name: existingTempUser.name,
        password: existingTempUser.password,
      },
    });
    await prisma.tempUser.delete({ where: { email: existingTempUser.email } });

    // Generate token
    const token = generateToken(user);
    await transporter.sendMail({
      from: `"Role-based-authorization Team" <${process.env.SMTP_USER}>`,
      to: `${email}`,
      subject: "Welcome to our community!",
      text: "Welcome to our community!",
      html: `${welcomeEmail(user.name)}`,
    });
    next({
      status: 200,
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error(error);
    next({
      status: 500,
      success: false,
      message: "internal server error",
    });
  }
};

// resend otp
const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    let tempUser;
    if (!email) {
      return next({
        status: 400,
        success: false,
        message: "Email is required!",
      });
    }
    const existingTempUser = await prisma.tempUser.findUnique({
      where: { email: email },
    });
    if (!existingTempUser) {
      return next({
        status: 400,
        success: false,
        message: "Email not found! Please register first",
      });
    }
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    const otp = generateOTP();
    if (existingTempUser) {
      tempUser = await prisma.tempUser.update({
        where: { email: email },
        data: { otp: otp, expiry: date },
      });
    }
    next({
      status: 200,
      success: true,
      message: `otp sends successfully to ${email}`,
      data: { expiry: tempUser?.expiry },
    });

    await transporter.sendMail({
      from: `"Role-based-authorization Team" <${process.env.SMTP_USER}>`,
      to: `${email}`,
      subject: "Your registration OTP!",
      text: "Here is your registration OTP!",
      html: registration_otp_template(otp, existingTempUser.name),
    });
  } catch (error) {
    console.error(error);
    next({
      status: 500,
      success: false,
      message: "internal server error",
    });
  }
};

//User login
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "internal Server error" });
  }
};

// forgot password
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next({
        status: 400,
        success: false,
        message: "Email is required!",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      return next({
        status: 400,
        success: false,
        message: "User not  found!",
      });
    }
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    const otp = generateOTP();

    const tempUser = await prisma.tempUser.findUnique({
      where: { email: email },
    });
    if (tempUser) {
      await prisma.tempUser.update({
        where: { email: email },
        data: { otp: otp, expiry: date },
      });
    } else {
      await prisma.tempUser.create({
        data: {
          name: existingUser.name,
          email: existingUser.email,
          password: existingUser.password,
          otp: otp,
          expiry: date,
        },
      });
    }
    next({
      status: 400,
      success: true,
      message: `otp sends successfully to ${email}`,
      data: { expiry: tempUser?.expiry },
    });
    await transporter.sendMail({
      from: `"Role-based-authorization Team" <${process.env.SMTP_USER}>`,
      to: `${email}`,
      subject: "Your reset password OTP!",
      text: "Here is your reset password OTP!",
      html: Password_Reset_OTP(otp, existingUser.name),
    });
  } catch (error) {
    console.error(error);
    next({
      status: 500,
      success: false,
      message: "internal server error",
    });
  }
};

// verify otp
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next({
        status: 500,
        success: false,
        message: "internal server error",
      });
      res.status(400).json({
        success: false,
        message: "Email and otp is required!",
      });
    }
    // Check if user exists
    const existingTempUser = await prisma.tempUser.findUnique({
      where: { email },
    });
    if (!existingTempUser) {
      return next({
        status: 400,
        success: false,
        message: "Email not found!",
      });
    }
    const date = new Date();
    if (otp !== existingTempUser.otp) {
      next({
        status: 401,
        success: false,
        message: "invalid OTP!!",
      });

      return;
    }
    if (date > existingTempUser.expiry) {
      next({
        status: 400,
        success: false,
        message: "OTP has expired please send again!!",
      });

      return;
    }
    await prisma.tempUser.delete({ where: { email: existingTempUser.email } });
    next({
      status: 200,
      success: true,
      message: "OTP verified successfully!",
      data: {
        email: existingTempUser.email,
        verified: true,
      },
    });
  } catch (error) {
    console.error(error);
    next({
      status: 500,
      success: false,
      message: "internal server error",
    });
  }
};
// reset password
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return next({
        status: 400,
        success: false,
        message: "Email and newPassword is required!",
      });
    }
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      next({
        status: 400,
        success: false,
        message: "User doesnt exist",
      });

      return;
    }
    const PasswordMatch = await bcrypt.compare(newPassword, user.password);
    if (PasswordMatch) {
      next({
        status: 401,
        success: false,
        message: "new password cannot be same as previous!!",
      });

      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
    next({
      status: 200,
      success: true,
      message: "Password reset successfully!",
      data: { updatedUser },
    });
  } catch (error) {
    console.error(error);
    next({
      status: 401,
      success: false,
      message: "internal server error!!",
    });
  }
};

export {
  forgotPassword,
  login,
  register,
  resendOtp,
  resetPassword,
  verifyOtp,
  verifyRegistration,
};
