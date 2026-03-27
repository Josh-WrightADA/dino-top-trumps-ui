import { useState, useEffect } from 'react';
import { getPublicProfile } from '../../api/authApi';
import RankBadge from '../rank/RankBadge';
import '../profile/Avatar.css';
import './Game.css';

const STAGE_DURATION_MS = 3000;
const READY_AUTO_DISMISS_MS = 3000;

export default function PreGameCeremony({ opponentId, currentTurnPlayerId, currentPlayerId, onComplete }) {
  const [stage, setStage] = useState(1);
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const youGoFirst = currentTurnPlayerId === currentPlayerId;

  // Fetch opponent profile on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchOpponent() {
      try {
        const res = await getPublicProfile(opponentId);
        if (!cancelled) setOpponent(res.data);
      } catch (err) {
        console.warn('Failed to fetch opponent profile:', err);
      }
    }
    if (opponentId) fetchOpponent();
    return () => { cancelled = true; };
  }, [opponentId]);

  // Auto-advance stage 1 -> stage 2
  useEffect(() => {
    if (stage !== 1) return;
    const timer = setTimeout(() => setStage(2), STAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  // Auto-advance stage 2 -> stage 3
  useEffect(() => {
    if (stage !== 2) return;
    const timer = setTimeout(() => setStage(3), STAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  // Countdown in stage 3 then auto-dismiss
  useEffect(() => {
    if (stage !== 3) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    const dismissTimer = setTimeout(onComplete, READY_AUTO_DISMISS_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(dismissTimer);
    };
  }, [stage, onComplete]);

  const opponentName = opponent?.displayName || opponent?.username || 'Opponent';
  const opponentInitial = opponentName.charAt(0).toUpperCase();

  return (
    <div className="pre-game-ceremony" aria-live="polite">
      {stage === 1 && (
        <div className="pre-game-ceremony__stage" key="stage-1">
          <p className="pre-game-ceremony__label">Your opponent is...</p>

          {opponent?.avatarUrl ? (
            <img
              src={opponent.avatarUrl}
              alt={`${opponentName}'s avatar`}
              className="avatar avatar--large"
            />
          ) : (
            <div className="avatar-placeholder avatar-placeholder--large">
              {opponentInitial}
            </div>
          )}

          <h2 className="pre-game-ceremony__opponent-name">{opponentName}</h2>

          {opponent?.bio && (
            <p className="pre-game-ceremony__opponent-bio">{opponent.bio}</p>
          )}

          {opponent?.rankTier && (
            <div className="pre-game-ceremony__opponent-rank">
              <RankBadge tierKey={opponent.rankTier} size="medium" />
            </div>
          )}
        </div>
      )}

      {stage === 2 && (
        <div className="pre-game-ceremony__stage" key="stage-2">
          <div className="pre-game-ceremony__coin" aria-hidden="true">
            ⚔
          </div>
          <p className="pre-game-ceremony__flip-result">
            {youGoFirst ? 'You go first!' : 'Your opponent goes first!'}
          </p>
        </div>
      )}

      {stage === 3 && (
        <div className="pre-game-ceremony__stage" key="stage-3">
          <h2 className="pre-game-ceremony__ready-title">Ready to battle!</h2>
          <button
            className="pre-game-ceremony__start-btn"
            onClick={onComplete}
          >
            Start Game
          </button>
          {countdown > 0 && (
            <p className="pre-game-ceremony__countdown">
              Starting in {countdown}...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
