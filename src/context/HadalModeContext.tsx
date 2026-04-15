import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type MilestoneId = 'titanic' | 'leviathan' | 'everest' | 'hadal' | 'bottom';

interface HadalModeContextType {
  isHadalModeActive: boolean;
  unlockedMilestones: Set<MilestoneId>;
  activateHadalMode: () => void;
  resetDive: () => void;
  unlockMilestone: (id: MilestoneId) => void;
}

const HadalModeContext = createContext<HadalModeContextType | undefined>(undefined);

export function HadalModeProvider({ children }: { children: ReactNode }) {
  const [isHadalModeActive, setIsHadalModeActive] = useState(false);
  const [unlockedMilestones, setUnlockedMilestones] = useState<Set<MilestoneId>>(new Set());

  const activateHadalMode = useCallback(() => {
    setIsHadalModeActive(true);
  }, []);

  const resetDive = useCallback(() => {
    setIsHadalModeActive(false);
    setUnlockedMilestones(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const unlockMilestone = useCallback((id: MilestoneId) => {
    setUnlockedMilestones((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <HadalModeContext.Provider value={{
      isHadalModeActive,
      unlockedMilestones,
      activateHadalMode,
      resetDive,
      unlockMilestone
    }}>
      {children}
    </HadalModeContext.Provider>
  );
}

export function useHadalMode() {
  const context = useContext(HadalModeContext);
  if (context === undefined) {
    throw new Error('useHadalMode must be used within a HadalModeProvider');
  }
  return context;
}
