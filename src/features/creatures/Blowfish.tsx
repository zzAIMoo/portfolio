import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { globalScrollState } from '@/hooks/useScrollDepth';

interface BlowfishProps {
  count?: number;
}

export function Blowfish({ count = 6 }: BlowfishProps) {
  const { scene } = useGLTF('/models/Blowfish.glb');

  const fishData = useMemo(() => {
    const bones = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    const cellWidth = 20 / gridSize;
    const cellHeight = 12 / gridSize;

    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        
        bones.push({
          position: [
            (col - gridSize/2) * cellWidth + (Math.random() - 0.5) * (cellWidth * 0.8),
            (row - gridSize/2) * cellHeight + (Math.random() - 0.5) * (cellHeight * 0.8),
            -5 - Math.random() * 6,
          ] as [number, number, number],
          rotation: [
            Math.random() * 0.4 - 0.2,
            Math.random() * Math.PI * 2,
            0
          ] as [number, number, number],
          scale: 0.10 + Math.random() * 0.08, 
          speed: 0.02 + Math.random() * 0.03,
          phase: Math.random() * Math.PI * 2,
        });
    }
    return bones;
  }, [count]);

  return (
    <group>
      {fishData.map((data, i) => (
        <SingleBlowfish
          key={i}
          scene={scene}
          data={data}
        />
      ))}
    </group>
  );
}

function SingleBlowfish({ scene, data }: { scene: THREE.Group, data: any }) {
  const meshRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const { depth } = globalScrollState;
    const t = clock.getElapsedTime();

    const fadeIn = Math.min(1, Math.max(0, (depth - 30) / 5));
    const fadeOut = Math.max(0, 1 - Math.max(0, depth - 45) / 5);
    const visibility = Math.min(fadeIn, fadeOut);

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          mesh.material.transparent = true;
          mesh.material.opacity = visibility;
        }
      }
    });

    const phase = t * data.speed + data.phase;
    meshRef.current.position.x = data.position[0] + Math.sin(phase) * 3;
    meshRef.current.position.y = data.position[1] + Math.cos(phase * 0.5) * 1.5;
    meshRef.current.position.z = data.position[2] + Math.sin(phase * 0.2) * 2;

    const puff = 1 + Math.pow(Math.sin(t * 0.5 + data.phase), 2) * 0.3;
    meshRef.current.scale.setScalar(data.scale * puff);

    meshRef.current.rotation.y = data.rotation[1] + Math.sin(t * 0.2 + data.phase) * 0.3;
    meshRef.current.rotation.z = Math.sin(t * 0.4 + data.phase) * 0.1;
    meshRef.current.visible = visibility > 0.01;
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      position={data.position}
      rotation={data.rotation}
    />
  );
}
