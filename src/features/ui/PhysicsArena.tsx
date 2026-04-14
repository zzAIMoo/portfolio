import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import './PhysicsArena.css';

export interface PhysicsBubbleData {
  id: string;
  size: number;
  content: React.ReactNode;
  isMega?: boolean;
  className?: string;
  startX?: number;
  startY?: number;
}

interface PhysicsArenaProps {
  bubbles: PhysicsBubbleData[];
  gravityY?: number;
}

export function PhysicsArena({ bubbles, gravityY = -0.05 }: PhysicsArenaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;
    const Runner = Matter.Runner;

    const engine = Engine.create();
    engineRef.current = engine;
    
    engine.world.gravity.y = gravityY;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const wallOptions = { 
      isStatic: true, 
      restitution: 0.8,
      render: { visible: false } 
    };
    
    const floor = Bodies.rectangle(width / 2, height + 50, width * 2, 100, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -50, width * 2, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions);

    World.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    const bodies = bubbles.map((bubble, i) => {
      const radius = bubble.size / 2;
      const x = width / 2 + (bubble.startX || (Math.random() - 0.5) * 200);
      const y = height / 2 + (bubble.startY || (Math.random() - 0.5) * 200);

      const body = Bodies.circle(x, y, radius, {
        restitution: 0.9,
        friction: 0.005,
        frictionAir: 0.02,
        density: bubble.isMega ? 0.04 : 0.01,
        render: { visible: false }
      });
      return body;
    });

    World.add(engine.world, bodies);

    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    // @ts-ignore: types
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    // @ts-ignore: types
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    World.add(engine.world, mouseConstraint);

    const runner = Runner.create();
    Runner.run(runner, engine);

    let animationFrameId: number;

    const updateDOM = () => {
      bodies.forEach((body, i) => {
        const el = bubbleRefs.current[i];
        if (el) {
          const x = body.position.x - bubbles[i].size / 2;
          const y = body.position.y - bubbles[i].size / 2;
          const angle = body.angle;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
        }
      });
      animationFrameId = requestAnimationFrame(updateDOM);
    };

    updateDOM();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      Engine.clear(engine);
      if (engine.world) World.clear(engine.world, false);
    };
  }, [bubbles, gravityY]);

  return (
    <div className="physics-arena-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      
      <div className="physics-arena-wave physics-arena-wave-top"></div>
      <div className="physics-arena-wave physics-arena-wave-bottom"></div>
      <div className="physics-arena-wave physics-arena-wave-left"></div>
      <div className="physics-arena-wave physics-arena-wave-right"></div>
      
      <div className="physics-arena" ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      {bubbles.map((bubble, i) => (
        <div
          key={bubble.id}
          ref={(el) => { bubbleRefs.current[i] = el; }}
          className={`physics-bubble ${bubble.isMega ? 'mega-bubble' : 'mini-bubble'} ${bubble.className || ''}`}
          style={{ width: bubble.size, height: bubble.size }}
        >
          <div className="physics-bubble-inner">
            {bubble.content}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}