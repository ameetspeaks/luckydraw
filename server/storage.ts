import {
  users,
  draws,
  participations,
  transactions,
  winners,
  type User,
  type UpsertUser,
  type Draw,
  type InsertDraw,
  type Participation,
  type InsertParticipation,
  type Transaction,
  type InsertTransaction,
  type Winner,
  type InsertWinner,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User coin operations
  updateUserCoins(userId: string, amount: number): Promise<User>;
  updateUserStats(userId: string, stats: Partial<Pick<User, 'totalParticipations' | 'totalWins' | 'totalEarnings'>>): Promise<User>;
  updateUserStreak(userId: string, streak: number): Promise<User>;
  
  // Draw operations
  createDraw(draw: InsertDraw): Promise<Draw>;
  getAllActiveDraws(): Promise<Draw[]>;
  getAllDraws(): Promise<Draw[]>;
  getDrawById(id: number): Promise<Draw | undefined>;
  updateDrawParticipants(drawId: number, count: number): Promise<Draw>;
  completeDraw(drawId: number, winnerId: string): Promise<Draw>;
  
  // Participation operations
  createParticipation(participation: InsertParticipation): Promise<Participation>;
  getUserParticipations(userId: string): Promise<Participation[]>;
  getDrawParticipations(drawId: number): Promise<Participation[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  
  // Winner operations
  createWinner(winner: InsertWinner): Promise<Winner>;
  getRecentWinners(limit?: number): Promise<(Winner & { user: User; draw: Draw })[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        coinBalance: userData.coinBalance || 100, // Welcome bonus
        totalParticipations: userData.totalParticipations || 0,
        totalWins: userData.totalWins || 0,
        totalEarnings: userData.totalEarnings || "0",
        currentStreak: userData.currentStreak || 0,
        lastCheckIn: userData.lastCheckIn || null,
        isVip: userData.isVip || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email || null,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User coin operations
  async updateUserCoins(userId: string, amount: number): Promise<User> {
    // Get current user first
    const currentUser = await this.getUser(userId);
    if (!currentUser) throw new Error("User not found");

    const newBalance = Math.max(0, currentUser.coinBalance + amount);
    
    const [user] = await db
      .update(users)
      .set({ 
        coinBalance: newBalance,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserStats(userId: string, stats: Partial<Pick<User, 'totalParticipations' | 'totalWins' | 'totalEarnings'>>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        ...stats,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserStreak(userId: string, streak: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        currentStreak: streak,
        lastCheckIn: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  // Draw operations
  async createDraw(drawData: InsertDraw): Promise<Draw> {
    const [draw] = await db
      .insert(draws)
      .values({
        ...drawData,
        description: drawData.description || null,
        maxParticipants: drawData.maxParticipants || null,
        prizeImageUrl: drawData.prizeImageUrl || null,
        currentParticipants: 0,
        isCompleted: false,
        winnerId: null,
        createdAt: new Date(),
      })
      .returning();
    return draw;
  }

  async getAllActiveDraws(): Promise<Draw[]> {
    return await db
      .select()
      .from(draws)
      .where(eq(draws.isActive, true));
  }

  async getAllDraws(): Promise<Draw[]> {
    return await db
      .select()
      .from(draws)
      .orderBy(desc(draws.createdAt));
  }

  async getDrawById(id: number): Promise<Draw | undefined> {
    const [draw] = await db.select().from(draws).where(eq(draws.id, id));
    return draw || undefined;
  }

  async updateDrawParticipants(drawId: number, count: number): Promise<Draw> {
    const [draw] = await db
      .update(draws)
      .set({ currentParticipants: count })
      .where(eq(draws.id, drawId))
      .returning();
    
    if (!draw) throw new Error("Draw not found");
    return draw;
  }

  async completeDraw(drawId: number, winnerId: string): Promise<Draw> {
    const [draw] = await db
      .update(draws)
      .set({ 
        isCompleted: true,
        winnerId: winnerId 
      })
      .where(eq(draws.id, drawId))
      .returning();
    
    if (!draw) throw new Error("Draw not found");
    return draw;
  }

  // Participation operations
  async createParticipation(participationData: InsertParticipation): Promise<Participation> {
    const [participation] = await db
      .insert(participations)
      .values({
        ...participationData,
        participatedAt: new Date(),
      })
      .returning();
    return participation;
  }

  async getUserParticipations(userId: string): Promise<Participation[]> {
    return await db
      .select()
      .from(participations)
      .where(eq(participations.userId, userId));
  }

  async getDrawParticipations(drawId: number): Promise<Participation[]> {
    return await db
      .select()
      .from(participations)
      .where(eq(participations.drawId, drawId));
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...transactionData,
        relatedDrawId: transactionData.relatedDrawId || null,
        createdAt: new Date(),
      })
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(transactions.createdAt);
  }

  // Winner operations
  async createWinner(winnerData: InsertWinner): Promise<Winner> {
    const [winner] = await db
      .insert(winners)
      .values({
        ...winnerData,
        celebrationVideoUrl: winnerData.celebrationVideoUrl || null,
        announcedAt: new Date(),
      })
      .returning();
    return winner;
  }

  async getRecentWinners(limit = 10): Promise<(Winner & { user: User; draw: Draw })[]> {
    const results = await db
      .select({
        winner: winners,
        user: users,
        draw: draws,
      })
      .from(winners)
      .innerJoin(users, eq(winners.userId, users.id))
      .innerJoin(draws, eq(winners.drawId, draws.id))
      .orderBy(winners.announcedAt)
      .limit(limit);

    return results.map(({ winner, user, draw }) => ({
      ...winner,
      user,
      draw,
    }));
  }
}

export const storage = new DatabaseStorage();
