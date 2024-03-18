import nodemailer from "nodemailer";

const registerEmail = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const { name, email, token } = data;

  await transport.sendMail({
    from: '"InmoConnect" <noreply@inmoconnect.com>', // Especifica un remitente más formal con dirección de correo
    to: email, // Asegúrate de que esta variable contiene el correo electrónico del destinatario
    subject: "Please Confirm Your Email on InmoConnect",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
              background-color: #f4f4f4;
            }
            .content {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              color: #fff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>Welcome to InmoConnect, ${name}!</h1>
            <p>We're excited to have you on board. Please confirm your email address to get started:</p>
            <a href="${process.env.APP_URL}:${
      process.env.APP_PORT ?? 3000
    }/auth/emailConfirmation/${token}" class="button">Confirm Your Email</a>
            <p>If you didn't register for an InmoConnect account, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  });

  
};

const forgotPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const { name, email, token } = data;

  await transport.sendMail({
    from: '"InmoConnect" <noreply@inmoconnect.com>', // Especifica un remitente más formal con dirección de correo
    to: email, // Asegúrate de que esta variable contiene el correo electrónico del destinatario
    subject: "Reset Your Password on InmoConnect",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              text-align: center;
              background-color: #f4f4f4;
            }
            .content {
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              color: #fff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>Reset Your Password at InmoConnect, ${name}!</h1>
            <p>We received a request to reset the password for your InmoConnect account</p>
            <a href="${process.env.APP_URL}:${
              process.env.APP_PORT ?? 3000
            }/auth/forgot-password/${token}" class="button">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns about your account security.</p>
          </div>
        </body>
      </html>
    `,
  });

  
};




export { registerEmail, forgotPassword };
