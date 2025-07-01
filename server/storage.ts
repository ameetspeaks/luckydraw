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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private draws: Map<number, Draw> = new Map();
  private participations: Map<number, Participation> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private winners: Map<number, Winner> = new Map();
  
  private drawIdCounter = 1;
  private participationIdCounter = 1;
  private transactionIdCounter = 1;
  private winnerIdCounter = 1;

  constructor() {
    // Initialize with sample draws
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample active draws
    const now = new Date();
    const todayEvening = new Date(now);
    todayEvening.setHours(18, 0, 0, 0);
    
    const weekendDraw = new Date(now);
    weekendDraw.setDate(now.getDate() + (6 - now.getDay())); // Next Saturday
    weekendDraw.setHours(20, 0, 0, 0);

    this.draws.set(1, {
      id: 1,
      title: "Today's Mega Draw",
      description: "iPhone 15 Pro Max",
      prizeAmount: "25000",
      entryFee: 50,
      maxParticipants: 2000,
      currentParticipants: 1247,
      drawTime: todayEvening,
      isActive: true,
      isCompleted: false,
      winnerId: null,
      prizeImageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      createdAt: new Date(),
    });

    this.draws.set(2, {
      id: 2,
      title: "Evening Special",
      description: "Cash Prize",
      prizeAmount: "50000",
      entryFee: 100,
      maxParticipants: 1000,
      currentParticipants: 652,
      drawTime: todayEvening,
      isActive: true,
      isCompleted: false,
      winnerId: null,
      prizeImageUrl: null,
      createdAt: new Date(),
    });

    this.draws.set(3, {
      id: 3,
      title: "Weekend Jackpot",
      description: "Mega Cash Prize",
      prizeAmount: "100000",
      entryFee: 200,
      maxParticipants: 500,
      currentParticipants: 127,
      drawTime: weekendDraw,
      isActive: true,
      isCompleted: false,
      winnerId: null,
      prizeImageUrl: null,
      createdAt: new Date(),
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      ...userData,
      coinBalance: existingUser?.coinBalance ?? 100, // Welcome bonus
      totalParticipations: existingUser?.totalParticipations ?? 0,
      totalWins: existingUser?.totalWins ?? 0,
      totalEarnings: existingUser?.totalEarnings ?? "0",
      currentStreak: existingUser?.currentStreak ?? 0,
      lastCheckIn: existingUser?.lastCheckIn ?? null,
      isVip: existingUser?.isVip ?? false,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserCoins(userId: string, amount: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    user.coinBalance = Math.max(0, user.coinBalance + amount);
    user.updatedAt = new Date();
    this.users.set(userId, user);
    return user;
  }

  async updateUserStats(userId: string, stats: Partial<Pick<User, 'totalParticipations' | 'totalWins' | 'totalEarnings'>>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    Object.assign(user, stats);
    user.updatedAt = new Date();
    this.users.set(userId, user);
    return user;
  }

  async updateUserStreak(userId: string, streak: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    user.currentStreak = streak;
    user.lastCheckIn = new Date();
    user.updatedAt = new Date();
    this.users.set(userId, user);
    return user;
  }

  // Draw operations
  async createDraw(drawData: InsertDraw): Promise<Draw> {
    const draw: Draw = {
      id: this.drawIdCounter++,
      ...drawData,
      currentParticipants: 0,
      isCompleted: false,
      winnerId: null,
      createdAt: new Date(),
    };
    this.draws.set(draw.id, draw);
    return draw;
  }

  async getAllActiveDraws(): Promise<Draw[]> {
    return Array.from(this.draws.values()).filter(draw => draw.isActive && !draw.isCompleted);
  }

  async getDrawById(id: number): Promise<Draw | undefined> {
    return this.draws.get(id);
  }

  async updateDrawParticipants(drawId: number, count: number): Promise<Draw> {
    const draw = this.draws.get(drawId);
    if (!draw) throw new Error("Draw not found");
    
    draw.currentParticipants = count;
    this.draws.set(drawId, draw);
    return draw;
  }

  async completeDraw(drawId: number, winnerId: string): Promise<Draw> {
    const draw = this.draws.get(drawId);
    if (!draw) throw new Error("Draw not found");
    
    draw.isCompleted = true;
    draw.winnerId = winnerId;
    this.draws.set(drawId, draw);
    return draw;
  }

  // Participation operations
  async createParticipation(participationData: InsertParticipation): Promise<Participation> {
    const participation: Participation = {
      id: this.participationIdCounter++,
      ...participationData,
      participatedAt: new Date(),
    };
    this.participations.set(participation.id, participation);
    return participation;
  }

  async getUserParticipations(userId: string): Promise<Participation[]> {
    return Array.from(this.participations.values()).filter(p => p.userId === userId);
  }

  async getDrawParticipations(drawId: number): Promise<Participation[]> {
    return Array.from(this.participations.values()).filter(p => p.drawId === drawId);
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.transactionIdCounter++,
      ...transactionData,
      createdAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  // Winner operations
  async createWinner(winnerData: InsertWinner): Promise<Winner> {
    const winner: Winner = {
      id: this.winnerIdCounter++,
      ...winnerData,
      announcedAt: new Date(),
    };
    this.winners.set(winner.id, winner);
    return winner;
  }

  async getRecentWinners(limit = 10): Promise<(Winner & { user: User; draw: Draw })[]> {
    const recentWinners = Array.from(this.winners.values())
      .sort((a, b) => b.announcedAt!.getTime() - a.announcedAt!.getTime())
      .slice(0, limit);

    return recentWinners.map(winner => {
      const user = this.users.get(winner.userId);
      const draw = this.draws.get(winner.drawId);
      return {
        ...winner,
        user: user!,
        draw: draw!,
      };
    });
  }
}

export const storage = new MemStorage();
