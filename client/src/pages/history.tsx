import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Trophy, Clock, Coins } from "lucide-react";
import { useLocation } from "wouter";

export default function History() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const { data: participations, isLoading: participationsLoading } = useQuery({
    queryKey: ["/api/participations"],
    retry: false,
  });

  if (!user) return null;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'spend':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      case 'earn':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'daily_bonus':
        return <Coins className="w-5 h-5 text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
      case 'earn':
      case 'daily_bonus':
        return 'text-green-400';
      case 'spend':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

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
          <h1 className="text-lg font-semibold">History</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="gradient-card">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{user.totalWins}</div>
              <div className="text-sm text-gray-400">Total Wins</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">₹{user.totalEarnings}</div>
              <div className="text-sm text-gray-400">Total Earned</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="transactions">
              <Coins className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="participations">
              <Trophy className="w-4 h-4 mr-2" />
              Draws
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-800 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction: any) => (
                  <Card key={transaction.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'purchase' || transaction.type === 'earn' || transaction.type === 'daily_bonus'
                              ? 'bg-green-400/20' 
                              : 'bg-red-400/20'
                          }`}>
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(transaction.createdAt).toLocaleDateString()} • {' '}
                              {new Date(transaction.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'purchase' || transaction.type === 'earn' || transaction.type === 'daily_bonus' ? '+' : '-'}
                          {transaction.amount}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No transactions yet</p>
                  <p className="text-sm text-gray-500">Your transaction history will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="participations" className="mt-6">
            {participationsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-800 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : participations && participations.length > 0 ? (
              <div className="space-y-3">
                {participations.map((participation: any) => (
                  <Card key={participation.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">Draw #{participation.drawId}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(participation.participatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-400 font-semibold">-{participation.coinsSpent} coins</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Participated</span>
                        <span className="text-blue-400">
                          {new Date(participation.participatedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No draw participations yet</p>
                  <p className="text-sm text-gray-500">Join draws to see your history here</p>
                  <Button 
                    onClick={() => setLocation("/draws")}
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
