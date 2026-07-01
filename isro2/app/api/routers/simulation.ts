import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { simulationRuns } from "@db/schema";
import { desc, eq } from "drizzle-orm";

export const simulationRouter = createRouter({
  run: publicQuery
    .input(
      z.object({
        type: z.enum(["monsoon", "agriculture", "urban", "water"]),
        region: z.string(),
        parameters: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await getDb()
        .insert(simulationRuns)
        .values({
          simulationType: input.type,
          region: input.region,
          parameters: input.parameters || {},
          status: "running",
        });

      const simId = Number(result[0].insertId);

      setTimeout(async () => {
        await getDb()
          .update(simulationRuns)
          .set({
            status: "completed",
            completedAt: new Date(),
            results: generateSimulationResults(input.type, input.region),
          })
          .where(eq(simulationRuns.id, simId));
      }, 2000);

      return { id: simId, status: "running" };
    }),

  getHistory: publicQuery
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit || 10;
      return getDb()
        .select()
        .from(simulationRuns)
        .orderBy(desc(simulationRuns.createdAt))
        .limit(limit);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(simulationRuns)
        .where(eq(simulationRuns.id, input.id))
        .limit(1);
      return rows.at(0) || null;
    }),

  listAll: publicQuery
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit || 50;
      return getDb()
        .select()
        .from(simulationRuns)
        .orderBy(desc(simulationRuns.createdAt))
        .limit(limit);
    }),
});

function generateSimulationResults(type: string, region: string) {
  const scenarios = ["optimistic", "moderate", "pessimistic"];
  if (type === "monsoon") {
    return {
      scenarios: scenarios.map((s) => ({
        name: s,
        onsetDate: `2025-06-${s === "optimistic" ? "01" : s === "moderate" ? "05" : "12"}`,
        totalRainfall: s === "optimistic" ? 980 : s === "moderate" ? 890 : 760,
        extremeEvents: s === "optimistic" ? 2 : s === "moderate" ? 5 : 9,
      })),
      region,
    };
  }
  if (type === "agriculture") {
    return {
      yield: {
        rice: Math.round((105 + Math.random() * 15) * 10) / 10,
        wheat: Math.round((98 + Math.random() * 12) * 10) / 10,
        pulses: Math.round((22 + Math.random() * 5) * 10) / 10,
      },
      waterRequirement: Math.round(850 + Math.random() * 200),
      riskLevel: Math.random() > 0.6 ? "moderate" : "low",
      region,
    };
  }
  return { scenarios, region, type };
}