import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import BottomNavigation from "@/components/bottom-navigation";
import CoinBalance from "@/components/coin-balance";
import { 
  ArrowLeft, 
  Calendar, 
  Share2, 
  UserPlus, 
  Video, 
  Star, 
  Gift, 
  Clock,
  Coins,
  Trophy,
  Target,
  CheckCircle,
  Plus
} from "lucide-react";
import { useLocation } from "wouter";

interface EarnTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'social' | 'achievement' | 'watch';
  icon: any;
  isCompleted: boolean;
  isAvailable: boolean;
  requirement?: string;
  cooldown?: string;
}

export default function Earn() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Daily check-in mutation
  const checkinMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/checkin", {}),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Daily Bonus Claimed!",
        description: `You earned ${data.bonusCoins} coins! Streak: ${data.newStreak} days`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to claim daily bonus",
        variant: "destructive",
      });
    },
  });

  // Watch ad mutation (mock for now)
  const watchAdMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/watch-ad", {}),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Ad Reward Earned!",
        description: `You earned ${data.coins} coins for watching the ad!`,
      });
    },
  });

  // Social task completion
  const completeSocialTaskMutation = useMutation({
    mutationFn: (taskId: string) => apiRequest("POST", "/api/social-task", { taskId }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Social Task Completed!",
        description: `You earned ${data.reward} coins!`,
      });
    },
  });

  const earnTasks: EarnTask[] = [
    {
      id: 'daily-checkin',
      title: 'Daily Check-in',
      description: 'Check in daily to earn bonus coins. Streak bonus increases rewards!',
      reward: 25,
      type: 'daily',
      icon: Calendar,
      isCompleted: user?.lastCheckIn && new Date(user.lastCheckIn).toDateString() === new Date().toDateString(),
      isAvailable: true,
      cooldown: user?.lastCheckIn ? '24 hours' : undefined
    },
    {
      id: 'watch-ad-1',
      title: 'Watch Video Ad',
      description: 'Watch a short advertisement to earn coins',
      reward: 10,
      type: 'watch',
      icon: Video,
      isCompleted: false,
      isAvailable: true,
      cooldown: '30 minutes'
    },
    {
      id: 'share-app',
      title: 'Share Lucky11',
      description: 'Share the app with friends on social media',
      reward: 50,
      type: 'social',
      icon: Share2,
      isCompleted: false,
      isAvailable: true,
      requirement: 'Share on any platform'
    },
    {
      id: 'invite-friend',
      title: 'Invite a Friend',
      description: 'Invite friends to join Lucky11 and both get bonus coins',
      reward: 100,
      type: 'social',
      icon: UserPlus,
      isCompleted: false,
      isAvailable: true,
      requirement: 'Friend must register and participate in a draw'
    },
    {
      id: 'rate-app',
      title: 'Rate Our App',
      description: 'Give us a 5-star rating on the app store',
      reward: 75,
      type: 'social',
      icon: Star,
      isCompleted: false,
      isAvailable: true,
      requirement: 'Leave a review'
    },
    {
      id: 'first-win',
      title: 'First Win Achievement',
      description: 'Win your first draw to unlock this reward',
      reward: 200,
      type: 'achievement',
      icon: Trophy,
      isCompleted: (user?.totalWins || 0) > 0,
      isAvailable: true,
      requirement: 'Win any draw'
    },
    {
      id: 'participate-10',
      title: 'Active Participant',
      description: 'Participate in 10 draws to earn this bonus',
      reward: 150,
      type: 'achievement',
      icon: Target,
      isCompleted: (user?.totalParticipations || 0) >= 10,
      isAvailable: true,
      requirement: '10 draw participations'
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day check-in streak',
      reward: 300,
      type: 'achievement',
      icon: CheckCircle,
      isCompleted: (user?.currentStreak || 0) >= 7,
      isAvailable: true,
      requirement: '7-day streak'
    }
  ];

  const handleTaskComplete = (task: EarnTask) => {
    switch (task.type) {
      case 'daily':
        if (task.id === 'daily-checkin') {
          checkinMutation.mutate();
        }
        break;
      case 'watch':
        watchAdMutation.mutate();
        break;
      case 'social':
        completeSocialTaskMutation.mutate(task.id);
        break;
      case 'achievement':
        // Achievement tasks are automatically completed
        toast({
          title: "Achievement Unlocked!",
          description: `You've earned ${task.reward} coins for completing: ${task.title}`,
        });
        break;
    }
  };

  const getTaskIcon = (IconComponent: any, type: string) => {
    const iconColors = {
      daily: 'text-blue-500',
      social: 'text-green-500',
      achievement: 'text-yellow-500',
      watch: 'text-purple-500'
    };
    return <IconComponent className={`w-6 h-6 ${iconColors[type as keyof typeof iconColors]}`} />;
  };

  const availableTasks = earnTasks.filter(task => task.isAvailable && !task.isCompleted);
  const completedTasks = earnTasks.filter(task => task.isCompleted);

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
            Earn Coins
          </h1>
          <CoinBalance balance={user.coinBalance || 0} className="text-sm" />
        </div>
      </header>

      <div className="p-4 space-y-6 pb-24">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-3 text-center">
              <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{user.currentStreak || 0}</div>
              <div className="text-xs text-blue-200">Day Streak</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-3 text-center">
              <Trophy className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{user.totalWins || 0}</div>
              <div className="text-xs text-green-200">Total Wins</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/30">
            <CardContent className="p-3 text-center">
              <Target className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{user.totalParticipations || 0}</div>
              <div className="text-xs text-yellow-200">Participations</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Tasks */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-400" />
            Available Tasks ({availableTasks.length})
          </h2>
          <div className="space-y-3">
            {availableTasks.map((task) => (
              <Card key={task.id} className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      {getTaskIcon(task.icon, task.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{task.title}</h3>
                        <p className="text-sm text-gray-300">{task.description}</p>
                        {task.requirement && (
                          <p className="text-xs text-gray-400 mt-1">Requirement: {task.requirement}</p>
                        )}
                        {task.cooldown && (
                          <p className="text-xs text-blue-400 mt-1">Cooldown: {task.cooldown}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-400 font-bold mb-2">
                        <Coins className="w-4 h-4 mr-1" />
                        +{task.reward}
                      </div>
                      <Button
                        onClick={() => handleTaskComplete(task)}
                        disabled={task.isCompleted || checkinMutation.isPending || watchAdMutation.isPending}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        size="sm"
                      >
                        {task.isCompleted ? 'Completed' : 'Claim'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Completed Tasks ({completedTasks.length})
            </h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        {getTaskIcon(task.icon, task.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{task.title}</h3>
                          <p className="text-sm text-gray-300">{task.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-400 font-bold">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          +{task.reward}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Gift className="w-5 h-5 mr-2 text-purple-400" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-300">• Check in daily to build your streak and earn bonus coins</p>
            <p className="text-sm text-gray-300">• Share the app to earn significant coin rewards</p>
            <p className="text-sm text-gray-300">• Complete achievements for the biggest coin bonuses</p>
            <p className="text-sm text-gray-300">• Watch ads for quick coin boosts throughout the day</p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}