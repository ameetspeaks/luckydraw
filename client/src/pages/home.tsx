import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  Trophy, 
  Users, 
  Clock,
  Gift,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Star,
  Zap,
  Crown,
  PlayCircle,
  Calendar,
  Wallet,
  Award,
  ChevronRight,
  Flame,
  Gem
} from "lucide-react";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/bottom-navigation";
import CoinBalance from "@/components/coin-balance";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch recent draws
  const { data: draws = [] } = useQuery({
    queryKey: ["/api/draws"],
    retry: false,
  });

  // Fetch recent winners
  const { data: winners = [] } = useQuery({
    queryKey: ["/api/winners"],
    retry: false,
  });

  if (!user) return null;

  const activeDraws = draws.filter(draw => 
    draw.isActive && new Date(draw.drawTime) > new Date()
  );

  const getTimeUntilDraw = (drawTime: string) => {
    const now = new Date();
    const draw = new Date(drawTime);
    const diff = draw.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Premium Header with CRED-style design */}
      <header className="relative px-6 pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-indigo-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10">
          {/* User Greeting */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Lucky11
                </h1>
                {user.isVip && (
                  <Crown className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              <p className="text-gray-300 text-lg">
                Hello, {user.displayName || user.username}
              </p>
              <p className="text-gray-400 text-sm">Ready to win big today?</p>
            </div>
            
            {/* Premium Coin Balance */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{(user.coinBalance || 0).toLocaleString()}</div>
                  <div className="text-xs text-yellow-200">Coins</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CRED-style Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{user.totalWins || 0}</div>
                <div className="text-xs text-emerald-200 font-medium">Total Wins</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{user.totalParticipations || 0}</div>
                <div className="text-xs text-blue-200 font-medium">Entries</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{user.currentStreak || 0}</div>
                <div className="text-xs text-purple-200 font-medium">Streak</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      <div className="px-6 pb-24 space-y-8">
        {/* Premium Action Cards */}
        <section>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button
              onClick={() => setLocation("/earn")}
              className="h-24 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0 rounded-2xl shadow-lg shadow-orange-500/25 flex flex-col items-center justify-center space-y-2 transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-7 h-7" />
              <span className="font-semibold">Earn Coins</span>
              <span className="text-xs opacity-90">Daily rewards</span>
            </Button>
            
            <Button
              onClick={() => setLocation("/draws")}
              className="h-24 bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 rounded-2xl shadow-lg shadow-purple-500/25 flex flex-col items-center justify-center space-y-2 transition-all duration-300 hover:scale-105"
            >
              <Gem className="w-7 h-7" />
              <span className="font-semibold">Lucky Draws</span>
              <span className="text-xs opacity-90">Win big prizes</span>
            </Button>
          </div>
        </section>

        {/* Live Draws with Premium Design */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Live Draws
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/draws")}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {activeDraws.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">No Active Draws</h3>
                <p className="text-gray-400 mb-6">New exciting draws coming soon!</p>
                <Button 
                  onClick={() => setLocation("/draws")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl px-6"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Past Draws
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeDraws.slice(0, 2).map((draw) => (
                <Card key={draw.id} className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 rounded-2xl overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-xl text-white">{draw.title}</h3>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 rounded-lg">
                            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                            LIVE
                          </Badge>
                        </div>
                        <p className="text-gray-300">{draw.description}</p>
                      </div>
                    </div>
                    
                    {/* Prize and Timer Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-200">PRIZE</span>
                        </div>
                        <div className="text-2xl font-bold text-white">₹{parseFloat(draw.prizeAmount).toLocaleString()}</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-5 h-5 text-red-400" />
                          <span className="text-xs font-medium text-red-200">ENDS IN</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{getTimeUntilDraw(draw.drawTime)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="font-medium">{draw.currentParticipants}</span>
                        </div>
                        <div className="text-gray-400">•</div>
                        <div className="font-medium">{draw.entryFee} coins</div>
                      </div>
                      <Button
                        onClick={() => setLocation("/draws")}
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl px-6 shadow-lg shadow-purple-500/25 transition-all duration-300 group-hover:scale-105"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Join Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Recent Winners Showcase */}
        {winners.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Latest Winners
                </h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/reels")}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-xl"
              >
                Celebrations <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {winners.slice(0, 3).map((winner, index) => (
                <Card key={winner.id} className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 rounded-xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className={`w-12 h-12 bg-gradient-to-br ${
                          index === 0 ? 'from-yellow-400 to-orange-500' :
                          index === 1 ? 'from-gray-400 to-gray-500' :
                          'from-orange-400 to-red-500'
                        } rounded-xl flex items-center justify-center`}>
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{winner.user.displayName || winner.user.username}</h3>
                        <p className="text-sm text-gray-300">
                          Won <span className="font-semibold text-yellow-400">₹{parseFloat(winner.draw.prizeAmount).toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          {new Date(winner.createdAt).toLocaleDateString()}
                        </div>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-0 mt-1">
                          Winner
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* VIP Premium Section */}
        {user.isVip && (
          <section>
            <Card className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-500/40 rounded-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                    VIP Member
                  </h3>
                  <p className="text-yellow-200 mb-6">Access exclusive draws with higher prizes and better odds!</p>
                  <Button
                    onClick={() => setLocation("/draws")}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl px-8 shadow-lg shadow-yellow-500/25"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    VIP Draws
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Wallet Access */}
        <section>
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 hover:border-green-400/40 transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => setLocation("/wallet")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Need More Coins?</h3>
                    <p className="text-green-200">Buy coin packages with bonus offers</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-green-400 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <BottomNavigation />
    </div>
  );
}