import { useState, useEffect, useCallback } from 'react';
import { MAX_DEPTH } from '@/utils/depthZones';
import { SECTIONS } from '@/utils/freedivingData';

export const globalScrollState = {
  depth: 0,
  scrollProgress: 0,
};

export function useScrollDepth() {
  const [activeSection, setActiveSection] = useState<string>('hero');

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, scrollTop / docHeight));

    globalScrollState.scrollProgress = progress;
    globalScrollState.depth = progress * MAX_DEPTH;

    const currentDepth = progress * MAX_DEPTH;
    let current = 'hero';
    for (const section of SECTIONS) {
      if (currentDepth >= section.depth) {
        current = section.id;
      }
    }
    
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { activeSection };
}