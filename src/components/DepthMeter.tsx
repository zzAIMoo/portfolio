import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useMemo } from 'react';
import { FREEDIVING_RECORDS } from '@/utils/freedivingData';
import { globalScrollState } from '@/hooks/useScrollDepth';
import { useHadalMode } from '@/context/HadalModeContext';
import { MAX_DEPTH_STANDARD, MAX_DEPTH_HADAL } from '@/utils/depthZones';
import './DepthMeter.css';

interface DepthMeterProps {
  activeSection: string;
}

export function DepthMeter({ activeSection }: DepthMeterProps) {
  const { t } = useTranslation();
  const { isHadalModeActive } = useHadalMode();

  const maxDisplayDepth = useMemo(() =>
    isHadalModeActive ? MAX_DEPTH_HADAL : MAX_DEPTH_STANDARD
    , [isHadalModeActive]);

  const depthTextRef = useRef<HTMLSpanElement>(null);
  const fillBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateDOM = () => {
      const currentDepth = globalScrollState.depth;
      const progress = Math.min(1, currentDepth / maxDisplayDepth);

      if (depthTextRef.current) {
        depthTextRef.current.innerText = Math.round(currentDepth).toLocaleString();
      }
      if (fillBarRef.current) {
        fillBarRef.current.style.height = `${progress * 100}%`;
      }
      animationFrameId = requestAnimationFrame(updateDOM);
    };

    updateDOM();
    return () => cancelAnimationFrame(animationFrameId);
  }, [maxDisplayDepth]);

  return (
    <div className={`depth-meter ${isHadalModeActive ? 'hadal-theme' : ''}`} aria-label={t('depth.depthLabel')}>

      <div className="depth-meter-value">
        <span ref={depthTextRef} className="depth-meter-number">0</span>
        <span className="depth-meter-unit">{t('depth.meters')}</span>
      </div>

      <div className="depth-meter-track">
        <div
          ref={fillBarRef}
          className="depth-meter-fill"
          style={{ height: '0%' }}
        />

        {!isHadalModeActive && FREEDIVING_RECORDS.filter(r => r.depth > 0).map((record) => {
          const pos = (record.depth / maxDisplayDepth) * 100;
          const isActive = record.sectionId === activeSection;
          return (
            <div
              key={record.sectionId}
              className={`depth-meter-marker ${isActive ? 'active' : ''}`}
              style={{ top: `${pos}%` }}
              title={`${record.depth}m - ${record.diver}`}
            >
              <div className="depth-meter-marker-dot" />
              <div className="depth-meter-marker-label">
                {record.depth}m
              </div>
            </div>
          );
        })}

        {isHadalModeActive && (
          <>
            <div className="depth-meter-marker hadal-marker" style={{ top: '34%' }} title="Titanic">
              <div className="depth-meter-marker-dot titanic-dot" />
            </div>
            <div className="depth-meter-marker hadal-marker" style={{ top: '80%' }} title="Everest">
              <div className="depth-meter-marker-dot everest-dot" />
            </div>
            <div className="depth-meter-marker hadal-marker" style={{ top: '100%' }} title="Challenger Deep">
              <div className="depth-meter-marker-dot bottom-dot" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}