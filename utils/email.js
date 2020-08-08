const nodemailer = require('nodemailer');

// 1) create a Transporter

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Define the email options

  const mailOptions = {
    from: 'Growers Brains Community <noreply@growers.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
