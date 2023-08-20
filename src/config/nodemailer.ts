import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
export const sendEmail = (email:string, token:string, body:{html:string, text:string, subject:string} ) => {

  const dataEmail = {
    from: process.env.SMTP_USER,
    to: email, // An array if you have multiple recipients.
    subject: body.subject,
    html:body.html,
    text: body.text,
  };

  transport.sendMail(dataEmail, (err, info) => {
    if (err) {
      return console.log("ERROR AL ENVIAR MAIL", err);
    }

    console.log(`Mail send succesfull ${info.messageId}`);
  });
};
