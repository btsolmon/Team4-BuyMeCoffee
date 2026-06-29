import crypto from "crypto";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export function createPasswordResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return { token, hashedToken };
}

export function hashPasswordResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Buy Me Coffee <onboarding@resend.dev>";

  if (!resend) {
    console.log("[dev] Password reset link:", resetUrl);
    return;
  }

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Reset your Buy Me Coffee password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #09090b;">Reset your password</h2>
        <p style="color: #71717a; line-height: 1.6;">
          We received a request to reset your Buy Me Coffee password.
          Click the button below to choose a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; margin: 24px 0; padding: 12px 24px;
                  background: #18181b; color: #fafafa; text-decoration: none;
                  border-radius: 6px; font-weight: 500;">
          Reset password
        </a>
        <p style="color: #a1a1aa; font-size: 13px; line-height: 1.5;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
