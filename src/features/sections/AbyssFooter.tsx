import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, ChevronDown, Compass } from 'lucide-react';
import { CreditsModal } from '@/components/CreditsModal';
import { useHadalMode } from '@/context/HadalModeContext';
import { globalScrollState } from '@/hooks/useScrollDepth';
import { useFrame } from '@react-three/fiber';
import './AbyssFooter.css';

export function AbyssFooter() {
  const { t } = useTranslation();
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const { isHadalModeActive, activateHadalMode } = useHadalMode();
  const [showDeepDive, setShowDeepDive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isHadalModeActive && globalScrollState.depth > 190) {
        setShowDeepDive(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHadalModeActive]);

  return (
    <section id="abyss" className="portfolio-section abyss-section">
      <div className="abyss-content">
        <p className="abyss-question">{t('abyss.question')}</p>
        <div className="abyss-line" />
        <p className="abyss-secret">{t('abyss.secret')}</p>
        
        {!isHadalModeActive && showDeepDive ? (
          <div className="hadal-trigger-container">
            <button 
              className="hadal-initiate-btn pulse"
              onClick={activateHadalMode}
            >
              <Compass className="btn-icon" />
              {t('hadal.initiate_btn')}
              <ChevronDown className="btn-icon-end" />
            </button>
            <p className="hadal-warning">{t('hadal.warning')}</p>
          </div>
        ) : isHadalModeActive ? (
          <div className="hadal-active-status">
            <Compass className="spinning-compass" />
            <span>{t('hadal.active_status')}</span>
          </div>
        ) : null}

        <p className="abyss-credits">
          Made with 🤿 by Simone Sechi · {new Date().getFullYear()}
        </p>

        <button 
          className="credits-trigger-btn" 
          onClick={() => setIsCreditsOpen(true)}
          title="Assets & Credits"
        >
          <Info size={14} />
          Credits
        </button>
      </div>

      <CreditsModal 
        isOpen={isCreditsOpen} 
        onClose={() => setIsCreditsOpen(false)} 
      />
    </section>
  );
}