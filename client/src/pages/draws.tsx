import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import DrawCard from "@/components/draw-card";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft, Clock, Trophy, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Draws() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: draws, isLoading } = useQuery({
    queryKey: ["/api/draws"],
    retry: false,
  });

  const { data: participations } = useQuery({
    queryKey: ["/api/participations"],
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

  if (!user) return null;

  const activeDraws = draws || [];
  const userParticipations = participations || [];
  const participatedDrawIds = new Set(userParticipations.map((p: any) => p.drawId));

  // Categorize draws
  const liveDraws = activeDraws.filter((draw: any) => 
    new Date(draw.drawTime) > new Date() && draw.isActive && !draw.isCompleted
  );
  
  const upcomingDraws = liveDraws.filter((draw: any) => 
    new Date(draw.drawTime).getTime() - new Date().getTime() > 3600000 // More than 1 hour away
  );
  
  const endingSoonDraws = liveDraws.filter((draw: any) => 
    new Date(draw.drawTime).getTime() - new Date().getTime() <= 3600000 // Less than 1 hour away
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white">
      {/* Header */}
      <header className="glass-card px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Lucky Draws</h1>
        </div>
        <div className="text-sm text-gray-400">
          {activeDraws.length} Active
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="live">
              <Clock className="w-4 h-4 mr-2" />
              Live
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <Trophy className="w-4 h-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="my">
              <Users className="w-4 h-4 mr-2" />
              My Draws
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-800 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : endingSoonDraws.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-red-400 mb-4">⏰ Ending Soon</h2>
                {endingSoonDraws.map((draw: any) => (
                  <DrawCard
                    key={draw.id}
                    draw={draw}
                    onParticipate={() => handleParticipate(draw.id, draw.entryFee)}
                    userBalance={user.coinBalance}
                    showTimer={true}
                    isParticipated={participatedDrawIds.has(draw.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No draws ending soon</p>
                  <p className="text-sm text-gray-500">Check upcoming draws</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-800 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : upcomingDraws.length > 0 ? (
              <div className="space-y-4">
                {upcomingDraws.map((draw: any) => (
                  <DrawCard
                    key={draw.id}
                    draw={draw}
                    onParticipate={() => handleParticipate(draw.id, draw.entryFee)}
                    userBalance={user.coinBalance}
                    showTimer={false}
                    isParticipated={participatedDrawIds.has(draw.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No upcoming draws</p>
                  <p className="text-sm text-gray-500">New draws are added regularly</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-800 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : userParticipations.length > 0 ? (
              <div className="space-y-4">
                {userParticipations.map((participation: any) => {
                  const draw = activeDraws.find((d: any) => d.id === participation.drawId);
                  if (!draw) return null;
                  
                  return (
                    <Card key={participation.id} className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{draw.title}</h3>
                            <p className="text-sm text-gray-400">{draw.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-pink-400 font-bold">₹{draw.prizeAmount}</p>
                            <p className="text-xs text-green-400">Participated</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <p className="text-gray-400">Spent</p>
                            <p className="font-semibold">{participation.coinsSpent} coins</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Draw Time</p>
                            <p className="font-semibold">
                              {new Date(draw.drawTime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Status</p>
                            <p className={`font-semibold ${
                              draw.isCompleted ? 'text-gray-400' : 'text-yellow-400'
                            }`}>
                              {draw.isCompleted ? 'Completed' : 'Active'}
                            </p>
                          </div>
                        </div>
                        
                        {draw.winnerId && (
                          <div className="mt-3 p-2 bg-green-400/20 rounded-lg text-center">
                            <p className="text-green-400 text-sm">
                              {draw.winnerId === user.id ? '🎉 You Won!' : 'Draw Completed'}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No participations yet</p>
                  <p className="text-sm text-gray-500">Join a draw to see it here</p>
                  <Button 
                    onClick={() => setLocation("/")}
                    className="gradient-primary mt-4"
                  >
                    Browse Draws
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
}
