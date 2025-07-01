import { Button } from "@/components/ui/button";
import { Home, Ticket, Wallet, Play, User, Coins } from "lucide-react";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/draws", icon: Ticket, label: "Draws" },
    { path: "/earn", icon: Coins, label: "Earn" },
    { path: "/reels", icon: Play, label: "Winners" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-card backdrop-blur-xl z-50">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 ${
                isActive 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
