import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const ACCESS_SECRET = process.env.DATABASE_URL!;
const REFRESH_SECRET = process.env.DATABASE_URL!;

export function signTokens(userId: string) {
  console.log(userId, "USER ID FROM SIGN TOKENS");
  console.log({
    accessToken: jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: "15m" }),
    refreshToken: jwt.sign({ sub: userId }, REFRESH_SECRET, {
      expiresIn: "7d",
    }),
  });

  return {
    accessToken: jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: "15m" }),
    refreshToken: jwt.sign({ sub: userId }, REFRESH_SECRET, {
      expiresIn: "7d",
    }),
  };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as { sub: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as { sub: string };
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(ACCESS_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
