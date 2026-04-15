import { useState, useEffect, useCallback } from 'react';
import { MAX_DEPTH_STANDARD, MAX_DEPTH_HADAL } from '@/utils/depthZones';
import { SECTIONS } from '@/utils/freedivingData';
import { useHadalMode } from '@/context/HadalModeContext';

export const globalScrollState = {
  depth: 0,
  scrollProgress: 0,
  isHadal: false,
};

export function useScrollDepth() {
  const { isHadalModeActive } = useHadalMode();
  const [activeSection, setActiveSection] = useState<string>('hero');

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, scrollTop / docHeight));

    const maxDepth = isHadalModeActive ? MAX_DEPTH_HADAL : MAX_DEPTH_STANDARD;

    globalScrollState.scrollProgress = progress;
    globalScrollState.depth = progress * maxDepth;
    globalScrollState.isHadal = isHadalModeActive;

    const currentDepth = progress * maxDepth;
    let current = 'hero';
    for (const section of SECTIONS) {
      if (currentDepth >= section.depth) {
        current = section.id;
      }
    }

    setActiveSection(current);
  }, [isHadalModeActive]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { activeSection };
}