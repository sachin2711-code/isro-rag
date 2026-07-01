import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.LOCAL_AUTH_SECRET || "indra-local-auth-secret-key-2025"
);

export async function verifyLocalAuthToken(headers: Headers) {
  const token = headers.get("x-local-auth-token");
  if (!token) return null;

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
    const userId = payload.userId as number;
    if (!userId) return null;

    const rows = await getDb()
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, userId))
      .limit(1);
    return rows.at(0) || null;
  } catch {
    return null;
  }
}

async function signLocalToken(userId: number): Promise<string> {
  return new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(100),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await getDb()
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const result = await getDb()
        .insert(localUsers)
        .values({
          username: input.username,
          passwordHash,
          displayName: input.displayName || input.username,
          email: input.email,
        });

      const userId = Number(result[0].insertId);
      const token = await signLocalToken(userId);

      return { token, userId };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);

      const user = rows.at(0);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const token = await signLocalToken(user.id);
      return { token, userId: user.id };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const token = ctx.req.headers.get("x-local-auth-token");
    if (!token) return null;

    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
      const userId = payload.userId as number;
      const rows = await getDb()
        .select()
        .from(localUsers)
        .where(eq(localUsers.id, userId))
        .limit(1);
      return rows.at(0) || null;
    } catch {
      return null;
    }
  }),
});
