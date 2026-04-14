import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function GodRays() {
  const groupRef = useRef<THREE.Group>(null);
  const opacity = Math.max(0, 1 - globalScrollState.depth / 40) * 0.3;

  const rays = useMemo(() => {
    const rayData = [];
    for (let i = 0; i < 5; i++) {
      rayData.push({
        x: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 8 - 3,
        width: 0.3 + Math.random() * 0.5,
        height: 20,
        rotZ: (Math.random() - 0.5) * 0.3,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return rayData;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const ray = rays[i];
        const mat = child.material as THREE.MeshBasicMaterial;
        mat.opacity = opacity * (0.5 + 0.5 * Math.sin(t * ray.speed + ray.phase));
      }
    });
  });

  if (opacity <= 0) return null;

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[ray.x, 5, ray.z]}
          rotation={[0, 0, ray.rotZ]}
        >
          <planeGeometry args={[ray.width, ray.height]} />
          <meshBasicMaterial
            color="#a5d8ff"
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}