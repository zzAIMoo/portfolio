import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { globalScrollState } from '@/hooks/useScrollDepth';
import './Navbar.css';

interface NavbarProps {
  activeSection: string;
}

export function Navbar({ activeSection }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const depthTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const updateDOM = () => {
      if (depthTextRef.current) {
        depthTextRef.current.innerText = `${Math.round(globalScrollState.depth)}m`;
      }
      animationFrameId = requestAnimationFrame(updateDOM);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateDOM();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it');
  };

  const navLinks = [
    { id: 'about', label: t('nav.about') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'legacy', label: t('nav.legacy') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        
        <button
          className="navbar-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="navbar-logo-text">SS</span>
          <span ref={depthTextRef} className="navbar-depth-badge">
            0m
          </span>
        </button>

        
        <div className="navbar-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`navbar-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

        
        <div className="navbar-controls">
          
          <button className="navbar-lang-toggle" onClick={toggleLanguage}>
            {i18n.language === 'it' ? '🇬🇧 EN' : '🇮🇹 IT'}
          </button>

          
          <button
            className={`navbar-burger ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      
      <div className={`navbar-mobile-menu ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`navbar-mobile-link ${activeSection === link.id ? 'active' : ''}`}
            onClick={() => scrollToSection(link.id)}
          >
            {link.label}
            <ChevronDown size={14} />
          </button>
        ))}
      </div>
    </nav>
  );
}