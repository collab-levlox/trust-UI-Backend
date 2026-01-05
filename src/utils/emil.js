const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
}); 

// const sendOTPEmail = async (to, otp) => {
//   console.log({
//     otp,
//     to
//   });
  
//   const s = await transporter.sendMail({
//     // from: `<${process.env.EMAIL_FROM}>`,
//     from: `"Umitrix" <${process.env.BREVO_SMTP_USER}>`,
//     to,
//     subject: "Your OTP Code",
//     html: `
//       <h3>OTP Verification</h3>
//       <p>Your OTP is:</p>
//       <h2>${otp}</h2>
//       <p>Valid for 5 minutes</p>
//     `,
//   });
//   console.log(s,'sts cone ');
  
// };


const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

apiKey.apiKey = process.env.BREVO_SMTP_PASS; // replace with your actual API v3 key

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTPEmail = async (to, otp) => {
  console.log(transactionalEmailsApi,'transactionalEmailsApi');
  
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.sender = { name: "Umitrix", email: process.env.BREVO_SMTP_USER }; // must be verified
  sendSmtpEmail.subject = "Your OTP Code";
  sendSmtpEmail.htmlContent = `
    <h2>OTP Verification</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>Valid for 5 minutes</p>
  `;

  try {
    const result = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", result);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};


module.exports = {
  sendOTPEmail
}
