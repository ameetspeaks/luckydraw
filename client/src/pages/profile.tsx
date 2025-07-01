import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import { 
  ArrowLeft, 
  User, 
  Trophy, 
  Coins, 
  Calendar, 
  Crown, 
  LogOut,
  Settings,
  Share,
  Star
} from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const achievements = [
    { 
      id: 1, 
      title: "First Win", 
      description: "Won your first draw", 
      icon: "🏆", 
      unlocked: user.totalWins > 0 
    },
    { 
      id: 2, 
      title: "Lucky Streak", 
      description: "7 day check-in streak", 
      icon: "🔥", 
      unlocked: user.currentStreak >= 7 
    },
    { 
      id: 3, 
      title: "High Roller", 
      description: "Participated in 10+ draws", 
      icon: "🎲", 
      unlocked: user.totalParticipations >= 10 
    },
    { 
      id: 4, 
      title: "Big Winner", 
      description: "Earned ₹1000+", 
      icon: "💰", 
      unlocked: parseFloat(user.totalEarnings) >= 1000 
    },
  ];

  const stats = [
    { label: "Total Participations", value: user.totalParticipations, icon: Trophy },
    { label: "Total Wins", value: user.totalWins, icon: Star },
    { label: "Current Streak", value: `${user.currentStreak} days`, icon: Calendar },
    { label: "Coin Balance", value: user.coinBalance.toLocaleString(), icon: Coins },
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
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Profile Header */}
        <Card className="gradient-card mb-6">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <img 
                src={user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-4 border-purple-500"
              />
              {user.isVip && (
                <div className="absolute -top-1 -right-1">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-400 mb-2">{user.email}</p>
            
            <div className="flex items-center justify-center space-x-2">
              <Badge variant={user.isVip ? "default" : "secondary"} className="gradient-primary">
                {user.isVip ? '👑 VIP Member' : '⭐ Member'}
              </Badge>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-green-400">₹{user.totalEarnings}</div>
              <div className="text-sm text-gray-400">Total Earnings</div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-4 text-center">
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border text-center ${
                    achievement.unlocked 
                      ? 'bg-green-400/20 border-green-400/30' 
                      : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start glass-card border-gray-700"
            onClick={() => setLocation("/wallet")}
          >
            <Coins className="w-5 h-5 mr-3" />
            Manage Wallet
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start glass-card border-gray-700"
            onClick={() => setLocation("/history")}
          >
            <Calendar className="w-5 h-5 mr-3" />
            View History
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start glass-card border-gray-700"
          >
            <Share className="w-5 h-5 mr-3" />
            Share App
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start glass-card border-gray-700"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </div>

        {/* Member Since */}
        <Card className="glass-card mt-6">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-400">Member since</p>
            <p className="font-semibold">
              {new Date(user.createdAt || '').toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
