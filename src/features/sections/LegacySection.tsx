import { useTranslation } from 'react-i18next';
import { Waves, Gamepad2, Music, CheckCircle, Skull, Beer, ExternalLink } from 'lucide-react';
import './LegacySection.css';

const LEGACY_PROJECTS = [
  {
    key: 'paleoscovery',
    icon: Gamepad2,
    tech: ['Unity', 'C#'],
    theme: 'pixel',
  },
  {
    key: 'beedone',
    icon: CheckCircle,
    tech: ['Flutter', 'Dart'],
    theme: 'honey',
  },
  {
    key: 'flows',
    icon: Music,
    tech: ['Flutter', 'Dart'],
    theme: 'music',
  },
  {
    key: 'tod',
    icon: Skull,
    tech: ['Unity', 'C#'],
    theme: 'dare',
  },
  {
    key: 'drunkcards',
    icon: Beer,
    tech: ['Angular', 'TypeScript'],
    theme: 'party',
    link: 'https://play.google.com/store/apps/details?id=it.zaimo.drunkcards&hl=en',
  },
];

function PaleocapaPixelArt() {
  const pixels = [
    { r: 0, c: 3, w: 5, color: '#b0b0b0' },
    { r: 1, c: 2, w: 7, color: '#b0b0b0' },
    { r: 2, c: 1, w: 4, color: '#b0b0b0' },
    { r: 2, c: 5, w: 4, color: '#c0c0c0' },
    { r: 3, c: 0, w: 3, color: '#a0a0a0' },
    { r: 3, c: 3, w: 6, color: '#c0c0c0' },
    { r: 4, c: 0, w: 2, color: '#a0a0a0' },
    { r: 4, c: 2, w: 6, color: '#ffccd5' },
    { r: 5, c: 1, w: 7, color: '#ffccd5' },
    { r: 5, c: 3, w: 1, color: '#333' },
    { r: 5, c: 6, w: 1, color: '#333' },
    { r: 4, c: 3, w: 2, color: '#888' },
    { r: 4, c: 6, w: 1, color: '#888' },
    { r: 6, c: 1, w: 7, color: '#ffccd5' },
    { r: 7, c: 2, w: 5, color: '#ffccd5' },
    { r: 8, c: 1, w: 7, color: '#666' },
    { r: 8, c: 4, w: 1, color: '#fff' },
    { r: 9, c: 1, w: 7, color: '#555' },
    { r: 9, c: 3, w: 1, color: '#fff' },
    { r: 9, c: 5, w: 1, color: '#fff' },
  ];
  const s = 4;
  return (
    <svg className="paleocapa-pixel-art" viewBox="0 0 40 44" fill="none">
      {pixels.map((p, i) => (
        <rect key={i} x={p.c * s} y={p.r * s} width={p.w * s} height={s} fill={p.color} opacity="0.6" />
      ))}
    </svg>
  );
}

function HoneycombPattern() {
  const hexPoints = (cx, cy, r) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  const hexes = [
    { cx: 20, cy: 20 }, { cx: 46, cy: 20 }, { cx: 33, cy: 42.5 },
    { cx: 59, cy: 42.5 }, { cx: 7, cy: 42.5 }, { cx: 20, cy: 65 }, { cx: 46, cy: 65 },
  ];
  return (
    <svg className="honeycomb-pattern" viewBox="0 0 70 80" fill="none">
      {hexes.map((h, i) => (
        <polygon key={i} points={hexPoints(h.cx, h.cy, 13)} stroke="rgba(251,191,36,0.25)" strokeWidth="1" fill="rgba(251,191,36,0.04)" className={`hex hex-${i}`} />
      ))}
    </svg>
  );
}

function AnimatedBees() {
  return (
    <div className="bees-container">
      {[0, 1, 2].map((i) => (
        <svg key={i} className={`bee bee-${i}`} viewBox="0 0 24 20" fill="none">
          <ellipse cx="8" cy="6" rx="5" ry="3" fill="rgba(255,255,255,0.5)" className="bee-wing-l" />
          <ellipse cx="16" cy="6" rx="5" ry="3" fill="rgba(255,255,255,0.5)" className="bee-wing-r" />
          <ellipse cx="12" cy="12" rx="5" ry="6" fill="#fbbf24" />
          <rect x="7" y="10" width="10" height="2" rx="1" fill="#333" />
          <rect x="7" y="14" width="10" height="2" rx="1" fill="#333" />
          <circle cx="10" cy="8" r="1" fill="#333" />
          <circle cx="14" cy="8" r="1" fill="#333" />
        </svg>
      ))}
    </div>
  );
}

function FloatingNotes() {
  const notes = ['♪', '♫', '♩', '♬', '♪'];
  return (
    <div className="notes-container">
      {notes.map((note, i) => (
        <span key={i} className={`floating-note note-${i}`}>{note}</span>
      ))}
    </div>
  );
}

function SoundWave() {
  return (
    <svg className="sound-wave" viewBox="0 0 120 40" fill="none">
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={i * 6} y={20 - (Math.sin(i * 0.8) * 10 + 5)} width="3" height={(Math.sin(i * 0.8) * 20 + 5) < 0 ? 3 : (Math.sin(i * 0.8) * 20 + 10)} rx="1.5" fill="rgba(168,85,247,0.3)" className={`wave-bar bar-${i}`} />
      ))}
    </svg>
  );
}

function SpinWheel() {
  return (
    <svg className="spin-wheel" viewBox="0 0 60 60" fill="none">
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const nextAngle = ((i + 1) * 45) * Math.PI / 180;
        const cx = 30, cy = 30, r = 28;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + r * Math.cos(nextAngle);
        const y2 = cy + r * Math.sin(nextAngle);
        return (
          <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
            fill={i % 2 === 0 ? 'rgba(34,211,238,0.08)' : 'rgba(45,212,191,0.08)'}
            stroke="rgba(34,211,238,0.15)" strokeWidth="0.5" className={`wheel-seg seg-${i}`} />
        );
      })}
      <circle cx="30" cy="30" r="4" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
      <polygon points="30,2 27,8 33,8" fill="rgba(34,211,238,0.4)" className="wheel-pointer" />
    </svg>
  );
}

function FloatingSymbols() {
  const symbols = ['?', '!', '?', '!', '?'];
  return (
    <div className="symbols-container">
      {symbols.map((s, i) => (
        <span key={i} className={`floating-symbol symbol-${i}`}>{s}</span>
      ))}
    </div>
  );
}

function ShotGlass() {
  return (
    <svg className="shot-glass" viewBox="0 0 32 40" fill="none">
      <path d="M4 4 L6 32 Q6 36 10 36 L22 36 Q26 36 26 32 L28 4 Z" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <path d="M7 16 L8.5 32 Q8.5 34 11 34 L21 34 Q23.5 34 23.5 32 L25 16 Z" fill="rgba(239,68,68,0.35)" className="shot-liquid" />
      <line x1="6" y1="4" x2="26" y2="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
  );
}

function FloatingCards() {
  return (
    <div className="cards-container">
      {['🍺', '🃏', '🍸'].map((label, i) => (
        <div key={i} className={`mini-card mini-card-${i}`}>{label}</div>
      ))}
    </div>
  );
}

function PixelGrid() {
  return (
    <svg className="pixel-grid-overlay" viewBox="0 0 300 300" preserveAspectRatio="none">
      <defs>
        <pattern id="pixelGrid" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="none" stroke="rgba(139,92,42,0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="300" height="300" fill="url(#pixelGrid)" />
    </svg>
  );
}

export function LegacySection() {
  const { t } = useTranslation();

  const renderThemeDecorations = (theme) => {
    switch (theme) {
      case 'pixel':
        return <><PixelGrid /><PaleocapaPixelArt /></>;
      case 'honey':
        return <><HoneycombPattern /><AnimatedBees /></>;
      case 'music':
        return <><SoundWave /><FloatingNotes /></>;
      case 'dare':
        return <><SpinWheel /><FloatingSymbols /></>;
      case 'party':
        return <><ShotGlass /><FloatingCards /></>;
      default:
        return null;
    }
  };

  return (
    <section id="legacy" className="portfolio-section legacy-section">
      <div className="section-inner">
        <div className="depth-marker">
          <Waves size={14} />
          <span className="depth-marker-value">123m</span>
          <span className="depth-marker-label">
            - Alessia Zecchini, 2023 · {t('records.zecchini')}
          </span>
        </div>
        <h2 className="section-heading">{t('legacy.heading')}</h2>
        <p className="section-subtitle">{t('legacy.subtitle')}</p>
        <div className="relics-scatter-container">
          {LEGACY_PROJECTS.map((project, index) => {
            const Icon = project.icon;
            return (
              <div key={project.key} className={`relic-card relic-${index} relic-theme-${project.theme}`}>
                <div className="relic-theme-layer">
                  {renderThemeDecorations(project.theme)}
                </div>
                <div className="relic-algae"></div>
                <div className="relic-icon-wrapper">
                  <Icon size={28} className="relic-icon-svg" />
                </div>
                <div className="relic-content">
                  <h3 className="relic-title">{t(`legacy.${project.key}.title`)}</h3>
                  <p className="relic-description">{t(`legacy.${project.key}.description`)}</p>
                  <div className="relic-tech">
                    {project.tech.map((tech) => (
                      <span key={tech} className="relic-tech-tag">{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relic-link-btn"
                    >
                      <ExternalLink size={14} />
                      Play Store
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}