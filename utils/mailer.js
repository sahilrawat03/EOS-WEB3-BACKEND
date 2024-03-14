require("dotenv").config();
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");

exports.sendVerificationEmail = ({ toUser, hash }) => {
  return new Promise((resolve, reject) => {
    // configure AWS SDK
    aws.config.update({
      region: "eu-central-1", // or another AWS region where SES is available
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    // create an SES transporter
    const transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01",
        source: "noreply@empireofsight.com",
      }),
    });

    const mailOptions = {
      from: '"Empire of Sight" <' + process.env.EMAIL_USER + ">",
      to: toUser,
      subject: "🎉 Verify your email",
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css2?family=Gentium+Book+Basic:wght@700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@600&display=swap"
            rel="stylesheet"
          />
          <style>
            .email-container {
              background-color: #111111 !important;
              color: #f2f2f2 !important;
              font-family: "Source Sans Pro", sans-serif;
              margin: 0 auto;
              padding: 30px;
              max-width: 600px;
              text-align: left;
              letter-spacing: -0.25px;
              line-height: 1;
            }
      
            .email-header {
              padding: 20px 20px 0px 20px;
              text-align: left;
            }
      
            .logo {
              max-width: 75px;
              height: 71px;
            }
      
            .email-header h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #f8f8f8;
              transition: color 1s ease-in-out;
              cursor: default;
            }
      
            .email-header:hover h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #87ff00;
              cursor: default;
            }
      
            .email-body {
              margin-top: 20px;
              font-size: 18px;
              line-height: 1.1;
              text-align: left;
              padding: 0 20px 0 20px;
              cursor: default;
            }
      
            .verify-button {
              font-family: "Gentium Book Basic", serif;
              background-color: #f8f8f8;
              color: #111111 !important;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 15px;
              margin-bottom: 60px;
              display: inline-block;
              font-size: 24px;
              letter-spacing: -0.8px;
              transition: background 1s ease-in-out;
              font-weight: bold;
              font-size: 26px;
            }
      
            .verify-button:hover {
              background-color: #87ff00;
              color: #111111 !important;
            }
      
            .email-footer {
              margin-top: 30px;
              font-size: 14px;
              padding: 0 20px;
              margin-bottom: 30px;
              cursor: default;
            }
      
            .email-footer a {
              color: #87ff00;
              text-decoration: none;
            }
      
            @media only screen and (max-width: 600px) {
              .email-container {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img
                class="logo"
                width="75"
                height="71"
                src="https://www.empireofsight.com/icon.png"
                alt="Logo"
              />
              <h2>Welcome to the Empire of Sight!</h2>
            </div>
      
            <div class="email-body">
              <p>
                We need a little help confirming it's really you. Please click the
                button below to verify your email address.
              </p>
              <a
                href="https://api.empireofsight.com/verify/${hash}"
                class="verify-button"
                >Verify Email</a
              >
            </div>
      
            <div class="email-footer">
              <p>
                If you're having trouble clicking the verification button, copy &
                paste the URL below into your web browser:
              </p>
              <a href="https://api.empireofsight.com/verify/${hash}"
                >https://api.empireofsight.com/verify/${hash}</a
              >
            </div>
          </div>
        </body>
      </html>  
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("error:", err);
        reject(err);
      } else {
        console.log("verification email sent");
        resolve(info);
      }
    });
  });
};

/*
require("dotenv").config();
const nodemailer = require("nodemailer");

exports.sendVerificationEmail = ({ toUser, hash }) => {
  return new Promise((resolve, reject) => {
    const mailerConfig = {
      name: "www.empireofsight.com",
      host: "smtp.office365.com",
      secureConnection: false,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(mailerConfig);

    const mailOptions = {
      from: '"Empire of Sight" <' + process.env.EMAIL_USER + ">",
      to: toUser,
      subject: "🎉 Verify your email",
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css2?family=Gentium+Book+Basic:wght@700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@600&display=swap"
            rel="stylesheet"
          />
          <style>
            .email-container {
              background-color: #111111 !important;
              color: #f2f2f2 !important;
              font-family: "Source Sans Pro", sans-serif;
              margin: 0 auto;
              padding: 30px;
              max-width: 600px;
              text-align: left;
              letter-spacing: -0.25px;
              line-height: 1;
            }
      
            .email-header {
              padding: 20px 20px 0px 20px;
              text-align: left;
            }
      
            .logo {
              max-width: 75px;
              height: 71px;
            }
      
            .email-header h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #f8f8f8;
              transition: color 1s ease-in-out;
              cursor: default;
            }
      
            .email-header:hover h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #87ff00;
              cursor: default;
            }
      
            .email-body {
              margin-top: 20px;
              font-size: 18px;
              line-height: 1.1;
              text-align: left;
              padding: 0 20px 0 20px;
              cursor: default;
            }
      
            .verify-button {
              font-family: "Gentium Book Basic", serif;
              background-color: #f8f8f8;
              color: #111111 !important;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 15px;
              margin-bottom: 60px;
              display: inline-block;
              font-size: 24px;
              letter-spacing: -0.8px;
              transition: background 1s ease-in-out;
              font-weight: bold;
              font-size: 26px;
            }
      
            .verify-button:hover {
              background-color: #87ff00;
              color: #111111 !important;
            }
      
            .email-footer {
              margin-top: 30px;
              font-size: 14px;
              padding: 0 20px;
              margin-bottom: 30px;
              cursor: default;
            }
      
            .email-footer a {
              color: #87ff00;
              text-decoration: none;
            }
      
            @media only screen and (max-width: 600px) {
              .email-container {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img
                class="logo"
                src="https://www.empireofsight.com/icon.png"
                alt="Logo"
              />
              <h2>Welcome to the Empire of Sight!</h2>
            </div>
      
            <div class="email-body">
              <p>
                We need a little help confirming it's really you. Please click the
                button below to verify your email address.
              </p>
              <a
                href="https://www.api.empireofsight.com/verify/${hash}"
                class="verify-button"
                >Verify Email</a
              >
            </div>
      
            <div class="email-footer">
              <p>
                If you're having trouble clicking the verification button, copy &
                paste the URL below into your web browser:
              </p>
              <a href="https://www.api.empireofsight.com/verify/${hash}"
                >https://www.api.empireofsight.com/verify/${hash}</a
              >
            </div>
          </div>
        </body>
      </html>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("error:", err);
        reject(err);
      } else {
        console.log("verification email sent");
        resolve(info);
      }
    });
  });
};*/

exports.sendPasswordResetEmail = ({ toUser, id, hash }) => {
  return new Promise((resolve, reject) => {
    // configure AWS SDK
    aws.config.update({
      region: "eu-central-1", // or another AWS region where SES is available
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    // create an SES transporter
    const transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01",
        source: "noreply@empireofsight.com",
      }),
    });

    const mailOptions = {
      from: '"Empire of Sight" <' + process.env.EMAIL_USER + ">",
      to: toUser,
      subject: "👀 Reset Password",
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css2?family=Gentium+Book+Basic:wght@700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@600&display=swap"
            rel="stylesheet"
          />
          <style>
            .email-container {
              background-color: #111111 !important;
              color: #f2f2f2 !important;
              font-family: "Source Sans Pro", sans-serif;
              margin: 0 auto;
              padding: 30px;
              max-width: 600px;
              text-align: left;
              letter-spacing: -0.25px;
              line-height: 1;
            }
      
            .email-header {
              padding: 20px 20px 0px 20px;
              text-align: left;
            }
      
            .logo {
              max-width: 75px;
              height: 71px;
            }
      
            .email-header h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #f8f8f8;
              transition: color 1s ease-in-out;
              cursor: default;
            }
      
            .email-header:hover h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #87ff00;
              cursor: default;
            }
      
            .email-body {
              margin-top: 20px;
              font-size: 18px;
              line-height: 1.1;
              text-align: left;
              padding: 0 20px 0 20px;
              cursor: default;
            }
      
            .reset-button {
              font-family: "Gentium Book Basic", serif;
              background-color: #f8f8f8;
              color: #111111 !important;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 15px;
              margin-bottom: 10px;
              display: inline-block;
              font-size: 24px;
              letter-spacing: -0.8px;
              transition: background 1s ease-in-out;
              font-weight: bold;
              font-size: 26px;
            }
      
            .reset-button:hover {
              background-color: #87ff00;
              color: #111111 !important;
            }
      
            .email-signoff {
              padding-top: 15px;
              font-size: 18px;
              text-align: left;
              color: #f8f8f8;
              cursor: default;
            }
      
            .email-footer {
              margin-top: 30px;
              font-size: 14px;
              padding: 0 20px;
              margin-bottom: 30px;
              cursor: default;
            }
      
            .email-footer a {
              color: #87ff00;
              text-decoration: none;
            }
      
            @media only screen and (max-width: 600px) {
              .email-container {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img
                class="logo" 
                width="75"
                height="71"
                src="https://www.empireofsight.com/icon.png"
                alt="Logo"
              />
              <h2>Lost your password?</h2>
            </div>
      
            <div class="email-body">
              <p>
                No worries!<br />
                Click the button below to craft a new one.
              </p>
      
              <a
                href="https://www.empireofsight.com/reset-password/${id}/${hash}"
                class="reset-button"
                >Reset Password</a
              >
      
              <p class="email-signoff">
                Please ignore this message if you did not request a password reset.
              </p>
            </div>
      
            <div class="email-footer">
              <p>
                If you're having trouble clicking the password reset button, copy and
                paste the URL below into your web browser:
              </p>
              <a href="https://www.empireofsight.com/reset-password/${id}/${hash}"
                >https://www.empireofsight.com/reset-password/${id}/${hash}</a
              >
            </div>
          </div>
        </body>
      </html>  
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("error:", err);
        reject(err);
      } else {
        console.log("verification email sent");
        resolve(info);
      }
    });
  });
};

/*
exports.sendPasswordResetEmail = ({ toUser, id, hash }) => {
  return new Promise((resolve, reject) => {
    const mailerConfig = {
      name: "www.empireofsight.com",
      host: "smtp.office365.com",
      secureConnection: false,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(mailerConfig);

    const mailOptions = {
      from: '"Empire of Sight" <' + process.env.EMAIL_USER + ">",
      to: toUser,
      subject: "👀 Reset Password",
      html: `<!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css2?family=Gentium+Book+Basic:wght@700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@600&display=swap"
            rel="stylesheet"
          />
          <style>
            .email-container {
              background-color: #111111 !important;
              color: #f2f2f2 !important;
              font-family: "Source Sans Pro", sans-serif;
              margin: 0 auto;
              padding: 30px;
              max-width: 600px;
              text-align: left;
              letter-spacing: -0.25px;
              line-height: 1;
            }
      
            .email-header {
              padding: 20px 20px 0px 20px;
              text-align: left;
            }
      
            .logo {
              max-width: 75px;
              height: 71px;
            }
      
            .email-header h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #f8f8f8;
              transition: color 1s ease-in-out;
              cursor: default;
            }
      
            .email-header:hover h2 {
              padding-top: 15px;
              font-family: "Gentium Book Basic", serif;
              font-size: 32px;
              text-align: left;
              color: #87ff00;
              cursor: default;
            }
      
            .email-body {
              margin-top: 20px;
              font-size: 18px;
              line-height: 1.1;
              text-align: left;
              padding: 0 20px 0 20px;
              cursor: default;
            }
      
            .reset-button {
              font-family: "Gentium Book Basic", serif;
              background-color: #f8f8f8;
              color: #111111 !important;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 15px;
              margin-bottom: 10px;
              display: inline-block;
              font-size: 24px;
              letter-spacing: -0.8px;
              transition: background 1s ease-in-out;
              font-weight: bold;
              font-size: 26px;
            }
      
            .reset-button:hover {
              background-color: #87ff00;
              color: #111111 !important;
            }
      
            .email-signoff {
              padding-top: 15px;
              font-size: 18px;
              text-align: left;
              color: #f8f8f8;
              cursor: default;
            }
      
            .email-footer {
              margin-top: 30px;
              font-size: 14px;
              padding: 0 20px;
              margin-bottom: 30px;
              cursor: default;
            }
      
            .email-footer a {
              color: #87ff00;
              text-decoration: none;
            }
      
            @media only screen and (max-width: 600px) {
              .email-container {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img
                class="logo"
                src="https://www.empireofsight.com/icon.png"
                alt="Logo"
              />
              <h2>Lost your password?</h2>
            </div>
      
            <div class="email-body">
              <p>
                No worries!<br />
                Click the button below to craft a new one.
              </p>
      
              <a
                href="https://www.empireofsight.com/reset-password/${id}/${hash}"
                class="reset-button"
                >Reset Password</a
              >
      
              <p class="email-signoff">
                Please ignore this message if you did not request a password reset.
              </p>
            </div>
      
            <div class="email-footer">
              <p>
                If you're having trouble clicking the password reset button, copy and
                paste the URL below into your web browser:
              </p>
              <a href="https://www.empireofsight.com/reset-password/${id}/${hash}"
                >https://www.empireofsight.com/reset-password/${id}/${hash}</a
              >
            </div>
          </div>
        </body>
      </html>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("error:", err);
        reject(err);
      } else {
        console.log("verification email sent");
        resolve(info);
      }
    });
  });
};
*/
