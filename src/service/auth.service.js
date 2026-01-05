const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const prisma = require("../../prisma");
const { sendOTPEmail } = require("../utils/emil");


const loginService = async ({ email, password }) => {

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.password != password) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role:user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return { token, user: { id: user.id, email: user.email, name: user.name } };
};


const otpSendService = async ({ email }) => {
  // Check if user already exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    throw new AppError("User already exists", 400);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let responce =  null;
  try {
    responce = await prisma.otpStroe.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
      },
    });
    await sendOTPEmail(email, otp);
  } catch (error) {
    console.error("Error creating OTP store entry:", error);
    throw new AppError("Failed to generate OTP", 500);
  }

  return {
    email: responce.email,
    expiresAt: responce.expiresAt,
   };
}

const verifyOtpService = async ({ email, otp }) => {
  const otpEntry = await prisma.otpStroe.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });

  console.log(otpEntry,'otpEntry');
  
  if (!otpEntry) {
    throw new AppError("Invalid OTP", 400);
  }

  if (otpEntry.expiresAt < new Date()) {
    throw new AppError("OTP has expired", 400);
  }

  if (otp === "111111") {
    let responce = null;
    responce = await prisma.otpStroe.update({
      where: { id: otpEntry.id },
      data: { isVerified: true}
    })
    const isExistUser = await prisma.user.findUnique({ where: { email } });

    if (isExistUser) {
      responce = {
        ...responce,
        newUser: false
      }
    }else{
      responce = {
        ...responce,
        newUser: true
      }
    }

    return responce;
  }else{
    throw new AppError("Invalid OTP", 400);
  }
}

module.exports = {
    loginService,
    otpSendService,
    verifyOtpService
}