import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import './HeroSection.css';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section id="hero" className="portfolio-section hero-section">
      <div className="hero-content">
        <p className="hero-greeting">
          {t('hero.greeting')}{' '}
          <span className="hero-greeting-highlight">
            {t('hero.greetingHighlight')}
          </span>
        </p>

        <h1 className="hero-name">{t('hero.name')}</h1>

        <p className="hero-title">{t('hero.title')}</p>

        <button
          className="hero-cta ocean-btn"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {t('hero.cta')}
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="hero-scroll-hint">
        <span>{t('hero.scrollHint')}</span>
        <div className="hero-scroll-arrow">
          <ChevronDown size={20} />
        </div>
      </div>
    </section>
  );
}