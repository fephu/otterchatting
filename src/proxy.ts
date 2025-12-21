import { NextRequest, NextResponse } from "next/server";
import { redis } from "./lib/redis";

export const proxy = async (req: NextRequest) => {
  const existingToken = req.cookies.get("x_auth_token")?.value;

  if (!existingToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const sessionId = await redis.get(`token:${existingToken}`);

  if (!sessionId) {
    return NextResponse.redirect(new URL("/", req.url));
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
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (session.isBlock) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/home", "/home/:path*"],
};
