import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./countdown-timer";
import { Clock, Users, Coins, Trophy } from "lucide-react";

interface DrawCardProps {
  draw: {
    id: number;
    title: string;
    description?: string;
    prizeAmount: string;
    entryFee: number;
    maxParticipants?: number;
    currentParticipants: number;
    drawTime: string;
    prizeImageUrl?: string;
  };
  onParticipate: () => void;
  userBalance: number;
  showTimer?: boolean;
  isParticipated?: boolean;
}

export default function DrawCard({ 
  draw, 
  onParticipate, 
  userBalance, 
  showTimer = false,
  isParticipated = false 
}: DrawCardProps) {
  const canAfford = userBalance >= draw.entryFee;
  const isFull = draw.maxParticipants && draw.currentParticipants >= draw.maxParticipants;
  const drawTime = new Date(draw.drawTime);
  const isDrawTime = new Date() >= drawTime;

  return (
    <Card className="gradient-card shadow-glass overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 gradient-primary rounded-full blur-3xl opacity-20"></div>
      
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">{draw.title}</h2>
            <p className="text-sm text-gray-400">Entry: {draw.entryFee} coins</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Prize Pool</p>
            <p className="text-xl font-bold text-pink-400">₹{draw.prizeAmount}</p>
          </div>
        </div>
        
        {/* Prize Image */}
        {draw.prizeImageUrl && (
          <img 
            src={draw.prizeImageUrl} 
            alt={draw.description || draw.title}
            className="w-full h-32 object-cover rounded-xl mb-4"
          />
        )}
        
        {/* Description */}
        {draw.description && (
          <p className="text-gray-300 text-sm mb-4">{draw.description}</p>
        )}
        
        {/* Countdown Timer */}
        {showTimer && !isDrawTime && (
          <div className="mb-4">
            <CountdownTimer targetDate={draw.drawTime} />
          </div>
        )}
        
        {/* Participation Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{draw.currentParticipants}</span>
              {draw.maxParticipants && <span>/{draw.maxParticipants}</span>}
            </div>
            {!isDrawTime && (
              <div className="flex items-center text-green-400">
                <Clock className="w-4 h-4 mr-1" />
                Live Draw at {drawTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {draw.maxParticipants && (
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(draw.currentParticipants / draw.maxParticipants) * 100}%` 
              }}
            ></div>
          </div>
        )}
        
        {/* Action Button */}
        <div className="space-y-2">
          {isParticipated ? (
            <Badge variant="secondary" className="w-full justify-center py-2 bg-green-400/20 text-green-400">
              <Trophy className="w-4 h-4 mr-2" />
              Participated
            </Badge>
          ) : isDrawTime ? (
            <Badge variant="secondary" className="w-full justify-center py-2 bg-gray-600 text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              Draw In Progress
            </Badge>
          ) : isFull ? (
            <Badge variant="secondary" className="w-full justify-center py-2 bg-red-400/20 text-red-400">
              Draw Full
            </Badge>
          ) : (
            <Button 
              onClick={onParticipate}
              disabled={!canAfford}
              className="gradient-primary w-full py-3 font-semibold shadow-neon hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coins className="w-4 h-4 mr-2" />
              {!canAfford ? 'Insufficient Coins' : `Participate Now - ${draw.entryFee} Coins`}
            </Button>
          )}
          
          {!canAfford && (
            <p className="text-xs text-red-400 text-center">
              You need {draw.entryFee - userBalance} more coins
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
