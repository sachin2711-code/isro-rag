import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { climateSnapshots } from "@db/schema";
import { desc, eq, and } from "drizzle-orm";

// Synthetic climate data generator for India's regions
function generateSyntheticData(region: string, parameter: string) {
  const baseValues: Record<string, Record<string, number>> = {
    "All-India": {
      temperature: 30.5,
      rainfall: 890,
      humidity: 65,
      wind_speed: 14.2,
      "soil_moisture": 45,
    },
    "Delhi": {
      temperature: 38.2,
      rainfall: 650,
      humidity: 48,
      wind_speed: 10.5,
      "soil_moisture": 22,
    },
    "Maharashtra": {
      temperature: 31.8,
      rainfall: 1100,
      humidity: 72,
      wind_speed: 16.3,
      "soil_moisture": 52,
    },
    "Karnataka": {
      temperature: 27.4,
      rainfall: 950,
      humidity: 68,
      wind_speed: 12.8,
      "soil_moisture": 40,
    },
    "Tamil Nadu": {
      temperature: 33.1,
      rainfall: 850,
      humidity: 70,
      wind_speed: 18.5,
      "soil_moisture": 35,
    },
    "Uttar Pradesh": {
      temperature: 35.6,
      rainfall: 780,
      humidity: 55,
      wind_speed: 9.2,
      "soil_moisture": 38,
    },
    "West Bengal": {
      temperature: 32.0,
      rainfall: 1600,
      humidity: 82,
      wind_speed: 11.4,
      "soil_moisture": 58,
    },
    "Gujarat": {
      temperature: 34.5,
      rainfall: 720,
      humidity: 58,
      wind_speed: 15.1,
      "soil_moisture": 25,
    },
  };

  const regionData = baseValues[region] || baseValues["All-India"];
  const base = regionData[parameter] || 50;
  const variation = (Math.random() - 0.5) * base * 0.1;
  return Math.round((base + variation) * 100) / 100;
}

const units: Record<string, string> = {
  temperature: "°C",
  rainfall: "mm",
  humidity: "%",
  wind_speed: "km/h",
  soil_moisture: "%",
};

export const climateRouter = createRouter({
  getSnapshots: publicQuery
    .input(
      z.object({
        region: z.string().optional(),
        parameter: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      const conditions = [];
      if (input.region) {
        conditions.push(eq(climateSnapshots.region, input.region));
      }
      if (input.parameter) {
        conditions.push(eq(climateSnapshots.parameter, input.parameter));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await getDb()
        .select()
        .from(climateSnapshots)
        .where(where)
        .orderBy(desc(climateSnapshots.timestamp))
        .limit(input.limit);

      // If no data in DB, return synthetic data
      if (rows.length === 0) {
        const regions = input.region
          ? [input.region]
          : ["All-India", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal"];
        const parameters = input.parameter
          ? [input.parameter]
          : ["temperature", "rainfall", "humidity"];

        return regions.flatMap((r) =>
          parameters.map((p) => ({
            id: 0,
            region: r,
            parameter: p,
            value: String(generateSyntheticData(r, p)),
            unit: units[p] || "",
            latitude: null,
            longitude: null,
            source: "simulated" as const,
            timestamp: new Date(),
            createdAt: new Date(),
          }))
        );
      }

      return rows;
    }),

  getNationalOverview: publicQuery.query(async () => {
    const regions = ["All-India", "Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore"];
    const parameters = ["temperature", "rainfall", "humidity"];

    return regions.map((region) => ({
      region,
      data: parameters.map((param) => ({
        parameter: param,
        value: generateSyntheticData(region, param),
        unit: units[param] || "",
      })),
    }));
  }),

  getRegionalData: publicQuery
    .input(z.object({ region: z.string(), parameters: z.array(z.string()).optional() }))
    .query(async ({ input }) => {
      const params = input.parameters || ["temperature", "rainfall", "humidity", "wind_speed", "soil_moisture"];

      return params.map((param) => ({
        parameter: param,
        value: generateSyntheticData(input.region, param),
        unit: units[param] || "",
        forecast: Array.from({ length: 7 }, (_, i) => ({
          day: `Day ${i + 1}`,
          value: Math.round((generateSyntheticData(input.region, param) + (Math.random() - 0.5) * 5) * 100) / 100,
        })),
      }));
    }),

  createSnapshot: publicQuery
    .input(
      z.object({
        region: z.string(),
        parameter: z.string(),
        value: z.number(),
        unit: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await getDb().insert(climateSnapshots).values(input);
      return { success: true };
    }),
});
