import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, X } from "lucide-react";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: string;
  drawTitle: string;
}

export default function WinnerModal({ isOpen, onClose, prize, drawTitle }: WinnerModalProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "I won a LuckyDraw!",
        text: `Just won ${prize} in ${drawTitle}! 🎉`,
        url: window.location.origin,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `Just won ${prize} in ${drawTitle}! 🎉 Check out LuckyDraw: ${window.location.origin}`;
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-gray-900 border-gray-700 text-white overflow-hidden">
        <div className="relative p-6 text-center">
          {/* Confetti Background Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-4 left-4 w-3 h-3 bg-pink-400 rounded-full animate-confetti"></div>
            <div className="absolute top-8 right-6 w-2 h-2 bg-green-400 rounded-full animate-confetti" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute bottom-12 left-8 w-4 h-4 bg-blue-400 rounded-full animate-confetti" style={{animationDelay: '0.4s'}}></div>
            <div className="absolute bottom-6 right-4 w-3 h-3 bg-pink-400 rounded-full animate-confetti" style={{animationDelay: '0.6s'}}></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-pink-400">Congratulations!</h2>
            <p className="text-gray-300 mb-4">You won the {drawTitle}!</p>
            
            <div className="gradient-primary text-white font-bold text-3xl py-4 px-6 rounded-xl mb-6">
              {prize}
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              Your prize will be credited to your account within 24 hours.
            </p>
            
            <div className="flex space-x-3">
              <Button 
                onClick={handleShare}
                className="flex-1 gradient-primary hover:opacity-90 transition-opacity"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                onClick={onClose}
                variant="outline" 
                className="flex-1 glass-card border-gray-600 hover:bg-gray-800"
              >
                Continue
              </Button>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
