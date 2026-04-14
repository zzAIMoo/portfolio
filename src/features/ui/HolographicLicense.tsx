import React, { useRef, useState } from 'react';
import { User, Waves, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './HolographicLicense.css';

export function HolographicLicense() {
  const { t } = useTranslation();
  const isItalian = t('about.heading') === 'Chi Sono';

  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (!isFlipped) setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      className="holographic-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div className="holographic-anchor">
        <div
          className={`holographic-wrapper ${isFlipped ? 'is-flipped' : ''}`}
          onClick={handleFlip}
          style={{
            transform: isFlipped
              ? `perspective(1000px) rotateY(180deg) rotateX(0deg) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
              : `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isHovering && !isFlipped ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >

          <div className="holographic-card holographic-front ocean-card license-format">

            <div className="license-top-bar">
              <span className="license-org">ABYSSAL WEB DEVELOPMENT FEDERATION</span>
              <span className="license-type">APNEA / FULL STACK</span>
            </div>

            <div className="license-content">

              <div className="license-left">
                <div className="license-photo-box">
                  <User size={50} className="license-user-icon" />
                </div>
                <div className="license-stars">★★</div>
              </div>


              <div className="license-right">
                <div className="license-title">{isItalian ? 'Brevetto di Sviluppo' : 'Development Certificate'}</div>

                <div className="license-fields">
                  <div className="license-field">
                    <span className="field-label">{isItalian ? 'Cognome:' : 'Surname:'}</span>
                    <span className="field-value">Sechi</span>
                  </div>
                  <div className="license-field">
                    <span className="field-label">{isItalian ? 'Nome:' : 'Name:'}</span>
                    <span className="field-value">Simone</span>
                  </div>
                  <div className="license-field">
                    <span className="field-label">{isItalian ? 'Specializzazione:' : 'Specialty:'}</span>
                    <span className="field-value">AI Systems</span>
                  </div>
                  <div className="license-field">
                    <span className="field-label">{isItalian ? 'Qualifica:' : 'Rank:'}</span>
                    <span className="field-value">Full Stack Developer</span>
                  </div>
                  <div className="license-field">
                    <span className="field-label">{isItalian ? 'Matricola:' : 'ID Number:'}</span>
                    <span className="field-value">0xDEV-ABYSS</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="holo-glow" style={{
              left: `${50 + rotation.y * 2}%`,
              top: `${50 - rotation.x * 2}%`,
              opacity: isHovering && !isFlipped ? 0.3 : 0
            }} />

            <div className="flip-hint">
              <RefreshCw size={16} />
            </div>
          </div>


          <div className="holographic-card holographic-back license-format">
            <div className="license-top-bar">
              <span className="license-org">AUTHORIZED PERSONNEL ONLY</span>
              <span className="license-type">PROFILE DATA</span>
            </div>

            <div className="license-back-content">
              <p className="license-description-text">
                {t('about.description')}
              </p>

              <div className="holo-footer-barcode" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div className="barcode-line"></div>
                <div className="barcode-line w-2"></div>
                <div className="barcode-line w-4"></div>
                <div className="barcode-line"></div>
                <div className="barcode-line w-3"></div>
                <div className="barcode-line"></div>
                <div className="barcode-line w-2"></div>
                <div className="barcode-line"></div>
                <span>[ SCANNED: {isItalian ? 'APPROVATO' : 'APPROVED'} ]</span>
              </div>
            </div>


            <div className="holo-glow" style={{
              left: `${50 - rotation.y * 2}%`,
              top: `${50 + rotation.x * 2}%`,
              opacity: isHovering && isFlipped ? 0.3 : 0
            }} />

            <div className="flip-hint">
              <RefreshCw size={16} />
            </div>
          </div>
        </div>


        <div className="holo-stat stat-tl">
          <div className="stat-value">4+</div>
          <div className="stat-label">{isItalian ? 'Anni Exp' : 'Years Exp'}</div>
        </div>

        <div className="holo-stat stat-tr">
          <Waves size={24} className="stat-icon" />
          <div className="stat-value">22m</div>
          <div className="stat-label">CWT</div>
        </div>

        <div className="holo-stat stat-bl">
          <Clock size={24} className="stat-icon" />
          <div className="stat-value">4:36</div>
          <div className="stat-label">STA</div>
        </div>

        <div className="holo-stat stat-br">
          <CheckCircle size={24} className="stat-icon" />
          <div className="stat-value">100m</div>
          <div className="stat-label">DYNB</div>
        </div>
      </div>
    </div>
  );
}