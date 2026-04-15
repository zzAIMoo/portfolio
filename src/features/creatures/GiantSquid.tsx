import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { globalScrollState } from '@/hooks/useScrollDepth';

interface GiantSquidProps {
  count?: number;
}

export function GiantSquid({ count = 1 }: GiantSquidProps) {
  const { scene } = useGLTF('/models/Squid.glb');

  return (
    <group>
      <SingleSquid
        scene={scene}
        position={[6, -2, -10]}
        scale={1.5}
        speed={0.015}
      />
    </group>
  );
}

interface SingleSquidProps {
  scene: THREE.Group;
  position: [number, number, number];
  scale: number;
  speed: number;
}

function SingleSquid({ scene, position, scale, speed }: SingleSquidProps) {
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { depth } = globalScrollState;
    const t = clock.getElapsedTime();

    // Visibility: Starts appearing at 50m (Twilight) so users actually see it
    const visibility = Math.min(1, Math.max(0, (depth - 50) / 40));

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          mesh.material.transparent = true;
          mesh.material.opacity = visibility * 0.7;

          if ('color' in mesh.material) {
            (mesh.material as any).color.lerp(new THREE.Color('#312e81'), 0.05);
          }
          if ('emissiveIntensity' in mesh.material) {
            (mesh.material as any).emissiveIntensity = 0.3 * visibility;
          }
        }
      }
    });

    const prevPos = groupRef.current.position.clone();

    const driftX = Math.sin(t * speed) * 8;
    const driftY = Math.cos(t * speed * 0.8) * 3;
    const driftZ = Math.sin(t * speed * 0.5) * 4;

    groupRef.current.position.x = position[0] + driftX;
    groupRef.current.position.y = position[1] + driftY;
    groupRef.current.position.z = position[2] + driftZ;

    const breath = 1 + Math.sin(t * 0.4) * 0.05;
    groupRef.current.scale.setScalar(scale * breath);

    const moveVec = groupRef.current.position.clone().sub(prevPos);
    if (moveVec.length() > 0.001) {
      const targetRotY = Math.atan2(moveVec.x, moveVec.z) + Math.PI;
      const currentRotY = groupRef.current.rotation.y;
      let diff = targetRotY - currentRotY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.02;

      const tiltX = -moveVec.y * 5;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}
