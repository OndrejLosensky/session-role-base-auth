import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
const key = new TextEncoder().encode(secretKey);

interface SessionData {
  userId: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionData): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionData;
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

export async function createSession(userId: string) {
  const session = await encrypt({ userId, email: "", role: "" });
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

// Get session data from cookie
export async function getSession(): Promise<SessionData | null> {
  try {
    const session = (await cookies()).get("session");
    
    if (!session) {
      return null;
    }

    return await decrypt(session.value);
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

// Update session data
export async function updateSession(request: NextRequest): Promise<SessionData | null> {
  try {
    const session = request.cookies.get("session");
    
    if (!session) {
      return null;
    }

    return await decrypt(session.value);
  } catch (error) {
    console.error("Failed to update session:", error);
    return null;
  }
}