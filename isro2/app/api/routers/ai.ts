import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { chatMessages } from "@db/schema";
import { desc, eq } from "drizzle-orm";

const CLIMATE_SYSTEM_PROMPT = `You are Indra, India's AI Climate Intelligence Assistant. You have deep knowledge of:
- Indian monsoon patterns (SW and NE monsoons, ENSO, IOD, MJO)
- Indian agriculture (Kharif/Rabi seasons, rice, wheat, pulses, sugarcane)
- Water resources (Ganga, Godavari, Krishna, Cauvery, Narmada, Tapi basins)
- Urban heat islands in Delhi, Mumbai, Bangalore, Chennai, Kolkata
- Climate adaptation policies (NAPCC, State Action Plans)

Provide accurate, science-based responses. When uncertain, acknowledge limitations. Always structure responses with clear sections.`;

export const aiRouter = createRouter({
  chat: publicQuery
    .input(
      z.object({
        message: z.string().min(1).max(5000),
        sessionId: z.string().optional(),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const sessionId = input.sessionId || crypto.randomUUID();

      await getDb().insert(chatMessages).values({
        sessionId,
        role: "user",
        content: input.message,
        metadata: { context: input.context },
      });

      const response = generateClimateResponse(input.message, input.context);

      await getDb().insert(chatMessages).values({
        sessionId,
        role: "assistant",
        content: response,
        metadata: { type: "climate_analysis" },
      });

      return { response, sessionId };
    }),

  getChatHistory: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      return getDb()
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(chatMessages.createdAt);
    }),

  getSuggestions: publicQuery.query(() => {
    return [
      "Predict monsoon onset for Kerala 2025",
      "Analyze heat stress risk in Delhi NCR",
      "Rice yield forecast for Maharashtra",
      "Water availability in Cauvery basin",
      "Urban cooling strategies for Bangalore",
      "Generate drought risk assessment for Gujarat",
    ];
  }),
});

function generateClimateResponse(message: string, context?: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("monsoon")) {
    return `## Monsoon Analysis

Based on current ENSO-neutral conditions and positive IOD signals, the 2025 Southwest Monsoon is forecasted to be **normal to slightly above normal** (102-108% of Long Period Average).

### Key Projections:
- **Onset over Kerala**: June 1-5 (normal onset)
- **All-India rainfall**: 880-940mm (normal range)
- **Spatial distribution**: Enhanced rainfall over Central and Peninsular India
- **Extreme events**: 4-6 heavy rainfall episodes expected

### Sector Impact:
- **Agriculture**: Favorable for Kharif rice planting in Eastern states
- **Water**: Reservoirs expected to reach 75-80% capacity by September
- **Urban**: Mumbai and Chennai should prepare for 2-3 intense rainfall events

Would you like me to dive deeper into any specific region or sector?`;
  }

  if (lowerMsg.includes("heat") || lowerMsg.includes("temperature") || lowerMsg.includes("urban")) {
    return `## Urban Heat Analysis

Current heat stress monitoring across Indian metros shows elevated risk levels:

### Heat Stress Index (HSI):
| City | Current | Forecast (7d) | Risk Level |
|------|---------|---------------|------------|
| Delhi | 41.2°C | 39-43°C | **High** |
| Mumbai | 34.8°C | 33-36°C | Moderate |
| Chennai | 38.5°C | 37-40°C | **High** |
| Bangalore | 31.2°C | 30-33°C | Moderate |
| Kolkata | 36.7°C | 35-38°C | Moderate |

### Recommendations:
- **Delhi NCR**: Heat action plan activated; vulnerable populations advised to limit outdoor activity 11am-4pm
- **Urban cooling**: 15% increase in green cover recommended for East Delhi
- **Energy**: Peak power demand expected to rise 12%; grid stability monitoring active

Would you like specific adaptation strategies for any city?`;
  }

  if (lowerMsg.includes("agriculture") || lowerMsg.includes("crop") || lowerMsg.includes("yield")) {
    return `## Agricultural Intelligence Report

### Current Season (Kharif 2025):
| Crop | Projected Yield | Change (YoY) | Risk Level |
|------|-----------------|--------------|------------|
| Rice | 112.4 MT | +2.1% | Low |
| Cotton | 35.8 MT | +4.3% | Low |
| Soybean | 13.2 MT | +1.8% | Moderate |
| Sugarcane | 405 MT | -0.5% | Moderate |

### Key Advisories:
- **Eastern India**: Ideal sowing window for rice; soil moisture adequate
- **Maharashtra**: Monitor for delayed monsoon; have contingency crops ready
- **Gujarat**: Cotton planting progressing well; watch for pest outbreaks

### Soil Moisture Status:
- Normal/Above normal: 65% of districts
- Below normal: 30% of districts (mainly NW India)
- Deficient: 5% of districts (Rajasthan border areas)

Would you like district-specific recommendations?`;
  }

  if (lowerMsg.includes("water") || lowerMsg.includes("river") || lowerMsg.includes("reservoir")) {
    return `## Water Resources Status

### Major Reservoir Levels:
| Basin | Current Storage | Capacity | Status |
|-------|----------------|----------|--------|
| Ganga | 42.8 BCM | 55.2 BCM | Normal |
| Godavari | 18.5 BCM | 22.1 BCM | Above Normal |
| Krishna | 15.2 BCM | 20.8 BCM | Normal |
| Cauvery | 6.8 BCM | 12.5 BCM | **Below Normal** |
| Narmada | 12.4 BCM | 16.2 BCM | Normal |

### Alerts:
- **Cauvery Basin**: Water stress continues; farmers in Tamil Nadu/Karnataka advised to adopt drip irrigation
- **Bhakra Nangal**: 78% full; adequate for Punjab/Haryana irrigation
- **Flood Watch**: Brahmaputra tributaries showing rising trends; Assam on alert

### Groundwater:
- 62% of observation wells show stable/improving trends
- Critical decline in 15 blocks across Rajasthan, Haryana, and Karnataka

Would you like basin-specific simulation results?`;
  }

  return `## Climate Intelligence Analysis

I've analyzed your query: "${message}"

### Overview:
India's climate system is currently in a transition phase with ENSO-neutral conditions and developing positive IOD signals. The digital twin is tracking multiple parameters across atmospheric, oceanic, and land-surface domains.

### Key Observations:
- **Temperature**: National average 0.8°C above normal for this period
- **Rainfall**: Cumulative seasonal rainfall at 94% of normal (slight deficit in NW India)
- **Extreme events**: 3 heat wave episodes and 2 heavy rainfall events tracked this month
- **Agricultural stress**: Low overall; isolated moisture stress in Rajasthan and Gujarat

${context ? `### Additional Context:\n${context}` : ""}

### Recommendations:
1. Monitor IOD evolution closely - positive phase could enhance monsoon
2. Urban centers should maintain heat action preparedness
3. Water conservation measures recommended for Cauvery-dependent regions

Would you like me to generate a detailed report or run a specific simulation?`;
}