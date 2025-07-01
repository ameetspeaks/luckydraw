import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import CountdownTimer from "@/components/countdown-timer";
import DrawCard from "@/components/draw-card";
import CoinBalance from "@/components/coin-balance";
import BottomNavigation from "@/components/bottom-navigation";
import WinnerModal from "@/components/winner-modal";
import { Bell, Gift, Users, Trophy, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, isLoading: userLoading } = useAuth();
  const { toast } = useToast();
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const { data: draws, isLoading: drawsLoading } = useQuery({
    queryKey: ["/api/draws"],
    retry: false,
  });

  const { data: winners } = useQuery({
    queryKey: ["/api/winners"],
    retry: false,
  });

  const handleParticipate = async (drawId: number, entryFee: number) => {
    try {
      await apiRequest("POST", "/api/participations", {
        drawId,
        coinsSpent: entryFee,
      });
      
      toast({
        title: "Success!",
        description: "You've successfully joined the draw!",
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await apiRequest("POST", "/api/checkin", {});
      const data = await response.json();
      
      toast({
        title: "Check-in Success!",
        description: `You earned ${data.bonusCoins} coins! Streak: ${data.newStreak} days`,
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  if (userLoading || drawsLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-black">
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-16 bg-gray-800 rounded-xl"></div>
          <div className="h-48 bg-gray-800 rounded-xl"></div>
          <div className="h-24 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!user || !draws) return null;

  const activeDraws = draws || [];
  const currentDraw = activeDraws[0];

  // Check if user can check in today
  const canCheckIn = !user.lastCheckIn || 
    new Date(user.lastCheckIn).toDateString() !== new Date().toDateString();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="glass-card px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img 
            src={user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
          />
          <div>
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-400">{user.isVip ? 'VIP Member' : 'Member'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <CoinBalance balance={user.coinBalance} />
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Hero Section - Active Draw */}
        {currentDraw && (
          <section className="px-4 py-6">
            <DrawCard 
              draw={currentDraw}
              onParticipate={() => handleParticipate(currentDraw.id, currentDraw.entryFee)}
              userBalance={user.coinBalance}
              showTimer={true}
            />
          </section>
        )}

        {/* Quick Stats */}
        <section className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-blue-400">{user.totalParticipations}</div>
                <div className="text-xs text-gray-400">Participated</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-green-400">{user.totalWins}</div>
                <div className="text-xs text-gray-400">Won</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-pink-400">₹{user.totalEarnings}</div>
                <div className="text-xs text-gray-400">Earned</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Winners */}
        {winners && winners.length > 0 && (
          <section className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Winners</h3>
              <Button variant="ghost" size="sm" className="text-blue-400">
                View All
              </Button>
            </div>
            
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {winners.slice(0, 5).map((winner: any) => (
                <Card key={winner.id} className="glass-card min-w-[200px] relative">
                  <CardContent className="p-4">
                    <div className="absolute top-2 right-2">
                      <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={winner.user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50"} 
                        alt="Winner" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{winner.user.firstName} {winner.user.lastName?.charAt(0)}.</p>
                        <p className="text-xs text-gray-400">
                          {new Date(winner.announcedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-pink-400 font-bold">₹{winner.prizeAmount}</p>
                      <p className="text-xs text-gray-400">{winner.draw.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Draws */}
        <section className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Upcoming Draws</h3>
          <div className="space-y-3">
            {activeDraws.slice(1).map((draw: any) => (
              <Card key={draw.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{draw.title}</h4>
                      <p className="text-sm text-gray-400">Entry: {draw.entryFee} coins</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-400">₹{draw.prizeAmount}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(draw.drawTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(draw.currentParticipants / (draw.maxParticipants || 1000)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {draw.currentParticipants}/{draw.maxParticipants || 1000} participants
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Daily Check-in */}
        <section className="px-4 mb-6">
          <Card className="gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Daily Check-in</h3>
                  <p className="text-sm text-gray-400">
                    Streak: <span className="text-green-400 font-semibold">{user.currentStreak}</span> days
                  </p>
                </div>
                <Button 
                  onClick={handleCheckIn}
                  disabled={!canCheckIn}
                  className="gradient-primary disabled:opacity-50"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {canCheckIn ? 'Claim 25 Coins' : 'Claimed'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNavigation />
      <WinnerModal 
        isOpen={showWinnerModal} 
        onClose={() => setShowWinnerModal(false)}
        prize="₹25,000"
        drawTitle="Evening Draw"
      />
    </div>
  );
}
