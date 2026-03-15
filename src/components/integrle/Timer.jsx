import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ isRunning, onTimeUpdate, solvedTime }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          onTimeUpdate?.(next);
          return next;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const displayTime = solvedTime ?? seconds;
  const mins = Math.floor(displayTime / 60);
  const secs = displayTime % 60;

  return (
    <div className="flex items-center gap-2 text-sm font-mono opacity-70">
      <Clock className="w-4 h-4" />
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
    </div>
  );
}