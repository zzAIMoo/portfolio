import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
// @ts-ignore
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { globalScrollState } from '@/hooks/useScrollDepth';
import { useHadalMode } from '@/context/HadalModeContext';

export function Anglerfish() {
  const { scene, animations } = useGLTF('/models/Anglerfish.glb');
  const { isHadalModeActive } = useHadalMode();

  if (isHadalModeActive) return null;
  return <AnglerHuntLoop scene={scene} animations={animations} />;
}

function AnglerHuntLoop({ scene, animations }: { scene: THREE.Group, animations: any[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const preyRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, groupRef);

  const doryAsset = useGLTF('/models/Clownfish.glb');
  const clonedPrey = useMemo(() => SkeletonUtils.clone(doryAsset.scene), [doryAsset.scene]);
  const preyAnimations = useAnimations(doryAsset.animations, preyRef);

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
      actions[names[0]]!.timeScale = 0.6;
    }
    if (preyAnimations.names.length > 0) {
      preyAnimations.actions[preyAnimations.names[0]]?.reset().play();
      preyAnimations.actions[preyAnimations.names[0]]!.timeScale = 2.0;
    }
  }, [actions, names, preyAnimations]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !preyRef.current) return;
    const { depth } = globalScrollState;
    const t = clock.getElapsedTime();

    const visibility = Math.min(1, Math.max(0, (depth - 125) / 25));

    clonedScene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach(mat => {
            const m = mat as THREE.MeshStandardMaterial;
            m.transparent = true;
            m.opacity = visibility;
          });
        }
      }
    });

    const loopDuration = 12;
    const cycle = t % loopDuration;
    const progress = cycle / loopDuration;

    let x, z, rotY;
    const baseY = -3;

    if (progress < 0.5) {
      const p = progress * 2;
      x = -15 + p * 30;
      z = -8;
      rotY = Math.PI / 2;
    } else {
      const p = (progress - 0.5) * 2;
      x = 15 - p * 30;
      z = -12;
      rotY = -Math.PI / 2;
    }

    groupRef.current.position.set(x, baseY, z);
    groupRef.current.rotation.y = rotY;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;

    const preyX = x + (progress < 0.5 ? 2.5 : -2.5);
    const preyY = baseY - 0.5 + Math.sin(t * 8) * 0.2;
    const preyZ = z + Math.cos(t * 2) * 0.5;
    preyRef.current.position.set(preyX, preyY, preyZ);
    preyRef.current.rotation.y = rotY;

    groupRef.current.visible = visibility > 0.01;
    preyRef.current.visible = visibility > 0.01;
  });

  return (
    <>
      <group ref={groupRef} scale={1.2}>
        <primitive object={clonedScene} />
      </group>
      <group ref={preyRef} scale={0.3}>
        <primitive object={clonedPrey} />
      </group>
    </>
  );
}