import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const climateSnapshots = mysqlTable("climate_snapshots", {
  id: serial("id").primaryKey(),
  region: varchar("region", { length: 100 }).notNull(),
  parameter: varchar("parameter", { length: 50 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  source: varchar("source", { length: 50 }).notNull().default("simulated"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ClimateSnapshot = typeof climateSnapshots.$inferSelect;

export const simulationRuns = mysqlTable("simulation_runs", {
  id: serial("id").primaryKey(),
  simulationType: varchar("simulation_type", { length: 50 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  parameters: json("parameters"),
  status: mysqlEnum("status", ["running", "completed", "failed"]).default("running").notNull(),
  results: json("results"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SimulationRun = typeof simulationRuns.$inferSelect;

export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;

export const alerts = mysqlTable("alerts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).notNull(),
  sector: mysqlEnum("sector", ["agriculture", "water", "urban", "general"]).notNull(),
  region: varchar("region", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Alert = typeof alerts.$inferSelect;

export const contactSubmissions = mysqlTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 100 }),
  sector: varchar("sector", { length: 50 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;