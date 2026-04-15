import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
// @ts-ignore
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function FishBone() {
  const { scene } = useGLTF('/models/FishBone.glb');

  const boneData = useMemo(() => {
    const bones = [
      {
        position: [4, -4, -6] as [number, number, number],
        scale: 1.8,
        rotation: [0.5, 1, 0.4] as [number, number, number],
        speed: 0.1,
      },
      {
        position: [-5, -12, -7] as [number, number, number],
        scale: 1.4,
        rotation: [-0.3, 2, 0.1] as [number, number, number],
        speed: 0.08,
      }
    ];

    for (let i = 0; i < 20; i++) {
      bones.push({
        position: [
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.8) * 18,
          -4 - Math.random() * 6
        ] as [number, number, number],
        scale: 0.15 + Math.random() * 0.4,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        speed: 0.05 + Math.random() * 0.1,
      });
    }
    return bones;
  }, []);

  return (
    <group>
      {boneData.map((data, i) => (
        <SingleBone
          key={i}
          scene={scene}
          data={data}
        />
      ))}
    </group>
  );
}

function SingleBone({ scene, data }: { scene: THREE.Group, data: any }) {
  const meshRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const { depth } = globalScrollState;
    const t = clock.getElapsedTime();

    const visibility = Math.min(1, Math.max(0, (depth - 100) / 10));

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach(mat => {
            const m = mat as THREE.MeshStandardMaterial;
            m.transparent = true;
            m.opacity = visibility;
            if (m.color) m.color.set('#e2e2e2');
          });
        }
      }
    });

    meshRef.current.position.y = data.position[1] + Math.sin(t * data.speed) * 0.4;
    meshRef.current.rotation.x = data.rotation[0] + Math.sin(t * 0.2) * 0.1;
    meshRef.current.rotation.z = data.rotation[2] + Math.cos(t * 0.15) * 0.1;
    meshRef.current.visible = visibility > 0.01;
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      position={data.position}
      rotation={data.rotation}
      scale={data.scale}
    />
  );
}
