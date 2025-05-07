import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Define application schema
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  about: text("about").notNull(),
  whyJoin: text("why_join").notNull(),
  timezone: text("timezone").notNull(),
  activityLevel: text("activity_level").notNull(),
  professionalism: integer("professionalism").notNull(),
  joke: text("joke").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schema for application
export const insertApplicationSchema = z.object({
  username: z.string().min(2),
  about: z.string().min(10),
  whyJoin: z.string().min(10),
  timezone: z.string(),
  activityLevel: z.string(),
  professionalism: z.number().min(1).max(10),
  joke: z.string().min(2),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
