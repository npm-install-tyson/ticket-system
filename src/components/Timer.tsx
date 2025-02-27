import React, { useState, useEffect } from "react";

interface AutoTimerProps {
  durationMinutes?: number;
  onComplete?: () => void;
  storageKey?: string;
}

const CountdownTimer: React.FC<AutoTimerProps> = ({
  durationMinutes = 10,
  onComplete,
  storageKey = "autoTimer",
}) => {
  // Get initial time from localStorage if available
  const getInitialTimeLeft = (): number => {
    const savedTimerState = localStorage.getItem(storageKey);
    if (savedTimerState) {
      const { timeLeft, timestamp, isRunning } = JSON.parse(savedTimerState);

      // If timer was running, calculate elapsed time since last save
      if (isRunning && timestamp) {
        const elapsedSeconds = Math.floor((Date.now() - timestamp) / 1000);
        return Math.max(0, timeLeft - elapsedSeconds);
      }
      return timeLeft;
    }
    return durationMinutes * 60 - 2; // Initial time in seconds
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft);
  // Start running automatically if there's still time left
  const [isRunning, setIsRunning] = useState(timeLeft > 0);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        timeLeft,
        isRunning,
        timestamp: isRunning ? Date.now() : null,
      })
    );
  }, [timeLeft, isRunning, storageKey]);

  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;

    if (isRunning && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeLeft, onComplete]);

  // Format time as MM:SS
  const formatTime = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-xl py-4 text-end font-bold tracking-tight text-gray-900 sm:text-xl">
      Remaining Time - {formatTime()}
    </div>
  );
};

export default CountdownTimer;
