import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import jwt, { JwtPayload } from "jsonwebtoken";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

type AccessPayload = JwtPayload & { username: string };

export const authMiddleware = new Elysia({ name: "auth" })
  .error({ UNAUTHORIZED: AuthError })
  .onError(({ code, error, set }) => {
    if (code === "UNAUTHORIZED") {
      set.status = 401;
      return { error: "Unauthorized", message: error.message };
    }
  })
  .derive({ as: "scoped" }, async ({ headers, set }) => {
    const authHeader = headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      set.status = 401;
      throw new AuthError("Missing authentication credentials");
    }

    const accessToken = authHeader.slice(7).trim();
    if (!accessToken) {
      set.status = 401;
      throw new AuthError("Missing access token");
    }

    let payload: AccessPayload;

    try {
      payload = jwt.verify(
        accessToken,
        process.env.JWT_SECRET!
      ) as AccessPayload;
    } catch {
      set.status = 401;
      throw new AuthError("Invalid or expired access token");
    }

    const sessionId = await redis.get(`token:${accessToken}`);
    if (!sessionId) {
      set.status = 401;
      throw new AuthError("Invalid or expired access token");
    }

    const session = await redis.hgetall<Record<string, string>>(
      `session:${sessionId}`
    );
    if (!session?.username) {
      set.status = 401;
      throw new AuthError("Session not found");
    }

    const isBlocked = session.isBlock === "1" || session.isBlock === "true";
    if (isBlocked) {
      set.status = 401;
      throw new AuthError("Session is blocked");
    }

    const expiresAt = Number(session.expiresAt || 0);
    if (expiresAt && Date.now() > expiresAt) {
      await redis.del(`token:${accessToken}`);
      set.status = 401;
      throw new AuthError("Session expired");
    }

    if (session.username !== payload.username) {
      set.status = 401;
      throw new AuthError("Token/session mismatch");
    }
    if (session.accessToken && session.accessToken !== accessToken) {
      set.status = 401;
      throw new AuthError("Stale access token");
    }

    return {
      user: { username: payload.username },
      sessionId,
      accessToken,
    };
  });
