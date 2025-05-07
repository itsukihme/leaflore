import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Discord Moderator Application Schema
export const moderatorApplications = pgTable("moderator_applications", {
  id: serial("id").primaryKey(),
  discordUsername: text("discord_username").notNull(),
  aboutYourself: text("about_yourself").notNull(),
  whyJoin: text("why_join").notNull(),
  timezone: text("timezone").notNull(),
  activityLevel: text("activity_level").notNull(),
  professionalism: integer("professionalism").notNull(),
  joke: text("joke").notNull(),
  submittedAt: text("submitted_at").notNull(),
});

export const moderatorApplicationSchema = createInsertSchema(moderatorApplications).omit({
  id: true,
  submittedAt: true,
});

export const insertModeratorApplicationSchema = moderatorApplicationSchema.extend({
  professionalism: z.coerce.number().min(1).max(10),
});

export type InsertModeratorApplication = z.infer<typeof insertModeratorApplicationSchema>;
export type ModeratorApplication = typeof moderatorApplications.$inferSelect;
