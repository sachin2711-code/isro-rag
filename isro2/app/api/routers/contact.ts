import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { contactSubmissions } from "@db/schema";
import { desc, eq } from "drizzle-orm";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(100),
        email: z.string().email(),
        organization: z.string().optional(),
        sector: z.string().optional(),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      await getDb().insert(contactSubmissions).values(input);
      return { success: true };
    }),

  list: publicQuery.query(async () => {
    return getDb()
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied"]),
      })
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(contactSubmissions)
        .set({ status: input.status })
        .where(eq(contactSubmissions.id, input.id));
      return { success: true };
    }),
});
