import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { alerts } from "@db/schema";
import { desc, eq, and } from "drizzle-orm";

// Seed initial alerts if none exist
async function seedInitialAlerts() {
  const existing = await getDb().select().from(alerts).limit(1);
  if (existing.length > 0) return;

  await getDb().insert(alerts).values([
    {
      title: "Heat Wave Warning: Delhi NCR",
      description: "Maximum temperatures expected to reach 43-45°C over the next 48 hours. Heat action plan activated.",
      severity: "critical",
      sector: "urban",
      region: "Delhi",
      isActive: true,
    },
    {
      title: "Monsoon Onset: Kerala",
      description: "Southwest monsoon onset expected over Kerala within 5 days. Farmers advised to begin Kharif preparations.",
      severity: "info",
      sector: "agriculture",
      region: "Kerala",
      isActive: true,
    },
    {
      title: "Cauvery Basin Water Stress",
      description: "Reservoir storage at 54% of capacity. Water rationing recommended for agricultural use in Tamil Nadu and Karnataka.",
      severity: "warning",
      sector: "water",
      region: "Cauvery Basin",
      isActive: true,
    },
    {
      title: "Heavy Rainfall Alert: Mumbai",
      description: "Intense rainfall episode expected over Mumbai and coastal Maharashtra. Urban flooding risk elevated.",
      severity: "warning",
      sector: "urban",
      region: "Mumbai",
      isActive: true,
    },
    {
      title: "Cyclone Watch: Bay of Bengal",
      description: "Low pressure area forming over southeast Bay of Bengal. Monitoring for cyclonic development.",
      severity: "info",
      sector: "general",
      region: "Bay of Bengal",
      isActive: true,
    },
  ]);
}

export const alertsRouter = createRouter({
  getActive: publicQuery
    .input(
      z.object({
        sector: z.string().optional(),
        region: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      await seedInitialAlerts();

      const conditions = [eq(alerts.isActive, true)];
      if (input?.sector) {
        conditions.push(eq(alerts.sector, input.sector as any));
      }
      if (input?.region) {
        conditions.push(eq(alerts.region, input.region));
      }

      return getDb()
        .select()
        .from(alerts)
        .where(conditions.length > 1 ? and(...conditions) : conditions[0])
        .orderBy(desc(alerts.createdAt));
    }),

  getAll: publicQuery.query(async () => {
    await seedInitialAlerts();
    return getDb()
      .select()
      .from(alerts)
      .orderBy(desc(alerts.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        severity: z.enum(["info", "warning", "critical"]),
        sector: z.enum(["agriculture", "water", "urban", "general"]),
        region: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await getDb().insert(alerts).values(input);
      return { success: true };
    }),

  resolve: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb()
        .update(alerts)
        .set({ isActive: false })
        .where(eq(alerts.id, input.id));
      return { success: true };
    }),
});
