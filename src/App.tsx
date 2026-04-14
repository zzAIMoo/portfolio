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

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { activeSection } = useScrollDepth();

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      
      {!isLoaded && <LoadingScreen onComplete={handleLoadComplete} />}

      
      <OceanCanvas />

      
      <Navbar activeSection={activeSection} />

      
      <DepthMeter activeSection={activeSection} />

      
      <div className="content-layer">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <LegacySection />
        <ContactSection />
        <AbyssFooter />
      </div>
    </>
  );
}

export default App;