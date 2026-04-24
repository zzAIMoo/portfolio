import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

interface DeepJellyfishProps {
  count?: number;
}

export function DeepJellyfish({ count = 5 }: DeepJellyfishProps) {
  const jellyData = useMemo(() => {
    const colors = ['#22d3ee', '#a78bfa', '#f472b6', '#4ade80'];
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        -5 - Math.random() * 10,
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.4 + Math.random() * 0.8,
      speed: 0.03 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  return (
    <group>
      {jellyData.map((data, i) => (
        <SingleDeepJelly
          key={i}
          position={data.position}
          color={data.color}
          scale={data.scale}
          speed={data.speed}
          phase={data.phase}
        />
      ))}
    </group>
  );
}

interface SingleDeepJellyProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  phase: number;
}

function SingleDeepJelly({ position, color, scale, speed, phase }: SingleDeepJellyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const bellRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const tentacleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { depth } = globalScrollState;
    const fadeIn = Math.min(1, Math.max(0, (depth - 40) / 20));
    const fadeOut = Math.max(0, 1 - Math.max(0, depth - 120) / 20);
    const visibility = Math.min(fadeIn, fadeOut);

    if (bellRef.current) (bellRef.current.material as THREE.MeshPhysicalMaterial).opacity = visibility * 0.4;
    if (coreRef.current) (coreRef.current.material as THREE.MeshBasicMaterial).opacity = visibility * 0.6;
    if (tentacleRef.current) (tentacleRef.current.material as THREE.MeshBasicMaterial).opacity = visibility * 0.5;

    const t = clock.getElapsedTime();

    groupRef.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.5;
    groupRef.current.position.x = position[0] + Math.sin(t * speed * 0.5 + phase) * 0.3;
    groupRef.current.rotation.y = t * speed * 0.05;

    if (glowRef.current) {
      glowRef.current.intensity = (1.1 + Math.sin(t * speed * 2 + phase) * 0.4) * visibility;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>

      <mesh ref={bellRef}>
        <sphereGeometry args={[0.6, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          color="#a78bfa"
          emissive="#c084fc"
          emissiveIntensity={0.8}
          roughness={0.1}
          transmission={0.9}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={coreRef} scale={0.3}>
        <sphereGeometry args={[0.6, 6, 6]} />
        <meshBasicMaterial
          color="#f472b6"
          transparent
        />
      </mesh>

      <mesh ref={tentacleRef} position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.03, 6, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
        />
      </mesh>

      <pointLight
        ref={glowRef}
        color={color}
        intensity={0.8}
        distance={4}
        decay={2}
      />
    </group>
  );
}