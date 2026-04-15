import { X, ExternalLink, Info } from 'lucide-react';
import './CreditsModal.css';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="credits-overlay" onClick={onClose}>
      <div className="credits-modal ocean-card" onClick={(e) => e.stopPropagation()}>
        <div className="credits-header">
          <div className="credits-title-box">
             <Info size={16} className="credits-icon" />
             <span className="credits-title">Deep Sea Credits</span>
          </div>
          <button className="credits-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="credits-body">
          <div className="credits-section">
            <h4 className="credits-section-title">3D Biodiversity</h4>
            <ul className="credits-list">
              <li className="credits-item">
                <div className="credits-item-main">
                  <span className="credits-asset-name">Marine Life Collection</span>
                  <span className="credits-author">by Quaternius</span>
                </div>
                <div className="credits-item-links">
                  <span className="credits-license">CC0 / Free</span>
                  <a href="https://poly.pizza/m/MRjSlwCjHM" target="_blank" rel="noopener noreferrer" className="credits-link">
                    Anglerfish <ExternalLink size={10} />
                  </a>
                  <a href="https://poly.pizza/m/bU5RLZnq6v" target="_blank" rel="noopener noreferrer" className="credits-link">
                    Fish Bone <ExternalLink size={10} />
                  </a>
                  <a href="https://poly.pizza/m/BEcU9rjiAq" target="_blank" rel="noopener noreferrer" className="credits-link">
                    Clownfish <ExternalLink size={10} />
                  </a>
                  <a href="https://poly.pizza/m/Ymu8ftrmuT" target="_blank" rel="noopener noreferrer" className="credits-link">
                    Dory <ExternalLink size={10} />
                  </a>
                </div>
              </li>
              <li className="credits-item">
                <div className="credits-item-main">
                  <span className="credits-asset-name">Blowfish</span>
                  <span className="credits-author">by jeremy</span>
                </div>
                <div className="credits-item-links">
                  <span className="credits-license">CC-BY 3.0</span>
                  <a href="https://poly.pizza/m/8DXeKkgTS_s" target="_blank" rel="noopener noreferrer" className="credits-link">
                    Poly Pizza <ExternalLink size={10} />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="credits-section">
            <h4 className="credits-section-title">Sound & Atmosphere</h4>
            <p className="credits-asset-desc">L'esperienza immersiva è progettata per simulare il silenzio e la pressione degli abissi pelagici.</p>
          </div>

          <div className="credits-footer-text">
            Questo portfolio è un tributo all'esplorazione subacquea e allo sviluppo web moderno.
          </div>
        </div>
      </div>
    </div>
  );
}
