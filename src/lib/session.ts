import { SignJWT, jwtVerify } from "jose";

// Gunakan environment variable di production (process.env.JWT_SECRET)
// Hardcoded fallback hanya untuk contoh / development lokal
const secretKey = process.env.JWT_SECRET || "LPPNU-MAGELANG-SUPER-SECRET-KEY-12345";
const key = new TextEncoder().encode(secretKey);

export async function createSession(payload: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 hari
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(key);
  return { session, expires };
}

export async function verifySession(session: string | undefined = "") {
  try {
    if (!session) return null;
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
