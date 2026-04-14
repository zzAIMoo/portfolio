import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

interface JellyfishProps {
  count?: number;
}

export function Jellyfish({ count = 3 }: JellyfishProps) {
  const jellyData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        -3 - Math.random() * 8,
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.05 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  return (
    <group>
      {jellyData.map((data, i) => (
        <SingleJellyfish
          key={i}
          position={data.position}
          scale={data.scale}
          speed={data.speed}
          phase={data.phase}
        />
      ))}
    </group>
  );
}

interface SingleJellyfishProps {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
}

function SingleJellyfish({ position, scale, speed, phase }: SingleJellyfishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bellRef = useRef<THREE.Mesh>(null);

  const isVisible = useRef(false);
  const initialDepth = globalScrollState.depth;
  const isDeep = initialDepth > 50;
  const visibility = Math.max(0, 1 - Math.max(0, initialDepth - 55) / 15);

  const color = isDeep ? '#22d3ee' : '#a5f3fc';
  const emissiveColor = isDeep ? '#22d3ee' : '#0891b2';
  const emissiveIntensity = isDeep ? 0.8 : 0.1;

  const tentacles = useMemo(() => {
    const lines: THREE.Line[] = [];
    const tentacleCount = 6;
    for (let t = 0; t < tentacleCount; t++) {
      const points = [];
      const angle = (t / tentacleCount) * Math.PI * 2;
      const radius = 0.3;
      for (let p = 0; p < 8; p++) {
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            -p * 0.2,
            Math.sin(angle) * radius
          )
        );
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: isDeep ? '#22d3ee' : '#a5f3fc',
        transparent: true,
        opacity: 0.4,
      });
      lines.push(new THREE.Line(geom, mat));
    }
    return lines;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { depth } = globalScrollState;
    const currentlyVisible = depth > 5 && depth < 50;

    groupRef.current.visible = currentlyVisible;
    isVisible.current = currentlyVisible;
    if (!currentlyVisible) return;

    const visibility = Math.max(0, 1 - Math.max(0, depth - 55) / 15);

    if (bellRef.current && bellRef.current.material && !Array.isArray(bellRef.current.material)) {
      (bellRef.current.material as any).opacity = 0.5 * visibility;
      // @ts-ignore
      bellRef.current.material.emissiveIntensity = depth > 50 ? 0.8 : 0.2;
    }

    const t = clock.getElapsedTime() * speed;

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.5;
      groupRef.current.position.x = position[0] + Math.sin(t * speed * 0.3 + phase) * 0.3;
    }

    if (bellRef.current) {
      const pulse = 1 + Math.sin(t * speed * 2 + phase) * 0.1;
      bellRef.current.scale.set(pulse, 0.9 + Math.sin(t * speed * 2 + phase) * 0.15, pulse);
    }

    tentacles.forEach((line, tIdx) => {
      const pos = line.geometry.attributes.position;
      const angle = (tIdx / 6) * Math.PI * 2;
      for (let p = 0; p < pos.count; p++) {
        const sway = Math.sin(t * speed + p * 0.5 + phase + tIdx) * 0.05 * p;
        pos.setX(p, Math.cos(angle) * 0.3 + sway);
        pos.setZ(p, Math.sin(angle) * 0.3 + sway * 0.5);
      }
      pos.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      

      
      <mesh ref={bellRef}>
        <sphereGeometry args={[0.5, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          emissive="#22d3ee"
          emissiveIntensity={0.2}
          roughness={0.1}
          transmission={0.8}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      
      <mesh scale={0.7}>
        <sphereGeometry args={[0.5, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={(isDeep ? 0.3 : 0.1) * visibility}
        />
      </mesh>

      
      {visibility > 0 && tentacles.map((line, i) => {
        (line.material as THREE.LineBasicMaterial).opacity = 0.4 * visibility;
        return <primitive key={i} object={line} />;
      })}
    </group>
  );
}