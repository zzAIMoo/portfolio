import { useTranslation } from 'react-i18next';
import './AbyssFooter.css';

export function AbyssFooter() {
  const { t } = useTranslation();

  return (
    <section id="abyss" className="portfolio-section abyss-section">
      <div className="abyss-content">
        <p className="abyss-question">{t('abyss.question')}</p>
        <div className="abyss-line" />
        <p className="abyss-secret">{t('abyss.secret')}</p>
        <p className="abyss-credits">
          Made with 🤿 by Simone Sechi · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}