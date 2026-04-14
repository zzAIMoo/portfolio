import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Waves, ExternalLink, Lock, Code2, Bot, Target, Shield, X, Image } from 'lucide-react';
import './ProjectsSection.css';

interface ScreenshotDef {
  id: string;
  label: string;

  offsetX: number;
  offsetY: number;

  src: string | null;
}

const PROJECT_SCREENSHOTS: Record<string, ScreenshotDef[]> = {
  saas: [
    { id: 'saas-1', label: 'Dashboard', offsetX: 12, offsetY: -14, src: null },
    { id: 'saas-2', label: 'Agent Builder', offsetX: -14, offsetY: -12, src: null },
    { id: 'saas-3', label: 'Chat', offsetX: 16, offsetY: 10, src: null },
  ],
  icdome: [
    { id: 'icdome-1', label: 'Viaggi', offsetX: 12, offsetY: -14, src: null },
    { id: 'icdome-2', label: 'Avvisi SOS', offsetX: -14, offsetY: -12, src: null },
    { id: 'icdome-3', label: 'Dashboard', offsetX: 16, offsetY: 10, src: null },
  ],
  restaurant: [],
};

export function ProjectsSection() {
  const { t } = useTranslation();
  const [activeProject, setActiveProject] = useState<'saas' | 'restaurant' | 'icdome' | null>(null);
  const [lightboxShot, setLightboxShot] = useState<ScreenshotDef | null>(null);

  const projects = {
    saas: {
      id: 'saas',
      icon: <Bot size={24} />,
      x: 35,
      y: 35,
      tech: ['Symfony', 'Python', 'LangChain', 'LangGraph', 'Multi-Tenant']
    },
    restaurant: {
      id: 'restaurant',
      icon: <Code2 size={24} />,
      x: 65,
      y: 65,
      tech: ['Node.js', 'HTML/CSS/JS', 'CLI', 'Monorepo']
    },
    icdome: {
      id: 'icdome',
      icon: <Shield size={24} />,
      x: 25,
      y: 70,
      tech: ['Angular', 'Ionic', 'Symfony', 'iOS']
    }
  };

  const currentProject = activeProject ? projects[activeProject] : null;
  const activePings = activeProject ? PROJECT_SCREENSHOTS[activeProject] : [];

  return (
    <section id="projects" className="portfolio-section projects-section">
      <div className="section-inner">
        <div className="depth-marker">
          <Waves size={14} />
          <span className="depth-marker-value">100m</span>
          <span className="depth-marker-label">- Jacques Mayol, 1976 · {t('records.mayol')}</span>
        </div>

        <h2 className="section-heading">{t('projects.heading')}</h2>
        <p className="section-subtitle">{t('projects.subtitle')}</p>

        <div className="sonar-container">

          <div className="sonar-radar-box">
            <div className="sonar-radar">
              <div className="sonar-sweeper" />

              <div className="sonar-grid-circle grid-circle-1" />
              <div className="sonar-grid-circle grid-circle-2" />

              <div className="sonar-crosshair crosshair-v" />
              <div className="sonar-crosshair crosshair-h" />

              {Object.values(projects).map((proj) => (
                <React.Fragment key={proj.id}>

                  <div
                    className={`sonar-blip ${activeProject === proj.id ? 'active' : ''}`}
                    style={{ left: `${proj.x}%`, top: `${proj.y}%` }}
                    onClick={() => setActiveProject(activeProject === proj.id ? null : proj.id as any)}
                    title={t(`projects.${proj.id}.title`)}
                  >
                    <Target size={24} className="blip-marker" />
                    <div className="blip-ping" />
                  </div>


                  {activeProject === proj.id && PROJECT_SCREENSHOTS[proj.id].map((shot) => (
                    <div
                      key={shot.id}
                      className="screenshot-ping"
                      style={{
                        left: `${proj.x + shot.offsetX}%`,
                        top: `${proj.y + shot.offsetY}%`,
                      }}
                      onClick={(e) => { e.stopPropagation(); setLightboxShot(shot); }}
                      title={shot.label}
                    >
                      <Image size={12} className="ping-icon" />
                      <span className="ping-label">{shot.label}</span>
                      <div className="ping-orbit" />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            {!activeProject && (
              <p className="sonar-instruction">
                Seleziona i segnali per visualizzare
              </p>
            )}
          </div>


          <div className={`holo-panel ocean-card ${activeProject ? 'holo-active' : ''}`}>
            <div className="holo-content">
              {currentProject ? (
                <>
                  <div className="holo-header">
                    <div className="holo-icon">{currentProject.icon}</div>
                    <h3 className="holo-title">{t(`projects.${currentProject.id}.title`)}</h3>
                  </div>

                  {currentProject.id === 'saas' && (
                    <span className="project-badge holo-badge">
                      <Lock size={12} />
                      {t('projects.comingSoon')}
                    </span>
                  )}

                  <p className="holo-description">{t(`projects.${currentProject.id}.description`)}</p>

                  {(currentProject.id === 'saas' || currentProject.id === 'icdome') && (
                    <p className="project-note holo-note">{t(`projects.${currentProject.id}.note`)}</p>
                  )}

                  <div className="holo-tech-tags">
                    {currentProject.tech.map((skill) => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>


                  {activePings.length > 0 && (
                    <p className="screenshot-hint">
                      <Image size={12} /> Clicca i segnali sul radar per vedere gli screenshot
                    </p>
                  )}

                  {currentProject.id === 'restaurant' && (
                    <a
                      href="https://github.com/zzAIMoo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ocean-btn holo-btn"
                      style={{ marginTop: 'auto' }}
                    >
                      {t('projects.viewProject')}
                      <ExternalLink size={14} />
                    </a>
                  )}
                </>
              ) : (
                <div className="holo-empty">
                  <Target size={48} />
                  <p>In attesa di segnale radar...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {lightboxShot && (
        <div className="screenshot-overlay" onClick={() => setLightboxShot(null)}>
          <div className="screenshot-modal ocean-card" onClick={(e) => e.stopPropagation()}>
            <div className="screenshot-modal-header">
              <span className="screenshot-modal-title">{lightboxShot.label}</span>
              <button className="screenshot-modal-close" onClick={() => setLightboxShot(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="screenshot-modal-body">
              {lightboxShot.src ? (
                <img src={lightboxShot.src} alt={lightboxShot.label} className="screenshot-img" />
              ) : (
                <div className="screenshot-placeholder">
                  <Image size={48} />
                  <p>Screenshot in arrivo</p>
                  <span>Progetto in sviluppo attivo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}