const nodemailer = require('nodemailer');

const sendEmail = async (to, subject = "CarRental", text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email failed to send:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmail };
