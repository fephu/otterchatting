import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleware } from "./auth";
import z from "zod";
import { Message, realtime } from "@/lib/realtime";
import { CreateUserValidator } from "@/lib/validators/create-user-validator";
import bcrypt from "bcryptjs";
import { LoginUserValidator } from "@/lib/validators/login-user-validator";
import jwt from "jsonwebtoken";

const ROOM_TTL_SECONDS = 60 * 10;

const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/create",
    async ({ body, set }) => {
      const { username, password } = body;

      const existingUser = await redis.exists(`user:${username}`);
      if (existingUser) {
        set.status = 409;
        return { error: "USERNAME_EXISTS", message: "Username already exists" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        username: username,
        password: hashedPassword,
        createdAt: Date.now(),
      };

      await redis.hset(`user:${username}`, user);

      const { password: _z, ...userResponse } = user;
      return userResponse;
    },
    {
      body: CreateUserValidator,
    }
  )
  .post(
    "/login",
    async ({ body, cookie: { x_auth_token }, set }) => {
      const { username, password } = body;

      const user = await redis.hgetall<{
        username: string;
        password: string;
        createdAt: number;
      }>(`user:${username}`);
      if (!user) {
        set.status = 404;
        return { message: "Invalid credentials" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        set.status = 404;
        return { message: "Invalid credentials" };
      }

      const accessToken = jwt.sign(
        {
          username: user.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "15m",
          algorithm: "HS256",
        }
      );

      const refreshToken = jwt.sign(
        {
          username: user.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
          algorithm: "HS256",
        }
      );

      const sessionId = nanoid();

      const session = {
        username: username,
        token: refreshToken,
        isBlock: false,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
      };

      const pipeline = redis.pipeline();
      pipeline.hset(`session:${sessionId}`, session);
      pipeline.set(`token:${refreshToken}`, sessionId, {
        ex: 7 * 24 * 60 * 60,
      });
      pipeline.set(`token:${accessToken}`, sessionId, {
        ex: 15 * 60,
      });
      await pipeline.exec();

      x_auth_token.set({
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        value: refreshToken,
      });

      const { password: _z, ...userResponse } = user;
      return { accessToken, user: userResponse };
    },
    {
      body: LoginUserValidator,
    }
  )
  .use(authMiddleware)
  .get("/me", async ({ user }) => {
    return { user };
  })
  .post(
    "/logout",
    async ({
      sessionId,
      accessToken,
      refreshToken,
      cookie: { x_auth_token },
    }) => {
      const pipeline = redis.pipeline();

      pipeline.del(`session:${sessionId}`);

      pipeline.del(`token:${accessToken}`);

      pipeline.del(`token:${refreshToken}`);

      await pipeline.exec();

      x_auth_token.remove();

      return { message: "Logged out successfully" };
    }
  );

const rooms = new Elysia({ prefix: "/room" })
  .use(authMiddleware)
  .post(
    "/create",
    async ({ body, user }) => {
      const { username } = user;

      const roomId = nanoid();

      const ttlSeconds = body.ttl ?? ROOM_TTL_SECONDS;

      await redis.hset(`meta:${roomId}`, {
        owner: username,
        connected: [username],
        createdAt: Date.now(),
      });

      await redis.expire(`meta:${roomId}`, ttlSeconds);

      await redis.sadd(`user:${username}:rooms`, roomId);

      return { roomId };
    },
    {
      body: z.object({
        ttl: z.coerce
          .number()
          .int()
          .min(10)
          .max(60 * 60 * 24)
          .optional(),
      }),
    }
  )
  .post(
    "/join",
    async ({ body, user }) => {
      const { username } = user;
      const { roomId } = body;

      const meta = await redis.hgetall<{
        connected: string[];
        createdAt: number;
      }>(`meta:${roomId}`);

      if (!meta) throw new Error("Room does not exist");

      await redis.hset(`meta:${roomId}`, {
        connected: [...meta.connected, username],
      });

      await redis.sadd(`user:${username}:rooms`, roomId);

      return { roomId };
    },
    {
      body: z.object({
        roomId: z.string(),
      }),
    }
  )
  .get(
    "/ttl",
    async ({ query }) => {
      const { roomId } = query;

      const ttl = await redis.ttl(`meta:${roomId}`);

      return { ttl: ttl > 0 ? ttl : 0 };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  )
  .get("/my-rooms", async ({ user }) => {
    const { username } = user;

    const roomIds = await redis.smembers(`user:${username}:rooms`);

    if (!roomIds || roomIds.length === 0) {
      return { rooms: [] };
    }

    const rooms = await Promise.all(
      roomIds.map(async (roomId) => {
        const meta = await redis.hgetall<{
          owner: string;
          connected: string[];
          createdAt: number;
        }>(`meta:${roomId}`);

        const ttl = await redis.ttl(`meta:${roomId}`);

        if (ttl <= 0 || !meta) {
          await redis.srem(`user:${username}:rooms`, roomId);
          return null;
        }

        return {
          roomId,
          owner: meta.owner,
          connected: meta.connected,
          createdAt: meta.createdAt,
          ttl,
          isOwner: meta.owner === username,
        };
      })
    );

    const validRooms = rooms.filter((room) => room !== null);

    validRooms.sort((a, b) => a.createdAt - b.createdAt);

    return { rooms: validRooms };
  })
  .get(
    "/",
    async ({ query, user }) => {
      const { roomId } = query;
      const { username } = user;

      const meta = await redis.hgetall<{
        owner: string;
        connected: string[];
        createdAt: number;
      }>(`meta:${roomId}`);

      if (!meta) {
        throw new Error("Room does not exist");
      }

      return { meta, isOwner: meta.owner === username };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  )

  .delete(
    "/",
    async ({ query }) => {
      const { roomId } = query;

      await realtime
        .channel(roomId)
        .emit("chat.destroy", { isDestroyed: true });
      await Promise.all([
        redis.del(roomId),
        redis.del(`meta:${roomId}`),
        redis.del(`messages:${roomId}`),
        // redis.del(`history:${auth.roomId}`);
      ]);
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user }) => {
      const { sender, text, images, roomId } = body;
      const { username } = user;

      const roomExists = await redis.exists(`meta:${roomId}`);

      if (!roomExists) {
        throw new Error("Room does not exist");
      }

      const message: Message = {
        id: nanoid(),
        sender,
        text,
        timestamp: Date.now(),
        roomId,
        images,
      };

      await redis.rpush(`messages:${roomId}`, {
        ...message,
        owner: username,
      });
      await realtime.channel(roomId).emit("chat.message", message);

      const remaining = await redis.ttl(`meta:${roomId}`);

      await redis.expire(`messages:${roomId}`, remaining);
      await redis.expire(`history:${roomId}`, remaining);
      await redis.expire(roomId, remaining);
    },
    {
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
        images: z.array(z.url()).optional(),
        roomId: z.string(),
      }),
    }
  )
  .get(
    "/",
    async ({ query, user }) => {
      const { roomId } = query;
      const { username } = user;

      const messages = await redis.lrange<Message>(`messages:${roomId}`, 0, -1);

      return {
        messages: messages.map((m) => ({
          ...m,
          owner: m.owner === username ? username : undefined,
        })),
      };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

const app = new Elysia({ prefix: "/api" }).use(auth).use(rooms).use(messages);

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;
