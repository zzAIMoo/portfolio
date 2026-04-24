import { useState, useEffect, useCallback, useRef } from 'react';
import { useHadalMode } from '@/context/HadalModeContext';
import type { MilestoneId } from '@/context/HadalModeContext';
import { globalScrollState } from '@/hooks/useScrollDepth';
import { AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './HadalHUD.css';

interface Milestone {
  id: MilestoneId;
  depth: number;
  labelKey: string;
  isAchievement?: boolean;
  isAlert?: boolean;
  alertKey?: string;
}

const HADAL_MILESTONES: Milestone[] = [
  { id: 'titanic', depth: 3800, labelKey: 'hadal.titanic', isAchievement: true },
  { id: 'leviathan', depth: 5000, labelKey: 'hadal.leviathan', isAlert: true, alertKey: 'hadal.leviathan_alert' },
  { id: 'everest', depth: 8848, labelKey: 'hadal.everest', isAchievement: true },
  { id: 'hadal', depth: 10000, labelKey: 'hadal.hadal_zone', isAchievement: true },
  { id: 'bottom', depth: 10994, labelKey: 'hadal.bottom', isAchievement: true },
];

export function HadalHUD() {
  const { isHadalModeActive, unlockedMilestones, unlockMilestone, resetDive } = useHadalMode();
  const { t } = useTranslation();
  const [currentAlert, setCurrentAlert] = useState<string | null>(null);
  const [lastAchievement, setLastAchievement] = useState<string | null>(null);
  const [showResurface, setShowResurface] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasPlayedCrackSound = useRef(false);
  const achievementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playSonarPing = useCallback(() => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }, []);

  const playGlassCrack = useCallback(() => {
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;
      
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 1000);
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start();
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }, []);

  useEffect(() => {
    if (!isHadalModeActive) return;

    const checkMilestones = () => {
      const depth = globalScrollState.depth;

      HADAL_MILESTONES.forEach(ms => {
        if (depth >= ms.depth && !unlockedMilestones.has(ms.id)) {
          unlockMilestone(ms.id);
          
          if (ms.isAchievement) {
            setLastAchievement(t(ms.labelKey));
            playSonarPing();
            const duration = ms.id === 'bottom' ? 8000 : 5000;
            if (achievementTimerRef.current) clearTimeout(achievementTimerRef.current);
            achievementTimerRef.current = setTimeout(() => setLastAchievement(null), duration);
          }
          
          if (ms.isAlert && ms.alertKey) {
            setCurrentAlert(t(ms.alertKey));
            playSonarPing();
            if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
            alertTimerRef.current = setTimeout(() => setCurrentAlert(null), 8000);
          }
        }
      });

      if (depth >= 8000 && !hasPlayedCrackSound.current) {
        playGlassCrack();
        hasPlayedCrackSound.current = true;
      }

      if (depth >= 10990) {
        setShowResurface(true);
      } else if (depth < 10000) {
        setShowResurface(false);
      }
    };

    window.addEventListener('scroll', checkMilestones);
    return () => window.removeEventListener('scroll', checkMilestones);
  }, [isHadalModeActive, unlockedMilestones, unlockMilestone, playSonarPing, playGlassCrack, t]);

  useEffect(() => {
    return () => {
      if (achievementTimerRef.current) clearTimeout(achievementTimerRef.current);
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  if (!isHadalModeActive) return null;

  const depth = globalScrollState.depth;
  const isCrushing = depth > 8000;

  return (
    <div className={`hadal-hud ${isCrushing ? 'crushing-pressure' : ''}`}>
      {isCrushing && (
        <div className="pressure-cracks">
          <img src="/images/cracked_glass.png" alt="Pressure Cracks" />
        </div>
      )}

      {lastAchievement && (
        <div className="cinematic-achievement">
          <div className="achievement-scanline" />
          <span className="achievement-label">{t('hadal.achievement_label')}</span>
          <span className="achievement-title">{lastAchievement}</span>
        </div>
      )}

      {currentAlert && (
        <div className="hadal-emergency-alert">
          <AlertTriangle className="alert-icon-pulse" />
          <p className="alert-text">{currentAlert}</p>
        </div>
      )}

      {showResurface && (
        <div className="resurface-container">
          <button className="resurface-btn" onClick={resetDive}>
            <ArrowUpCircle />
            {t('hadal.resurface')}
          </button>
        </div>
      )}

      <div className="hadal-vignette" />
    </div>
  );
}
