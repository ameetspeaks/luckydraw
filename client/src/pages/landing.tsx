import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Trophy, Users, Gift } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="text-center py-12 px-6">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Lucky11
          </h1>
          <p className="text-gray-400 text-lg">Premium Lucky Draw Experience</p>
        </header>

        {/* Features */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="glass-card border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Coin Economy</p>
                <p className="text-xs text-gray-400">Purchase & earn coins</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Big Prizes</p>
                <p className="text-xs text-gray-400">Win amazing rewards</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Fair Play</p>
                <p className="text-xs text-gray-400">AI-powered selection</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Gift className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Daily Rewards</p>
                <p className="text-xs text-gray-400">Check-in bonuses</p>
              </CardContent>
            </Card>
          </div>

          {/* Hero Card */}
          <Card className="gradient-card border-purple-500/30 mb-8">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Get Lucky?</h2>
              <p className="text-gray-300 mb-4">
                Join thousands of winners in our daily lucky draws
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-6">
                <div>
                  <div className="text-xl font-bold text-green-400">₹2.5L+</div>
                  <div>Prizes Given</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-400">10K+</div>
                  <div>Happy Winners</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-400">50K+</div>
                  <div>Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Button */}
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full gradient-primary hover:opacity-90 transition-opacity text-lg py-6 font-semibold"
          >
            Get Started - Login with Replit
          </Button>
          
          <p className="text-center text-gray-500 text-sm mt-4">
            New users get 100 welcome coins!
          </p>
        </div>
      </div>
    </div>
  );
}
