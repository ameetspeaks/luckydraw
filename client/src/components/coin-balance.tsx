import { Coins } from "lucide-react";

interface CoinBalanceProps {
  balance: number;
  className?: string;
}

export default function CoinBalance({ balance, className = "" }: CoinBalanceProps) {
  return (
    <div className={`glass-card px-3 py-1.5 rounded-full flex items-center space-x-2 ${className}`}>
      <Coins className="w-4 h-4 text-yellow-400" />
      <span className="font-mono font-semibold text-sm text-white">
        {balance.toLocaleString()}
      </span>
    </div>
  );
}
