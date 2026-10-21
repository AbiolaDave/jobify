import nodemailer from "nodemailer";

export async function sendVerificationCode(email: string, code: string): Promise<void> {
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!user || !password) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured to send email.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: password },
  });
  await transporter.sendMail({
    from: user,
    to: email,
    subject: "Your Jobify verification code",
    text: `Your Jobify verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your Jobify verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
}
