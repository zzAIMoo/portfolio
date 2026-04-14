import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function Anglerfish() {
  const groupRef = useRef<THREE.Group>(null);
  const lureRef = useRef<THREE.PointLight>(null);
  const lureMeshRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { depth } = globalScrollState;
    const isCurrentlyVisible = depth > 60;

    if (groupRef.current) {
      groupRef.current.visible = isCurrentlyVisible;
    }
    if (!isCurrentlyVisible) return;

    const dynamicVisibility = depth < 30 ? 0 : depth > 150 ? 0 : Math.min(1, Math.min((depth - 30) / 20, (150 - depth) / 20));

    if (bodyRef.current) {
      bodyRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material.opacity = dynamicVisibility;
        }
      });
    }

    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(t * 0.02) * 8;
      groupRef.current.position.z = -6 + Math.sin(t * 0.015) * 2;
      groupRef.current.position.y = -1 + Math.sin(t * 0.03) * 0.5;

      groupRef.current.rotation.y = Math.cos(t * 0.02) > 0 ? 0 : Math.PI;
    }

    if (lureRef.current && lureMeshRef.current) {
      const glow = Math.sin(t * 3) * 0.5 + 1.5;
      lureRef.current.intensity = glow * dynamicVisibility;
      (lureMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow * dynamicVisibility;
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      

      <group ref={bodyRef}>
        
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 6, 5]} />
          <meshPhysicalMaterial
            color="#0f172a"
            roughness={0.9}
            transparent
          />
        </mesh>

        
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.25, 0.6, 4]} />
          <meshPhysicalMaterial
            color="#0f172a"
            roughness={0.9}
            transparent
          />
        </mesh>

        
        <mesh position={[0.35, -0.2, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.3, 0.08, 0.2]} />
          <meshPhysicalMaterial
            color="#1e293b"
            roughness={0.9}
            transparent
          />
        </mesh>
      </group>

      
      <mesh position={[0.4, 0.5, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      
      <mesh ref={lureMeshRef} position={[0.6, 0.7, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#a5f3fc"
          emissive="#22d3ee"
          emissiveIntensity={2}
          transparent
        />
        <pointLight
          ref={lureRef}
          color="#22d3ee"
          intensity={2}
          distance={5}
          decay={2}
        />
      </mesh>
    </group>
  );
}