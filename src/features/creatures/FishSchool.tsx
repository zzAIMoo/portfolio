import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

interface FishSchoolProps {
  count?: number;
}

export function FishSchool({ count = 20 }: FishSchoolProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const fishData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      radius: 2 + Math.random() * 5,
      speed: 0.05 + Math.random() * 0.1,
      phase: (i / count) * Math.PI * 2,
      yOffset: (Math.random() - 0.5) * 4,
      ySpeed: 0.05 + Math.random() * 0.08,
      zOffset: -4 - Math.random() * 6,
      size: 0.06 + Math.random() * 0.06,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const { depth } = globalScrollState;
    const isVisible = depth < 35;
    meshRef.current.visible = isVisible;
    if (!isVisible) return;

    const visibility = Math.max(0, 1 - Math.max(0, depth - 60) / 20);
    if (meshRef.current.material && !Array.isArray(meshRef.current.material)) {
      meshRef.current.material.opacity = 0.8 * visibility;
      // @ts-ignore
      meshRef.current.material.emissiveIntensity = depth > 50 ? 0.4 : 0.05;
    }

    const t = clock.getElapsedTime();

    fishData.forEach((fish, i) => {
      const angle = t * fish.speed + fish.phase;
      const x = Math.cos(angle) * fish.radius;
      const z = Math.sin(angle) * fish.radius + fish.zOffset;
      const y = fish.yOffset + Math.sin(t * fish.ySpeed + fish.phase) * 0.5;

      dummy.position.set(x, y, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.rotation.z = Math.sin(t * 3 + fish.phase) * 0.1;
      dummy.scale.setScalar(fish.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      
      <coneGeometry args={[1, 3, 4]} />
      <meshPhysicalMaterial
        color="#bae6fd"
        emissive="#0284c7"
        emissiveIntensity={0.05}
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}