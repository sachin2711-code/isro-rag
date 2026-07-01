import { climateRouter } from "./routers/climate";
import { simulationRouter } from "./routers/simulation";
import { aiRouter } from "./routers/ai";
import { alertsRouter } from "./routers/alerts";
import { contactRouter } from "./routers/contact";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  climate: climateRouter,
  simulation: simulationRouter,
  ai: aiRouter,
  alerts: alertsRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;