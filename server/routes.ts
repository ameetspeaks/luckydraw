import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertDrawSchema, 
  insertParticipationSchema, 
  insertTransactionSchema,
  insertWinnerSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Draw routes
  app.get('/api/draws', async (req, res) => {
    try {
      const draws = await storage.getAllActiveDraws();
      res.json(draws);
    } catch (error) {
      console.error("Error fetching draws:", error);
      res.status(500).json({ message: "Failed to fetch draws" });
    }
  });

  app.get('/api/draws/:id', async (req, res) => {
    try {
      const drawId = parseInt(req.params.id);
      const draw = await storage.getDrawById(drawId);
      if (!draw) {
        return res.status(404).json({ message: "Draw not found" });
      }
      res.json(draw);
    } catch (error) {
      console.error("Error fetching draw:", error);
      res.status(500).json({ message: "Failed to fetch draw" });
    }
  });

  app.post('/api/draws', isAuthenticated, async (req, res) => {
    try {
      const drawData = insertDrawSchema.parse(req.body);
      const draw = await storage.createDraw(drawData);
      res.json(draw);
    } catch (error) {
      console.error("Error creating draw:", error);
      res.status(500).json({ message: "Failed to create draw" });
    }
  });

  // Participation routes
  app.post('/api/participations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { drawId, coinsSpent } = req.body;
      
      // Debug logging
      console.log("Participation request:", { userId, drawId, coinsSpent, userExists: !!req.user });
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Validate input manually since we add userId from auth context
      if (!drawId || typeof drawId !== 'number') {
        return res.status(400).json({ message: "Invalid draw ID" });
      }
      if (!coinsSpent || typeof coinsSpent !== 'number') {
        return res.status(400).json({ message: "Invalid coins amount" });
      }
      
      // Check if user has enough coins
      const user = await storage.getUser(userId);
      if (!user || user.coinBalance < coinsSpent) {
        return res.status(400).json({ message: "Insufficient coins" });
      }

      // Check if draw exists and is active
      const draw = await storage.getDrawById(drawId);
      if (!draw || !draw.isActive || draw.isCompleted) {
        return res.status(400).json({ message: "Draw is not available" });
      }

      // Check if draw is full
      if (draw.maxParticipants && draw.currentParticipants >= draw.maxParticipants) {
        return res.status(400).json({ message: "Draw is full" });
      }

      // Create participation
      const participation = await storage.createParticipation({
        userId,
        drawId,
        coinsSpent,
      });

      // Update user coins and stats
      await storage.updateUserCoins(userId, -coinsSpent);
      await storage.updateUserStats(userId, { 
        totalParticipations: user.totalParticipations + 1 
      });

      // Update draw participant count
      await storage.updateDrawParticipants(drawId, draw.currentParticipants + 1);

      // Create transaction record
      await storage.createTransaction({
        userId,
        type: 'spend',
        amount: coinsSpent,
        description: `Participated in ${draw.title}`,
        relatedDrawId: drawId,
      });

      res.json(participation);
    } catch (error) {
      console.error("Error creating participation:", error);
      res.status(500).json({ message: "Failed to participate in draw" });
    }
  });

  app.get('/api/participations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const participations = await storage.getUserParticipations(userId);
      res.json(participations);
    } catch (error) {
      console.error("Error fetching participations:", error);
      res.status(500).json({ message: "Failed to fetch participations" });
    }
  });

  // Coin purchase routes
  app.post('/api/coins/purchase', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount, cost } = req.body;

      // Mock payment processing - in real app, integrate with payment gateway
      // For now, we'll just add the coins
      await storage.updateUserCoins(userId, amount);

      // Create transaction record
      await storage.createTransaction({
        userId,
        type: 'purchase',
        amount,
        description: `Purchased ${amount} coins for ₹${cost}`,
      });

      const user = await storage.getUser(userId);
      res.json({ success: true, newBalance: user?.coinBalance });
    } catch (error) {
      console.error("Error purchasing coins:", error);
      res.status(500).json({ message: "Failed to purchase coins" });
    }
  });

  // Daily check-in
  app.post('/api/checkin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already checked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (user.lastCheckIn && user.lastCheckIn >= today) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      // Calculate streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = 1;
      if (user.lastCheckIn && user.lastCheckIn >= yesterday) {
        newStreak = user.currentStreak + 1;
      }

      // Calculate bonus coins (increasing with streak)
      const bonusCoins = Math.min(25 + Math.floor(newStreak / 7) * 5, 50);

      // Update user
      await storage.updateUserCoins(userId, bonusCoins);
      await storage.updateUserStreak(userId, newStreak);

      // Create transaction record
      await storage.createTransaction({
        userId,
        type: 'daily_bonus',
        amount: bonusCoins,
        description: `Daily check-in bonus (${newStreak} day streak)`,
      });

      res.json({ 
        success: true, 
        bonusCoins, 
        newStreak,
        newBalance: user.coinBalance + bonusCoins 
      });
    } catch (error) {
      console.error("Error processing check-in:", error);
      res.status(500).json({ message: "Failed to process check-in" });
    }
  });

  // Transaction history
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Recent winners
  app.get('/api/winners', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const winners = await storage.getRecentWinners(limit);
      res.json(winners);
    } catch (error) {
      console.error("Error fetching winners:", error);
      res.status(500).json({ message: "Failed to fetch winners" });
    }
  });

  // Draw winner selection (admin function - would be triggered by cron job)
  app.post('/api/draws/:id/select-winner', isAuthenticated, async (req: any, res) => {
    try {
      const drawId = parseInt(req.params.id);
      const draw = await storage.getDrawById(drawId);
      
      if (!draw || draw.isCompleted) {
        return res.status(400).json({ message: "Draw not available for winner selection" });
      }

      // Get all participants
      const participants = await storage.getDrawParticipations(drawId);
      if (participants.length === 0) {
        return res.status(400).json({ message: "No participants in this draw" });
      }

      // Random winner selection
      const randomIndex = Math.floor(Math.random() * participants.length);
      const winnerParticipation = participants[randomIndex];
      const winnerId = winnerParticipation.userId;

      // Complete the draw
      await storage.completeDraw(drawId, winnerId);

      // Create winner record
      const winner = await storage.createWinner({
        userId: winnerId,
        drawId,
        prizeAmount: draw.prizeAmount,
      });

      // Update winner's stats and earnings
      const winnerUser = await storage.getUser(winnerId);
      if (winnerUser) {
        await storage.updateUserStats(winnerId, {
          totalWins: winnerUser.totalWins + 1,
          totalEarnings: (parseFloat(winnerUser.totalEarnings) + parseFloat(draw.prizeAmount)).toString(),
        });
      }

      res.json({ winner, draw });
    } catch (error) {
      console.error("Error selecting winner:", error);
      res.status(500).json({ message: "Failed to select winner" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
