import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import CoinBalance from "@/components/coin-balance";
import BottomNavigation from "@/components/bottom-navigation";
import PurchaseModal from "@/components/purchase-modal";
import { ArrowLeft, History, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Wallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const handlePurchase = async (amount: number, cost: number) => {
    try {
      await apiRequest("POST", "/api/coins/purchase", { amount, cost });
      
      toast({
        title: "Purchase Successful!",
        description: `${amount} coins added to your wallet`,
      });
      
      setShowPurchaseModal(false);
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

  const coinPackages = [
    { coins: 500, price: 99, popular: false },
    { coins: 1200, price: 199, bonus: 200, popular: true },
    { coins: 2500, price: 399, bonus: 500, popular: false },
    { coins: 5000, price: 699, bonus: 1200, popular: false },
  ];

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
          <h1 className="text-lg font-semibold">Wallet</h1>
        </div>
        <CoinBalance balance={user.coinBalance} />
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Balance Overview */}
        <Card className="gradient-card mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-4xl font-bold mb-2">{user.coinBalance.toLocaleString()}</div>
              <div className="text-lg text-gray-300">Available Coins</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-400">₹{user.totalEarnings}</div>
                <div className="text-xs text-gray-400">Total Earned</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-400">{user.totalParticipations}</div>
                <div className="text-xs text-gray-400">Participations</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-400">{user.totalWins}</div>
                <div className="text-xs text-gray-400">Wins</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coin Packages */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Buy Coins</h2>
          <div className="grid grid-cols-2 gap-3">
            {coinPackages.map((pkg, index) => (
              <Card key={index} className={`glass-card relative ${pkg.popular ? 'ring-2 ring-pink-400' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-2 -right-2 bg-pink-400 text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-semibold text-sm">{pkg.coins.toLocaleString()} Coins</p>
                  {pkg.bonus && (
                    <p className="text-xs text-green-400">+{pkg.bonus} Bonus</p>
                  )}
                  <p className="text-pink-400 font-bold">₹{pkg.price}</p>
                  <Button 
                    onClick={() => handlePurchase(pkg.coins + (pkg.bonus || 0), pkg.price)}
                    className="gradient-primary w-full py-2 rounded-lg text-sm font-semibold mt-2"
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Top-up */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Quick Top-up</h3>
                <p className="text-sm text-gray-400">Add coins instantly</p>
              </div>
              <Button 
                onClick={() => setShowPurchaseModal(true)}
                className="gradient-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Coins
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation("/history")}
              className="text-blue-400"
            >
              <History className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction: any) => (
                <Card key={transaction.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'purchase' || transaction.type === 'earn' || transaction.type === 'daily_bonus'
                            ? 'bg-green-400/20' 
                            : 'bg-red-400/20'
                        }`}>
                          {transaction.type === 'purchase' || transaction.type === 'earn' || transaction.type === 'daily_bonus' ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'purchase' || transaction.type === 'earn' || transaction.type === 'daily_bonus'
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
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
                <div className="text-4xl mb-4">💳</div>
                <p className="text-gray-400">No transactions yet</p>
                <p className="text-sm text-gray-500">Your transaction history will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BottomNavigation />
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
