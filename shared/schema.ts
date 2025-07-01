import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  coinBalance: integer("coin_balance").default(0).notNull(),
  totalParticipations: integer("total_participations").default(0).notNull(),
  totalWins: integer("total_wins").default(0).notNull(),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0").notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  lastCheckIn: timestamp("last_check_in"),
  isVip: boolean("is_vip").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lucky draws table
export const draws = pgTable("draws", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  prizeAmount: decimal("prize_amount", { precision: 10, scale: 2 }).notNull(),
  entryFee: integer("entry_fee").notNull(), // in coins
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0).notNull(),
  drawTime: timestamp("draw_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  winnerId: varchar("winner_id").references(() => users.id),
  prizeImageUrl: varchar("prize_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User participations in draws
export const participations = pgTable("participations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  drawId: integer("draw_id").references(() => draws.id).notNull(),
  coinsSpent: integer("coins_spent").notNull(),
  participatedAt: timestamp("participated_at").defaultNow(),
});

// Coin transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // 'purchase', 'spend', 'earn', 'daily_bonus'
  amount: integer("amount").notNull(),
  description: varchar("description").notNull(),
  relatedDrawId: integer("related_draw_id").references(() => draws.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Winner announcements
export const winners = pgTable("winners", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  drawId: integer("draw_id").references(() => draws.id).notNull(),
  prizeAmount: decimal("prize_amount", { precision: 10, scale: 2 }).notNull(),
  announcedAt: timestamp("announced_at").defaultNow(),
  celebrationVideoUrl: varchar("celebration_video_url"),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertDrawSchema = createInsertSchema(draws).omit({
  id: true,
  currentParticipants: true,
  isCompleted: true,
  winnerId: true,
  createdAt: true,
});

export const insertParticipationSchema = createInsertSchema(participations).omit({
  id: true,
  participatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertWinnerSchema = createInsertSchema(winners).omit({
  id: true,
  announcedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Draw = typeof draws.$inferSelect;
export type InsertDraw = z.infer<typeof insertDrawSchema>;
export type Participation = typeof participations.$inferSelect;
export type InsertParticipation = z.infer<typeof insertParticipationSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Winner = typeof winners.$inferSelect;
export type InsertWinner = z.infer<typeof insertWinnerSchema>;
