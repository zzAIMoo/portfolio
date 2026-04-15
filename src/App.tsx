import { useState, useCallback } from 'react';
import { useScrollDepth } from '@/hooks/useScrollDepth';
import { OceanCanvas } from '@/features/ocean/OceanCanvas';
import { Navbar } from '@/components/Navbar';
import { DepthMeter } from '@/components/DepthMeter';
import { LoadingScreen } from '@/components/LoadingScreen';
import { HeroSection } from '@/features/sections/HeroSection';
import { AboutSection } from '@/features/sections/AboutSection';
import { SkillsSection } from '@/features/sections/SkillsSection';
import { ProjectsSection } from '@/features/sections/ProjectsSection';
import { LegacySection } from '@/features/sections/LegacySection';
import { ContactSection } from '@/features/sections/ContactSection';
import { AbyssFooter } from '@/features/sections/AbyssFooter';
import { HadalModeProvider, useHadalMode } from '@/context/HadalModeContext';
import { HadalHUD } from './features/ui/HadalHUD';

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { activeSection } = useScrollDepth();
  const { isHadalModeActive } = useHadalMode();

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={handleLoadComplete} />}

      <OceanCanvas />

      <Navbar activeSection={activeSection} />

      <DepthMeter activeSection={activeSection} />

      <HadalHUD />

      <div className="content-layer">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <LegacySection />
        <ContactSection />
        <AbyssFooter />

        {isHadalModeActive && (
          <div
            className="hadal-void"
            style={{
              height: '35000vh',
              background: 'transparent',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <HadalModeProvider>
      <AppContent />
    </HadalModeProvider>
  );
}

export default App;