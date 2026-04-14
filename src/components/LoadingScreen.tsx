import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  const phases = [
    t('loading.preparing'),
    t('loading.breathing'),
    t('loading.diving'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 1.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress > 33 && phase === 0) setPhase(1);
    if (progress > 66 && phase === 1) setPhase(2);
  }, [progress, phase]);

  return (
    <div className={`loading-screen ${progress >= 100 ? 'done' : ''}`}>
      <div className="loading-content">
        <div className="loading-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="3" />
            <path d="M12 11v6" />
            <path d="M9 17l3 3 3-3" />
          </svg>
        </div>

        <p className="loading-phase">{phases[phase]}</p>

        <div className="loading-bar">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="loading-depth">{Math.round(progress)}%</p>
      </div>

      
      <div className="loading-bubbles">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="loading-bubble"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}