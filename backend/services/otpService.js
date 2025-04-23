import { Resend } from 'resend';
import Otp from '../models/otpModel.js';

const resend = new Resend('re_T9yvGC4Z_FS8ELn9u6JyXDo9BAzV5ux3R');

export const sendOtp = async (email) => {
  // Generate a 4-digit OTP
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Set OTP expiry time to 10 minutes from now
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  // Save or update OTP in DB
  await Otp.findOneAndUpdate(
    { email },
    { otp: otpCode, expiresAt: expiry },
    { upsert: true, new: true }
  );

  // Compose styled email
  const emailContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007bff;">🔐 Your Storage App OTP</h2>
      <p>Hi there 👋,</p>
      <p>Use the following One-Time Password (OTP) to complete your verification:</p>
      <h1 style="letter-spacing: 4px; background-color: #f0f0f0; padding: 10px 20px; display: inline-block; border-radius: 6px; color: #111;">
        ${otpCode}
      </h1>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <footer style="font-size: 0.9em; color: #888;">
        ❤️ From the <strong>Storage App</strong> Team <br>
        <a href="https://ashraful.in" style="color: #007bff;">Visit our website</a>
      </footer>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'StorageApp <otp@ashraful.in>',
      to: [email],
      subject: 'Your OTP for Storage App Login',
      html: emailContent,
    });

    return {
      message: `OTP sent successfully to ${email}`,
      email,
      expiresAt: expiry,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP. Please try again later.');
  }
};
