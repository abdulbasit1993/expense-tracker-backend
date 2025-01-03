import * as dotenv from "dotenv";
dotenv.config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  // host: "live.smtp.mailtrap.io",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendEmail = async (
  fromEmail: string | undefined,
  toEmail: string | undefined,
  subject: string | undefined,
  text: string | undefined
): Promise<string | undefined> => {
  try {
    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", info.response);
    return info.response;
  } catch (error) {
    console.log("Error in sendEmail: ", error);
    return undefined;
  }
};
