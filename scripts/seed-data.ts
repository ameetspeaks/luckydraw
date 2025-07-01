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

  console.log("Database seeded successfully!");
  process.exit(0);
}

seedDatabase().catch(console.error);