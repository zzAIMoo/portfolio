import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Waves } from 'lucide-react';
import { AbyssalConstellation } from '../ui/AbyssalConstellation';
import './SkillsSection.css';

export function SkillsSection() {
  const { t } = useTranslation();

  return (
    <section id="skills" className="portfolio-section skills-section">
      <div className="section-inner">
        <div className="depth-marker">
          <Waves size={14} />
          <span className="depth-marker-value">50m</span>
          <span className="depth-marker-label">- Enzo Maiorca, 1961 · {t('records.maiorca')}</span>
        </div>

        
        <div className="skills-physics-container">
          <AbyssalConstellation />
        </div>
      </div>
    </section>
  );
}