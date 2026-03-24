import { useState, useEffect, useCallback, useRef } from 'react';

function calculateSecondsLeft(turnDeadline) {
  if (!turnDeadline) return null;
  const deadline = new Date(turnDeadline).getTime();
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export default function TurnTimer({ turnDeadline, isYourTurn, onExpired }) {
  const [, setTick] = useState(0);
  const hasFiredRef = useRef(false);

  const forceUpdate = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    hasFiredRef.current = false;
  }, [turnDeadline]);

  useEffect(() => {
    if (!turnDeadline) return;
    const interval = setInterval(forceUpdate, 1000);
    return () => clearInterval(interval);
  }, [turnDeadline, forceUpdate]);

  const secondsLeft = calculateSecondsLeft(turnDeadline);

  useEffect(() => {
    if (secondsLeft === 0 && !hasFiredRef.current && onExpired) {
      hasFiredRef.current = true;
      onExpired();
    }
  }, [secondsLeft, onExpired]);

  if (secondsLeft === null) return null;

  const urgent = secondsLeft <= 10;
  const critical = secondsLeft <= 5;

  let className = 'turn-timer';
  if (critical) className += ' turn-timer--critical';
  else if (urgent) className += ' turn-timer--urgent';

  return (
    <div className={className} aria-live="polite">
      <span className="turn-timer__label">
        {isYourTurn ? 'Time left' : 'Opponent time'}
      </span>
      <span className="turn-timer__value">{secondsLeft}s</span>
    </div>
  );
}
