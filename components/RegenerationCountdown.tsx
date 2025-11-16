import { useEffect, useState } from 'react';

interface RegenerationCountdownProps {
  generatedAtISO: string;
  revalidateSeconds: number;
}

export default function RegenerationCountdown({ generatedAtISO, revalidateSeconds }: RegenerationCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const generatedAt = new Date(generatedAtISO);
      const regenerationTime = new Date(generatedAt.getTime() + revalidateSeconds * 1000);
      const now = new Date();
      const diff = regenerationTime.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining('Regenerating...');
        return;
      }

      setIsExpired(false);
      
      // Calculate time components
      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Format as MM:SS
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      
      setTimeRemaining(`${formattedMinutes}:${formattedSeconds}`);
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [generatedAtISO, revalidateSeconds]);

  if (!timeRemaining) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800">
        <svg 
          className={`w-4 h-4 ${isExpired ? 'text-green-500 animate-spin' : 'text-indigo-600 dark:text-indigo-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isExpired ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        <span className="text-sm font-mono font-semibold text-indigo-900 dark:text-indigo-200">
          {isExpired ? 'Regenerating' : `Next refresh in ${timeRemaining}`}
        </span>
      </div>
    </div>
  );
}

