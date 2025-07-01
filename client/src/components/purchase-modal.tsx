import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, CreditCard } from "lucide-react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number, cost: number) => void;
}

export default function PurchaseModal({ isOpen, onClose, onPurchase }: PurchaseModalProps) {
  const coinPackages = [
    { coins: 500, price: 99, popular: false },
    { coins: 1200, price: 199, bonus: 200, popular: true },
    { coins: 2500, price: 399, bonus: 500, popular: false },
    { coins: 5000, price: 699, bonus: 1200, popular: false },
  ];

  const handlePurchase = (pkg: typeof coinPackages[0]) => {
    const totalCoins = pkg.coins + (pkg.bonus || 0);
    onPurchase(totalCoins, pkg.price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Buy Coins
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {coinPackages.map((pkg, index) => (
            <Card key={index} className={`glass-card relative cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${pkg.popular ? 'ring-2 ring-pink-400' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs">
                  Popular
                </Badge>
              )}
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">💰</span>
                      <span className="font-semibold">{pkg.coins.toLocaleString()} Coins</span>
                    </div>
                    {pkg.bonus && (
                      <p className="text-xs text-green-400">+{pkg.bonus} Bonus Coins</p>
                    )}
                    <p className="text-lg font-bold text-pink-400">₹{pkg.price}</p>
                  </div>
                  <Button 
                    onClick={() => handlePurchase(pkg)}
                    className="gradient-primary"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            💳 Test payments only • Real integration coming soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
