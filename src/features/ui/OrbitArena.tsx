import React from 'react';
import './OrbitArena.css';

export interface OrbitBubbleData {
  id: string;
  size: number;
  content: React.ReactNode;
  isMega?: boolean;
  className?: string;
  orbitRadius?: number;
  orbitDuration?: number;
  orbitOffset?: string;
}

interface OrbitArenaProps {
  bubbles: OrbitBubbleData[];
  className?: string;
}

export function OrbitArena({ bubbles, className = '' }: OrbitArenaProps) {
  const megaBubbles = bubbles.filter(b => b.isMega);
  const orbitalBubbles = bubbles.filter(b => !b.isMega);

  const defaultBaseRadius = 180;
  
  return (
    <div className={`orbit-arena-container ${className}`}>
      <div className="orbit-arena">
        
        {megaBubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`orbit-bubble mega-bubble ${bubble.className || ''}`}
            style={{ width: bubble.size, height: bubble.size }}
          >
            <div className="orbit-bubble-inner">
              {bubble.content}
            </div>
          </div>
        ))}

        
        {orbitalBubbles.map((bubble, i) => {
          const totalOrbitals = orbitalBubbles.length;
          
          const ringIndex = i % 2; 
          const radius = bubble.orbitRadius || (defaultBaseRadius + ringIndex * 80);
          
          const duration = bubble.orbitDuration || (25 + ringIndex * 15);
          
          const defaultAngle = (360 / totalOrbitals) * i;
          const startingAngle = bubble.orbitOffset || `${defaultAngle}deg`;

          return (
            <div 
              key={bubble.id} 
              className="orbit-track"
              style={{ 
                // @ts-ignore
                '--orbit-duration': `${duration}s`,
                transform: `rotate(${startingAngle})`
              }}
            >
              <div 
                className={`orbit-bubble satellite ${bubble.className || ''}`}
                style={{ 
                  width: bubble.size, 
                  height: bubble.size,
                  // @ts-ignore
                  '--orbit-radius': `${radius}px`
                }}
              >
                <div className="orbit-bubble-inner satellite-content">
                  {bubble.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}