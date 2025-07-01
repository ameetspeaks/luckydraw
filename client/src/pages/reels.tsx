import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/bottom-navigation";
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Trophy,
  Crown,
  Gift,
  Coins
} from "lucide-react";
import { useLocation } from "wouter";

interface WinnerReel {
  id: number;
  winnerName: string;
  winnerImage: string;
  prize: string;
  prizeAmount: string;
  drawTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  celebrationText: string;
  winDate: string;
  isVip: boolean;
}

export default function Reels() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock winner reels data
  const winnerReels: WinnerReel[] = [
    {
      id: 1,
      winnerName: "Rahul Sharma",
      winnerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      prize: "iPhone 15 Pro Max",
      prizeAmount: "₹25,000",
      drawTitle: "Today's Mega Draw",
      videoUrl: "", // Would be actual video URL
      thumbnailUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&h=600",
      likes: 1247,
      comments: 234,
      shares: 89,
      isLiked: false,
      celebrationText: "I can't believe I won! Thank you Lucky11! 🎉🎉🎉",
      winDate: "2 hours ago",
      isVip: false
    },
    {
      id: 2,
      winnerName: "Priya Patel",
      winnerImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&h=100",
      prize: "Cash Prize",
      prizeAmount: "₹50,000",
      drawTitle: "Morning Special",
      videoUrl: "",
      thumbnailUrl: "https://images.unsplash.com/photo-1607301404481-0571e4447cfd?auto=format&fit=crop&w=400&h=600",
      likes: 892,
      comments: 156,
      shares: 67,
      isLiked: true,
      celebrationText: "Dreams do come true! Lucky11 made my day special! 💸✨",
      winDate: "1 day ago",
      isVip: true
    },
    {
      id: 3,
      winnerName: "Amit Kumar",
      winnerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
      prize: "MacBook Pro",
      prizeAmount: "₹75,000",
      drawTitle: "Lucky 7 Draw",
      videoUrl: "",
      thumbnailUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&h=600",
      likes: 2156,
      comments: 445,
      shares: 123,
      isLiked: false,
      celebrationText: "First time participating and I won! Lucky11 is amazing! 🚀💻",
      winDate: "3 days ago",
      isVip: false
    }
  ];

  const [reels, setReels] = useState(winnerReels);

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else if (direction === 'up' && currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const toggleLike = (reelId: number) => {
    setReels(reels.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isLiked: !reel.isLiked,
            likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
          }
        : reel
    ));
  };

  const currentReel = reels[currentReelIndex];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        handleScroll('down');
      } else {
        handleScroll('up');
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentReelIndex, reels.length]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocation("/")}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Winner Stories</h1>
        <div className="w-10"></div>
      </header>

      {/* Reels Container */}
      <div 
        ref={containerRef}
        className="relative h-screen w-full"
        style={{ transform: `translateY(-${currentReelIndex * 100}vh)`, transition: 'transform 0.3s ease' }}
      >
        {reels.map((reel, index) => (
          <div 
            key={reel.id}
            className="absolute inset-0 flex items-center justify-center"
            style={{ top: `${index * 100}vh` }}
          >
            {/* Background Video/Image */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
              <img 
                src={reel.thumbnailUrl}
                alt={`${reel.winnerName} celebration`}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex">
              {/* Left Side - Main Content */}
              <div className="flex-1 flex flex-col justify-end p-6 pb-32">
                {/* Winner Info */}
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <img 
                      src={reel.winnerImage}
                      alt={reel.winnerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white mr-3"
                    />
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold text-white mr-2">{reel.winnerName}</span>
                        {reel.isVip && <Crown className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <span className="text-sm text-gray-300">{reel.winDate}</span>
                    </div>
                  </div>

                  {/* Prize Info */}
                  <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-white">{reel.prizeAmount}</div>
                        <div className="text-sm text-gray-200">{reel.prize}</div>
                      </div>
                      <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div className="text-xs text-gray-200 mt-1">{reel.drawTitle}</div>
                  </div>

                  {/* Celebration Text */}
                  <p className="text-white text-sm leading-relaxed">
                    {reel.celebrationText}
                  </p>
                </div>

                {/* Audio indicator */}
                <div className="flex items-center space-x-2 text-white/70">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Original audio</span>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="w-16 flex flex-col items-center justify-end pb-32 space-y-6">
                {/* Like Button */}
                <button 
                  onClick={() => toggleLike(reel.id)}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm ${
                    reel.isLiked ? 'bg-red-500/80' : 'bg-black/50'
                  }`}>
                    <Heart className={`w-6 h-6 ${reel.isLiked ? 'text-white fill-current' : 'text-white'}`} />
                  </div>
                  <span className="text-xs text-white font-semibold">{reel.likes.toLocaleString()}</span>
                </button>

                {/* Comment Button */}
                <button className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white font-semibold">{reel.comments}</span>
                </button>

                {/* Share Button */}
                <button className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white font-semibold">{reel.shares}</span>
                </button>

                {/* Gift Button */}
                <button className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white font-semibold">Gift</span>
                </button>
              </div>
            </div>

            {/* Scroll Indicators */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
              {reels.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1 h-8 rounded-full ${
                    idx === currentReelIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-20 left-4 right-4 z-50">
        <Button 
          onClick={() => setLocation("/draws")}
          className="w-full gradient-primary py-3 font-semibold backdrop-blur-sm"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Join Next Draw
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
}