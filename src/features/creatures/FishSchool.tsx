import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
// @ts-ignore
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { globalScrollState } from '@/hooks/useScrollDepth';

interface FishSchoolProps {
  count?: number;
  speedMultiplier?: number;
}

type SpeciesIdx = 'clown' | 'dory';

const SPECIES_CONFIG: Record<SpeciesIdx, { path: string, scaleAdj: number, rotationOffset: number }> = {
  clown: { path: '/models/Clownfish.glb', scaleAdj: 1.0, rotationOffset: 0 },
  dory: { path: '/models/DoryFish.glb', scaleAdj: 1.0, rotationOffset: 0 },
};

export function FishSchool({ count = 20, speedMultiplier = 1.0 }: FishSchoolProps) {
  const clownAsset = useGLTF(SPECIES_CONFIG.clown.path);
  const doryAsset = useGLTF(SPECIES_CONFIG.dory.path);

  const assets = useMemo(() => ({
    clown: clownAsset,
    dory: doryAsset
  }), [clownAsset, doryAsset]);

  const fishData = useMemo(() => {
    return Array.from({ length: count }, () => {
      const isSolo = Math.random() < 0.3;
      const rand = Math.random();
      const species: SpeciesIdx = rand < 0.5 ? 'clown' : 'dory';

      return {
        species,
        isSolo,
        phase: Math.random() * Math.PI * 2,
        speed: (0.05 + Math.random() * 0.1) * speedMultiplier,
        size: (0.02 + Math.random() * 0.02) * SPECIES_CONFIG[species].scaleAdj,
        soloPos: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 8,
          -4 - Math.random() * 8,
        ] as [number, number, number],
        soloRadius: 3 + Math.random() * 6,
        schoolOffset: [
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        ] as [number, number, number],
      };
    });
  }, [count, speedMultiplier]);

  return (
    <group>
      {fishData.map((data, i) => (
        <SingleFish
          key={i}
          asset={assets[data.species]}
          data={data}
          speedMultiplier={speedMultiplier}
        />
      ))}
    </group>
  );
}

function SingleFish({ asset, data, speedMultiplier }: { asset: any, data: any, speedMultiplier: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => SkeletonUtils.clone(asset.scene), [asset.scene]);
  const { actions, names } = useAnimations(asset.animations, groupRef);

  useEffect(() => {
    if (names.length > 0) {
      const action = actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
        action.timeScale = (0.8 + Math.random() * 0.4) * speedMultiplier;
      }
    }
  }, [actions, names, speedMultiplier]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { depth } = globalScrollState;
    const t = clock.getElapsedTime();

    const visibility = Math.max(0, 1 - Math.max(0, depth - 25) / 5);

    clonedScene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach(mat => {
            const m = mat as THREE.MeshStandardMaterial;
            m.transparent = true;
            m.opacity = 0.95 * visibility;
          });
        }
      }
    });

    const prevPos = groupRef.current.position.clone();

    if (data.isSolo) {
      const angle = t * data.speed + data.phase;
      const x = data.soloPos[0] + Math.cos(angle) * data.soloRadius;
      const z = data.soloPos[2] + Math.sin(angle * 0.7) * (data.soloRadius * 0.4);
      const y = data.soloPos[1] + Math.sin(t * 0.3 + data.phase) * 1.2;
      groupRef.current.position.set(x, y, z);
    } else {
      const schoolAngle = t * 0.12 * speedMultiplier;
      const schoolX = Math.sin(schoolAngle) * 7;
      const schoolZ = -7 + Math.cos(schoolAngle * 0.4) * 5;
      const schoolY = Math.sin(t * 0.25) * 1.5;
      const x = schoolX + data.schoolOffset[0];
      const y = schoolY + data.schoolOffset[1] + Math.sin(t * 0.4 + data.phase) * 0.2;
      const z = schoolZ + data.schoolOffset[2];
      groupRef.current.position.set(x, y, z);
    }

    const moveVec = groupRef.current.position.clone().sub(prevPos);
    if (moveVec.length() > 0.001) {
      const targetRotY = Math.atan2(moveVec.x, moveVec.z);
      let diff = targetRotY - groupRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.05;
      const tiltX = -moveVec.y * 15;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, 0.05);
    }

    groupRef.current.rotation.z = Math.sin(t * 2 + data.phase) * 0.05;
    groupRef.current.visible = visibility > 0.01;
  });

  return (
    <group ref={groupRef} scale={data.size}>
      <primitive object={clonedScene} />
    </group>
  );
}