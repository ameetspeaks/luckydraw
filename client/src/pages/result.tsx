import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft, Trophy, Users, Star, Share2, Play, Heart, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Result() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [expandedWinner, setExpandedWinner] = useState<number | null>(null);

  const { data: winners, isLoading } = useQuery({
    queryKey: ["/api/winners"],
    retry: false,
  });

  const { data: draws } = useQuery({
    queryKey: ["/api/draws"],
    retry: false,
  });

  if (!user) return null;

  // Mock recent draw results for demonstration
  const mockResults = [
    {
      id: 1,
      drawTitle: "Today's Mega Draw",
      winnerName: "Rahul M.",
      winnerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      prize: "₹25,000",
      prizeDescription: "iPhone 15 Pro Max",
      drawTime: "Today 6:00 PM",
      totalParticipants: 1247,
      isCompleted: true,
      celebrationVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      likes: 234,
      comments: 45,
      shares: 12
    },
    {
      id: 2,
      drawTitle: "Morning Special",
      winnerName: "Priya S.",
      winnerImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&h=100",
      prize: "₹50,000",
      prizeDescription: "Cash Prize",
      drawTime: "Yesterday 10:00 AM",
      totalParticipants: 652,
      isCompleted: true,
      celebrationVideo: null,
      likes: 189,
      comments: 32,
      shares: 8
    }
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
          <h1 className="text-lg font-semibold">Draw Results</h1>
        </div>
        <Badge className="gradient-primary">Live</Badge>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Hero Section - Latest Result */}
        {mockResults.length > 0 && (
          <Card className="gradient-card mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-primary rounded-full blur-3xl opacity-20"></div>
            <CardContent className="p-6 relative">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">🎉</div>
                <h2 className="text-2xl font-bold text-pink-400 mb-1">Winner Announced!</h2>
                <p className="text-gray-400">{mockResults[0].drawTitle}</p>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-4">
                <img 
                  src={mockResults[0].winnerImage} 
                  alt="Winner" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-yellow-400"
                />
                <div>
                  <h3 className="text-xl font-bold">{mockResults[0].winnerName}</h3>
                  <p className="text-gray-400">Lucky Winner</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-400 mb-1">{mockResults[0].prize}</div>
                <p className="text-gray-300">{mockResults[0].prizeDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center text-sm mb-4">
                <div>
                  <div className="text-gray-400">Draw Time</div>
                  <div className="font-semibold">{mockResults[0].drawTime}</div>
                </div>
                <div>
                  <div className="text-gray-400">Participants</div>
                  <div className="font-semibold">{mockResults[0].totalParticipants.toLocaleString()}</div>
                </div>
              </div>

              {/* Celebration Video */}
              {mockResults[0].celebrationVideo && (
                <div className="mb-4">
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <Play className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Winner's Celebration Video</p>
                    <Button className="gradient-primary w-full">
                      Watch Celebration
                    </Button>
                  </div>
                </div>
              )}

              {/* Social Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-pink-400">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{mockResults[0].likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-blue-400">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{mockResults[0].comments}</span>
                  </button>
                </div>
                <button className="flex items-center space-x-1 text-green-400">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">{mockResults[0].shares}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Results */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
          <div className="space-y-4">
            {mockResults.slice(1).map((result) => (
              <Card key={result.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={result.winnerImage} 
                        alt="Winner" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                      />
                      <div>
                        <h3 className="font-semibold">{result.winnerName}</h3>
                        <p className="text-sm text-gray-400">{result.drawTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-400">{result.prize}</p>
                      <p className="text-xs text-gray-400">{result.drawTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {result.totalParticipants}
                      </span>
                      <span className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
                        Winner
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-400">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {result.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {result.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Fairness Badge */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4 text-center">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">AI-Powered Fair Selection</h3>
            <p className="text-sm text-gray-400">
              All winners are selected using our transparent AI algorithm ensuring complete fairness
            </p>
            <Badge className="mt-2 bg-green-400/20 text-green-400 border-green-400/30">
              Verified Fair
            </Badge>
          </CardContent>
        </Card>

        {/* Browse More Draws */}
        <div className="text-center">
          <Button 
            onClick={() => setLocation("/draws")}
            className="gradient-primary"
          >
            Browse Active Draws
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}