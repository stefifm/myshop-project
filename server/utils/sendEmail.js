import nodeMailer from 'nodemailer';
import {
  SMPT_HOST,
  SMPT_MAIL,
  SMPT_PASSWORD,
  SMPT_PORT,
  SMPT_SERVICE
} from '../config';

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: SMPT_HOST,
    port: SMPT_PORT,
    service: SMPT_SERVICE,
    auth: {
      user: SMPT_MAIL,
      pass: SMPT_PASSWORD
    }
  });

  const mailOptions = {
    from: SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
