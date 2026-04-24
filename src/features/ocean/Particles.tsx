import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function Particles() {
  const bubblesRef = useRef<THREE.Points>(null);
  const planktonRef = useRef<THREE.Points>(null);
  const bioRef = useRef<THREE.Points>(null);

  const bubbleCount = 60;
  const planktonCount = 150;
  const bioCount = 80;

  const bubblePositions = useMemo(() => {
    const positions = new Float32Array(bubbleCount * 3);
    for (let i = 0; i < bubbleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  const planktonPositions = useMemo(() => {
    const positions = new Float32Array(planktonCount * 3);
    for (let i = 0; i < planktonCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  const bioPositions = useMemo(() => {
    const positions = new Float32Array(bioCount * 3);
    for (let i = 0; i < bioCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const { depth, scrollProgress } = globalScrollState;

    if (bubblesRef.current) {
      const pos = bubblesRef.current.geometry.attributes.position;
      for (let i = 0; i < bubbleCount; i++) {
        const y = pos.getY(i) + 0.02;
        const x = pos.getX(i) + Math.sin(t + i) * 0.003;
        pos.setY(i, y > 10 ? -10 : y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
      bubblesRef.current.rotation.y = t * 0.02;
    }

    if (planktonRef.current) {
      const pos = planktonRef.current.geometry.attributes.position;
      for (let i = 0; i < planktonCount; i++) {
        const y = pos.getY(i) - 0.003;
        const x = pos.getX(i) + Math.sin(t * 0.3 + i * 0.5) * 0.002;
        pos.setY(i, y < -15 ? 15 : y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }

    if (bioRef.current) {
      const pos = bioRef.current.geometry.attributes.position;
      for (let i = 0; i < bioCount; i++) {
        const x = pos.getX(i) + Math.sin(t * 0.2 + i) * 0.004;
        const y = pos.getY(i) + Math.cos(t * 0.15 + i * 0.7) * 0.003;
        pos.setX(i, x);
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

      const mat = bioRef.current.material as THREE.PointsMaterial;
      const bioBaseOpacity = Math.min(1, Math.max(0, (depth - 40) / 20));
      mat.opacity = (0.3 + Math.sin(t * 0.5) * 0.2) * bioBaseOpacity;
    }

    if (bubblesRef.current) {
      const mat = bubblesRef.current.material as THREE.PointsMaterial;
      const bubbleBaseOpacity = Math.max(0, 1 - Math.max(0, depth - 70) / 20);
      mat.opacity = Math.max(0, (0.6 - scrollProgress) * bubbleBaseOpacity);
    }
  });

  return (
    <>
      
      {globalScrollState.depth < 40 && (
        <points ref={bubblesRef} renderOrder={1}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={bubbleCount}
              array={bubblePositions}
              itemSize={3}
              args={[bubblePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#a5f3fc"
            transparent
            opacity={0}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      )}

      
      <points ref={planktonRef} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={planktonCount}
            array={planktonPositions}
            itemSize={3}
            args={[planktonPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#c5e8ff"
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      
      <points ref={bioRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={bioCount}
            array={bioPositions}
            itemSize={3}
            args={[bioPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#22d3ee"
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  );
}