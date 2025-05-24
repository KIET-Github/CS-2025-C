import nodemailer from "nodemailer";

const generateOTP = () => {
  let otp = ''
  for (let i = 0; i <= 3; i++) {
    const rendVal = Math.round(Math.random() * 9);
    otp = otp + rendVal;
  }
  return otp;
}

const transporter = () => nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports 
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  }
});

const generateEmailTemplate = (code) => {
  return `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">College Search</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing College Search. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
    <p style="font-size:0.9em;">Regards,<br />College Search</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>College Search Inc</p>
      <p>KIET Group Of Instituition</p>
      <p>Ghaziabad</p>
    </div>
  </div>
</div>
`
};

const plainEmailTemplate = (heading, message) => {
  return `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">College Search</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${heading}</p>
    <h2>${message}</h2>
    <p style="font-size:0.9em;">Regards,<br />College Search</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>College Search Inc</p>
      <p>KIET Group Of Instituition</p>
      <p>Ghaziabad</p>
    </div>
  </div>
</div>
`
};

const generatePasswordResetTemplate = (url) => {
  return `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">College Search</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing College Search. Use the following LINK to Reset your Password. Link is valid for 1 hour</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${url}</h2>
    <p style="font-size:0.9em;">Regards,<br />College Search</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>College Search Inc</p>
      <p>KIET Group Of Instituition</p>
      <p>Ghaziabad</p>
    </div>
  </div>
</div>
`
};

export { generateOTP, transporter, generateEmailTemplate, plainEmailTemplate, generatePasswordResetTemplate };
