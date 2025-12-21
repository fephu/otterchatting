import { redis } from "@/lib/redis";
import Elysia from "elysia";
import jwt from "jsonwebtoken";

class AuthError extends Error {
  constructor(messagge: string) {
    super(messagge);

    this.name = "AuthError";
  }
}

export const authMiddleware = new Elysia({ name: "auth" })
  .error({ AuthError })
  .onError(({ code, set }) => {
    if (code === "AuthError") {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .derive({ as: "scoped" }, async ({ headers, cookie }) => {
    const authHeader = headers.authorization;
    const token = cookie["x_auth_token"].value as string | undefined;

    if (!token || !authHeader?.startsWith("Bearer ")) {
      throw new AuthError("Unauthorized");
    }

    const accessToken = authHeader.substring(7);

    try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
        username: string;
      };

      const sessionId = await redis.get(`token:${accessToken}`);
      if (!sessionId) {
        throw new AuthError("Invalid or expired access token");
      }

      const session = await redis.hgetall<{
        username: string;
        accessToken: string;
        refreshToken: string;
        isBlock: boolean;
        expiresAt: number;
        createdAt: number;
      }>(`session:${sessionId}`);

      if (!session) {
        throw new AuthError("Session not found");
      }

      if (session.isBlock) {
        throw new AuthError("Session is blocked");
      }

      return {
        user: { username: payload.username },
        sessionId,
        accessToken,
        refreshToken: token,
      };
    } catch (error) {
      throw new AuthError("Invalid access token");
    }
  });
