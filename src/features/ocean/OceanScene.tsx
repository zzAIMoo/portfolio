import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Particles } from './Particles';
import { CausticsPlane } from './CausticsPlane';
import { GodRays } from './GodRays';
import { getWaterColorAtDepth, getLightAtDepth } from '@/utils/depthZones';
import { Jellyfish } from '@/features/creatures/Jellyfish';
import { FishSchool } from '@/features/creatures/FishSchool';
import { Anglerfish } from '@/features/creatures/Anglerfish';
import { DeepJellyfish } from '@/features/creatures/DeepJellyfish';
import { Freediver } from '@/features/freediver/Freediver';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function OceanScene() {
  const fogRef = useRef<THREE.FogExp2>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const initialFogColor = useMemo(() => new THREE.Color(getWaterColorAtDepth(0)), []);

  const initialLightIntensity = getLightAtDepth(0);

  useFrame(({ scene }) => {
    const { depth, scrollProgress } = globalScrollState;
    const targetColor = new THREE.Color(getWaterColorAtDepth(depth));

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetColor, 0.05);
    } else {
      scene.background = targetColor.clone();
    }

    if (fogRef.current) {
      fogRef.current.color.lerp(targetColor, 0.05);
      const targetDensity = 0.008 + scrollProgress * 0.07;
      fogRef.current.density = THREE.MathUtils.lerp(fogRef.current.density, targetDensity, 0.05);
    }

    const lightIntensity = getLightAtDepth(depth);
    if (ambientRef.current && Math.abs(ambientRef.current.intensity - (0.15 + lightIntensity * 0.6)) > 0.01) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        0.15 + lightIntensity * 0.6,
        0.05
      );
    }

    if (dirLightRef.current && Math.abs(dirLightRef.current.intensity - (lightIntensity * 1.5)) > 0.01) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        lightIntensity * 1.5,
        0.05
      );
    }

    if (pointLightRef.current) {
      const showBioluminescence = depth > 45;
      const targetInt = showBioluminescence ? 0.3 : 0;
      if (Math.abs(pointLightRef.current.intensity - targetInt) > 0.01) {
        pointLightRef.current.intensity = THREE.MathUtils.lerp(pointLightRef.current.intensity, targetInt, 0.05);
      }
    }
  });

  return (
    <>
      
      <fogExp2 ref={fogRef} attach="fog" args={[initialFogColor, 0.01]} />

      
      <ambientLight ref={ambientRef} intensity={0.5} color="#b3e0ff" />

      
      <directionalLight
        ref={dirLightRef}
        position={[2, 10, 5]}
        intensity={initialLightIntensity * 1.5}
        color="#c5e8ff"
      />

      
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 2]}
        intensity={0}
        color="#22d3ee"
        distance={15}
        decay={2}
      />

      
      <CausticsPlane />

      
      <GodRays />

      
      <Particles />

      
      <Jellyfish count={3} />
      <FishSchool count={20} />
      <Anglerfish />
      <DeepJellyfish count={4} />

      
      <Freediver />
    </>
  );
}