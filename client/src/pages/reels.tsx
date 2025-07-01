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
  Coins,
  Loader2
} from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

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

  // Load winner reels from API
  const { data: winnerReels = [], isLoading } = useQuery({
    queryKey: ['/api/winners/reels'],
    queryFn: async () => {
      const response = await fetch('/api/winners/reels');
      if (!response.ok) throw new Error('Failed to fetch winner reels');
      return response.json();
    }
  });

  const [reels, setReels] = useState<WinnerReel[]>([]);

  // Update reels when data is loaded
  useEffect(() => {
    if (winnerReels.length > 0) {
      setReels(winnerReels);
    }
  }, [winnerReels]);

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    } else if (direction === 'up' && currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const toggleLike = (reelId: number) => {
    setReels(reels.map((reel: WinnerReel) => 
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

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-white/70">Loading winner stories...</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center p-6">
          <Trophy className="w-16 h-16 text-purple-500" />
          <h2 className="text-xl font-bold">No Winner Stories Yet</h2>
          <p className="text-white/70">Be the first to win and share your celebration!</p>
          <Button 
            onClick={() => setLocation('/draws')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            Explore Draws
          </Button>
        </div>
      </div>
    );
  }

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
        {reels.map((reel: WinnerReel, index: number) => (
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
              {reels.map((_: WinnerReel, idx: number) => (
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