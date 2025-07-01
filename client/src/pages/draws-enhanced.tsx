import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import DrawCard from "@/components/draw-card";
import BottomNavigation from "@/components/bottom-navigation";
import CoinBalance from "@/components/coin-balance";
import { 
  ArrowLeft, 
  Clock, 
  Trophy, 
  Users, 
  Calendar, 
  Target, 
  Gift, 
  ChevronLeft, 
  ChevronRight,
  Play,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useLocation } from "wouter";

interface Draw {
  id: number;
  title: string;
  description?: string;
  prizeAmount: string;
  entryFee: number;
  maxParticipants?: number;
  currentParticipants: number;
  drawTime: string;
  prizeImageUrl?: string;
  isActive: boolean;
  winnerId?: string;
}

interface Participation {
  id: number;
  userId: string;
  drawId: number;
  participatedAt: string;
}

export default function DrawsEnhanced() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("live");
  const [currentPage, setCurrentPage] = useState(1);
  const drawsPerPage = 5;
  const queryClient = useQueryClient();

  // Fetch all draws
  const { data: allDraws = [], isLoading } = useQuery({
    queryKey: ["/api/draws/all"],
    queryFn: async () => {
      const response = await fetch("/api/draws/all");
      if (!response.ok) throw new Error("Failed to fetch draws");
      return response.json() as Draw[];
    },
    retry: false,
  });

  // Fetch user participations
  const { data: participations = [] } = useQuery({
    queryKey: ["/api/participations"],
    retry: false,
  }) as { data: Participation[] };

  // Filter draws based on active tab
  const getFilteredDraws = (): Draw[] => {
    const now = new Date();
    switch (activeTab) {
      case "live":
        return allDraws.filter((draw: Draw) => 
          draw.isActive && new Date(draw.drawTime) > now
        );
      case "past":
        return allDraws.filter((draw: Draw) => 
          !draw.isActive || new Date(draw.drawTime) <= now
        );
      case "my":
        const myDrawIds = participations.map((p: Participation) => p.drawId);
        return allDraws.filter((draw: Draw) => 
          myDrawIds.includes(draw.id)
        );
      default:
        return [];
    }
  };

  const filteredDraws = getFilteredDraws();
  const totalPages = Math.ceil(filteredDraws.length / drawsPerPage);
  const paginatedDraws = filteredDraws.slice(
    (currentPage - 1) * drawsPerPage,
    currentPage * drawsPerPage
  );

  // Participation mutation
  const participateMutation = useMutation({
    mutationFn: async ({ drawId, entryFee }: { drawId: number; entryFee: number }) => {
      return apiRequest("POST", "/api/participations", {
        drawId,
        coinsSpent: entryFee,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/participations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success!",
        description: "You've successfully joined the draw!",
      });
    },
    onError: (error) => {
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
        description: (error as Error).message || "Failed to join draw",
        variant: "destructive",
      });
    },
  });

  const handleParticipate = (drawId: number, entryFee: number) => {
    if (!user?.coinBalance || user.coinBalance < entryFee) {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins to participate in this draw.",
        variant: "destructive",
      });
      return;
    }
    participateMutation.mutate({ drawId, entryFee });
  };

  const getTimeUntilDraw = (drawTime: string) => {
    const now = new Date();
    const draw = new Date(drawTime);
    const diff = draw.getTime() - now.getTime();
    
    if (diff <= 0) return "Draw ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const isUserParticipated = (drawId: number) => {
    return participations.some((p: Participation) => p.drawId === drawId);
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Lucky Draws
          </h1>
          <CoinBalance balance={user.coinBalance || 0} className="text-sm" />
        </div>
      </header>

      <div className="p-4 pb-24">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
            <TabsTrigger 
              value="live" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Live ({allDraws.filter(d => d.isActive && new Date(d.drawTime) > new Date()).length})
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Past ({allDraws.filter(d => !d.isActive || new Date(d.drawTime) <= new Date()).length})
            </TabsTrigger>
            <TabsTrigger 
              value="my"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              My ({participations.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="live" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Live Draws</h2>
                <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                  {filteredDraws.length} Active
                </Badge>
              </div>
              {isLoading ? (
                <div className="text-center py-8">Loading draws...</div>
              ) : filteredDraws.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Live Draws</h3>
                    <p className="text-gray-400">Check back soon for new exciting draws!</p>
                  </CardContent>
                </Card>
              ) : (
                paginatedDraws.map((draw) => (
                  <Card key={draw.id} className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white">{draw.title}</h3>
                          <p className="text-gray-300 text-sm">{draw.description}</p>
                        </div>
                        <Badge className="bg-green-600 text-white">
                          Live
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
                          <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                          <div className="text-lg font-bold text-white">₹{parseFloat(draw.prizeAmount).toLocaleString()}</div>
                          <div className="text-xs text-yellow-200">Prize</div>
                        </div>
                        <div className="text-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                          <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                          <div className="text-lg font-bold text-white">{draw.currentParticipants}</div>
                          <div className="text-xs text-blue-200">Participants</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-400">Ends in: </span>
                          <span className="text-orange-400 font-semibold">{getTimeUntilDraw(draw.drawTime)}</span>
                        </div>
                        <Button
                          onClick={() => handleParticipate(draw.id, draw.entryFee)}
                          disabled={participateMutation.isPending || isUserParticipated(draw.id)}
                          className={`${
                            isUserParticipated(draw.id) 
                              ? 'bg-gray-600 hover:bg-gray-700' 
                              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                          }`}
                          size="sm"
                        >
                          {isUserParticipated(draw.id) ? 
                            <><CheckCircle className="w-4 h-4 mr-1" /> Joined</> : 
                            `Join (${draw.entryFee} coins)`
                          }
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Past Draws</h2>
                <Badge variant="secondary" className="bg-gray-600/20 text-gray-400">
                  {filteredDraws.length} Completed
                </Badge>
              </div>
              {filteredDraws.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Past Draws</h3>
                    <p className="text-gray-400">Participate in live draws to see history here!</p>
                  </CardContent>
                </Card>
              ) : (
                paginatedDraws.map((draw) => (
                  <Card key={draw.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/30">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white">{draw.title}</h3>
                          <p className="text-gray-300 text-sm">{draw.description}</p>
                        </div>
                        <Badge className="bg-gray-600 text-white">
                          {draw.winnerId ? 'Completed' : 'Ended'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
                          <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                          <div className="text-lg font-bold text-white">₹{parseFloat(draw.prizeAmount).toLocaleString()}</div>
                          <div className="text-xs text-yellow-200">Prize</div>
                        </div>
                        <div className="text-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                          <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                          <div className="text-lg font-bold text-white">{draw.currentParticipants}</div>
                          <div className="text-xs text-blue-200">Final Count</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-400">Ended: </span>
                          <span className="text-gray-300">
                            {new Date(draw.drawTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {draw.winnerId ? (
                            <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 mr-1" />
                          )}
                          <span className="text-sm text-gray-300">
                            {draw.winnerId ? 'Winner Selected' : 'No Winner'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Draws</h2>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
                  {filteredDraws.length} Joined
                </Badge>
              </div>
              {filteredDraws.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Participations Yet</h3>
                    <p className="text-gray-400 mb-4">Join some draws to see them here!</p>
                    <Button 
                      onClick={() => setActiveTab("live")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Explore Live Draws
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                paginatedDraws.map((draw) => {
                  const isLive = draw.isActive && new Date(draw.drawTime) > new Date();
                  return (
                    <Card key={draw.id} className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-white">{draw.title}</h3>
                            <p className="text-gray-300 text-sm">{draw.description}</p>
                          </div>
                          <Badge className={isLive ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                            {isLive ? 'Live' : 'Ended'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center p-2 bg-yellow-600/20 rounded border border-yellow-500/30">
                            <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                            <div className="text-sm font-bold text-white">₹{parseFloat(draw.prizeAmount).toLocaleString()}</div>
                            <div className="text-xs text-yellow-200">Prize</div>
                          </div>
                          <div className="text-center p-2 bg-blue-600/20 rounded border border-blue-500/30">
                            <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div className="text-sm font-bold text-white">{draw.currentParticipants}</div>
                            <div className="text-xs text-blue-200">Total</div>
                          </div>
                          <div className="text-center p-2 bg-purple-600/20 rounded border border-purple-500/30">
                            <CheckCircle className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                            <div className="text-sm font-bold text-white">Joined</div>
                            <div className="text-xs text-purple-200">Status</div>
                          </div>
                        </div>

                        <div className="text-center text-sm">
                          {isLive ? (
                            <span className="text-orange-400">
                              Ends in {getTimeUntilDraw(draw.drawTime)}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Ended {new Date(draw.drawTime).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
}