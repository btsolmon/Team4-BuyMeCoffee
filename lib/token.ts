import { SignJWT, jwtVerify } from "jose";

const getSecret = (refresh = false) =>
  new TextEncoder().encode(
    refresh ? process.env.JWT_REFRESH_SECRET! : process.env.JWT_SECRET!,
  );

export async function generateToken(
  userId: string,
  email: string,
  expiresIn: string,
  refresh = false,
) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setExpirationTime(expiresIn)
    .sign(getSecret(refresh));
}

export async function verifyToken(token: string, refresh = false) {
  try {
    const { payload } = await jwtVerify(token, getSecret(refresh));
    return payload;
  } catch {
    return null;
  }
}
