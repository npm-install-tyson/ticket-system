import { useEffect, useState } from "react";

const TIMER_DURATION = 10 * 60 - 2; // 10 minutes in seconds

const TenMinuteCounter: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const storedTime = localStorage.getItem("counterEndTime");
    if (storedTime) {
      const endTime = parseInt(storedTime, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(endTime - currentTime, 0);
    }
    return TIMER_DURATION;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const endTime = Math.floor(Date.now() / 1000) + timeLeft;
    localStorage.setItem("counterEndTime", endTime.toString());

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      Remaining Time - {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default TenMinuteCounter;
