const nodemailer = require('nodemailer');

const sendOTP = async (contact, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: contact,
    subject: "Your OTP for Boora Classes",
    html: `<h2>Your OTP is: <b>${otp}</b></h2>`
  });
};

const sendRegistrationDetails = async (contact, loginId, password) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: contact,
    subject: "Welcome to Boora Classes! Your Registration Details",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px;">
        <h2 style="color: #2575fc;">Welcome to Boora Classes!</h2>
        <p>Thank you for registering. Here are your login details:</p>
        <p><b>Login ID (Email):</b> <span style="color: #6a11cb;">${loginId}</span></p>
        <p><b>Password:</b> <span style="color: #6a11cb;">${password}</span></p>
        <hr style="margin: 16px 0;" />
        <p style="color: #d9534f; font-size: 0.95rem;">Please do not share your credentials with anyone. If you did not register, please ignore this email.</p>
        <p style="font-size: 0.95rem; color: #888;">&copy; ${new Date().getFullYear()} Boora Classes</p>
      </div>
    `
  });
};

module.exports = sendOTP;
module.exports.sendRegistrationDetails = sendRegistrationDetails;
