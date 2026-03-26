import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ isRunning, onTimeUpdate, solvedTime, initialTime = 0 }) {
  // Use a ref to keep track of the count without triggering re-renders 
  // until the interval says so
  const [seconds, setSeconds] = useState(initialTime);

  // CRITICAL: When the cloud finally loads and gives us an initialTime,
  // we must update our internal seconds state.
  useEffect(() => {
    setSeconds(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          onTimeUpdate?.(next);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

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