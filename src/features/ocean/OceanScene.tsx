import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Particles } from './Particles';
import { CausticsPlane } from './CausticsPlane';
import { WaterSurface } from './WaterSurface';
import { GodRays } from './GodRays';
import { getWaterColorAtDepth, getLightAtDepth } from '@/utils/depthZones';
import { Jellyfish } from '@/features/creatures/Jellyfish';
import { FishSchool } from '@/features/creatures/FishSchool';
import { Anglerfish } from '@/features/creatures/Anglerfish';
import { Blowfish } from '@/features/creatures/Blowfish';
import { FishBone } from '@/features/creatures/FishBone';
import { Titanic } from '@/features/creatures/Titanic';
import { HadalBottom } from '@/features/creatures/HadalBottom';
import { Freediver } from '@/features/freediver/Freediver';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function OceanScene() {
  const fogRef = useRef<THREE.FogExp2>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const [loadPhase, setLoadPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setLoadPhase(1), 1500); 
    const t2 = setTimeout(() => setLoadPhase(2), 3000); 
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const initialFogColor = useMemo(() => new THREE.Color(getWaterColorAtDepth(0)), []);
  const initialLightIntensity = getLightAtDepth(0);
  const targetColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ scene }) => {
    const { depth, scrollProgress } = globalScrollState;
    targetColor.set(getWaterColorAtDepth(depth));

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetColor, 0.05);
    } else {
      scene.background = initialFogColor.clone();
    }

    if (fogRef.current) {
      fogRef.current.color.lerp(targetColor, 0.05);
      const targetDensity = 0.008 + scrollProgress * 0.07;
      fogRef.current.density = THREE.MathUtils.lerp(fogRef.current.density, targetDensity, 0.05);
    }

    const lightIntensity = getLightAtDepth(depth);
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        0.15 + lightIntensity * 0.6,
        0.05
      );
    }

    if (dirLightRef.current) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        lightIntensity * 1.5,
        0.05
      );
    }

    if (pointLightRef.current) {
      const showBioluminescence = depth > 45;
      const targetInt = showBioluminescence ? 0.3 : 0;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(pointLightRef.current.intensity, targetInt, 0.05);
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

      <WaterSurface />
      <CausticsPlane />
      <GodRays />
      <Particles />

      <Jellyfish count={15} />
      <FishSchool count={20} />
      
      <FishSchool count={12} speedMultiplier={2.2} />
      <FishSchool count={8} speedMultiplier={3.5} />
      
      {loadPhase >= 1 && (
        <Suspense fallback={null}>
          <Anglerfish />
          <Blowfish count={6} />
          <FishBone />
        </Suspense>
      )}

      {loadPhase >= 2 && (
        <Suspense fallback={null}>
          <Titanic />
          <HadalBottom />
        </Suspense>
      )}

      <Freediver />
    </>
  );
}