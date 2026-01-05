const { loginService, otpSendService, verifyOtpService } = require("../service/auth.service");
const catchAsync = require("../utils/catchAsync");

const loginController = catchAsync(async (req, res) => {

  const responce = await loginService(req.body);
  res.status(200).json({ message: "Login successful", data: responce });
});




module.exports = {
  loginController,
};


