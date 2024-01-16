const nodemailer = require('nodemailer');
const { smtpEthereal } = require('../../config/index');

const sendMail = async (userName, userEmail, SUBJECT, TEXT, HTML) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: smtpEthereal.email,
      pass: smtpEthereal.password
    }
  });

  const info = await transporter.sendMail({
    from: `${userName} ${smtpEthereal.email}`,
    to: userEmail,
    subject: SUBJECT,
    text: TEXT,
    html: HTML
  });

  console.info('Email Sent', info);
  return true;
};

module.exports = sendMail;
