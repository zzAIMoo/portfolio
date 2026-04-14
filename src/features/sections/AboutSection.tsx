import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Waves } from 'lucide-react';
import { HolographicLicense } from '../ui/HolographicLicense';
import './AboutSection.css';

export function AboutSection() {
  const { t } = useTranslation();
  const isItalian = t('about.heading') === 'Chi Sono';

  return (
    <section id="about" className="portfolio-section about-section">
      <div className="section-inner">
        <div className="depth-marker">
          <Waves size={14} />
          <span className="depth-marker-value">22m</span>
          <span className="depth-marker-label">- Simone Sechi · {t('records.personal')}</span>
        </div>

        <h2 className="section-heading">{t('about.heading')}</h2>

        <div className="about-physics-container" style={{ overflow: 'visible' }}>
          <HolographicLicense />
        </div>
      </div>
    </section>
  );
}