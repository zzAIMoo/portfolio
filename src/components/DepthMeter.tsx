import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { FREEDIVING_RECORDS } from '@/utils/freedivingData';
import { globalScrollState } from '@/hooks/useScrollDepth';
import './DepthMeter.css';

interface DepthMeterProps {
  activeSection: string;
}

export function DepthMeter({ activeSection }: DepthMeterProps) {
  const { t } = useTranslation();
  const maxDisplayDepth = 150;

  const depthTextRef = useRef<HTMLSpanElement>(null);
  const fillBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateDOM = () => {
      const currentDepth = globalScrollState.depth;
      const progress = Math.min(1, currentDepth / maxDisplayDepth);

      if (depthTextRef.current) {
        depthTextRef.current.innerText = Math.round(currentDepth).toString();
      }
      if (fillBarRef.current) {
        fillBarRef.current.style.height = `${progress * 100}%`;
      }
      animationFrameId = requestAnimationFrame(updateDOM);
    };

    updateDOM();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="depth-meter" aria-label={t('depth.depthLabel')}>
      
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

        
        {FREEDIVING_RECORDS.filter(r => r.depth > 0).map((record) => {
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
      </div>
    </div>
  );
}