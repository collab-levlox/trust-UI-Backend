const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().required(),
});

const otpSendSchema = Joi.object({
  email: Joi.string().email().required(),
});



module.exports = {
  authValidator: {
    login: loginSchema,
    verifyOtp: verifyOtpSchema,
    otpSend: otpSendSchema,
  },
};
