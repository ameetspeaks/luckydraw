import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <div className="flex justify-center space-x-3">
      <div className="countdown-item rounded-lg px-3 py-2 text-center backdrop-blur-sm">
        <div className="font-mono font-bold text-lg">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-400">Hours</div>
      </div>
      <div className="countdown-item rounded-lg px-3 py-2 text-center backdrop-blur-sm">
        <div className="font-mono font-bold text-lg">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-400">Min</div>
      </div>
      <div className="countdown-item rounded-lg px-3 py-2 text-center backdrop-blur-sm">
        <div className="font-mono font-bold text-lg">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-400">Sec</div>
      </div>
    </div>
  );
}
