import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function seedDatabase() {
  console.log("Seeding database with sample draws...");

  // Clear existing draws
  await db.delete(schema.draws);

  // Add sample draws
  const now = new Date();
  const todayEvening = new Date(now);
  todayEvening.setHours(18, 0, 0, 0);
  
  const tomorrowMorning = new Date(now);
  tomorrowMorning.setDate(now.getDate() + 1);
  tomorrowMorning.setHours(10, 0, 0, 0);
  
  const weekendDraw = new Date(now);
  weekendDraw.setDate(now.getDate() + (6 - now.getDay())); // Next Saturday
  weekendDraw.setHours(20, 0, 0, 0);

  const sampleDraws = [
    {
      title: "Today's Mega Draw",
      description: "iPhone 15 Pro Max",
      prizeAmount: "25000",
      entryFee: 50,
      maxParticipants: 2000,
      currentParticipants: 1247,
      drawTime: todayEvening,
      isActive: true,
      prizeImageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
    {
      title: "Morning Special",
      description: "Cash Prize",
      prizeAmount: "50000",
      entryFee: 100,
      maxParticipants: 1000,
      currentParticipants: 652,
      drawTime: tomorrowMorning,
      isActive: true,
      prizeImageUrl: null,
    },
    {
      title: "Weekend Jackpot",
      description: "Mega Cash Prize",
      prizeAmount: "100000",
      entryFee: 200,
      maxParticipants: 500,
      currentParticipants: 127,
      drawTime: weekendDraw,
      isActive: true,
      prizeImageUrl: null,
    },
    {
      title: "Lucky 7 Draw",
      description: "MacBook Pro",
      prizeAmount: "75000",
      entryFee: 75,
      maxParticipants: 1500,
      currentParticipants: 423,
      drawTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      isActive: true,
      prizeImageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&h=200",
    }
  ];

  for (const drawData of sampleDraws) {
    await db.insert(schema.draws).values(drawData);
  }

  // Create demo users for winners first
  const demoUsers = [
    {
      id: "demo-winner-1",
      email: "winner1@example.com",
      firstName: "Rahul",
      lastName: "Sharma",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      coins: 500,
      totalWins: 1,
      totalEarnings: "85000",
      isVip: false
    },
    {
      id: "demo-winner-2", 
      email: "winner2@example.com",
      firstName: "Priya",
      lastName: "Patel",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&h=100",
      coins: 750,
      totalWins: 2,
      totalEarnings: "145000",
      isVip: true
    },
    {
      id: "demo-winner-3",
      email: "winner3@example.com", 
      firstName: "Amit",
      lastName: "Kumar",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
      coins: 300,
      totalWins: 1,
      totalEarnings: "95000",
      isVip: false
    }
  ];

  // Insert demo users
  await db.insert(schema.users).values(demoUsers);

  // Add completed draws with winners for reels functionality
  const completedDraws = [
    {
      title: "Yesterday's Special",
      description: "iPhone 14 Pro",
      prizeAmount: "85000",
      entryFee: 80,
      maxParticipants: 800,
      currentParticipants: 800,
      drawTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      isActive: false,
      winnerId: "demo-winner-1",
      prizeImageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&h=200",
    },
    {
      title: "Weekend Blast",
      description: "Cash Prize Bonanza",
      prizeAmount: "60000",
      entryFee: 60,
      maxParticipants: 600,
      currentParticipants: 450,
      drawTime: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago
      isActive: false,
      winnerId: "demo-winner-2",
      prizeImageUrl: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=400&h=200",
    },
    {
      title: "Tech Gadget Draw",
      description: "MacBook Air M2",
      prizeAmount: "95000",
      entryFee: 90,
      maxParticipants: 777,
      currentParticipants: 777,
      drawTime: new Date(Date.now() - 72 * 60 * 60 * 1000), // 72 hours ago
      isActive: false,
      winnerId: "demo-winner-3",
      prizeImageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&h=200",
    }
  ];

  // Insert completed draws
  const insertedCompletedDraws = await db.insert(schema.draws).values(completedDraws).returning();
  
  // Create winner records
  const winnerRecords = insertedCompletedDraws.map((draw, index) => ({
    userId: `demo-winner-${index + 1}`,
    drawId: draw.id,
    prizeAmount: draw.prizeAmount,
    celebrationVideoUrl: null,
  }));

  await db.insert(schema.winners).values(winnerRecords);

  console.log("Database seeded successfully with draws and winners!");
  process.exit(0);
}

seedDatabase().catch(console.error);