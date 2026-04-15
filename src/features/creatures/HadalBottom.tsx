import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, Float } from '@react-three/drei';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function HadalBottom() {
  const { scene } = useGLTF('/models/Artifact.glb');
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const discoveryLightsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !glowRef.current) return;
    const { depth } = globalScrollState;
    const t = clock.getElapsedTime();

    const visibility = Math.min(1, Math.max(0, (depth - 10800) / 100));

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach(mat => {
             const m = mat as THREE.MeshStandardMaterial;
             m.transparent = true;
             m.opacity = visibility;
             m.emissiveIntensity = visibility * 1.5; 
             m.roughness = 0.8; 
             m.metalness = 0.2;
             m.needsUpdate = true;
          });
        }
      }
    });

    const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
    glowRef.current.intensity = visibility * (500 + pulse * 500);
    
    if (discoveryLightsRef.current) {
      discoveryLightsRef.current.traverse((light) => {
        if (light instanceof THREE.PointLight) {
          const baseIntensity = light.userData.baseIntensity || 400;
          light.intensity = visibility * baseIntensity;
        }
      });
    }

    if (ringMaterialRef.current) {
      ringMaterialRef.current.opacity = visibility * 0.4;
    }

    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    groupRef.current.visible = visibility > 0.01;
  });

  return (
    <group position={[0, -4.5, -8]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={groupRef} scale={2.5}>
          <primitive object={scene} />
        </group>
      </Float>

      <pointLight 
        ref={glowRef} 
        color="#00ff44" 
        distance={40} 
        decay={2}
      />

      <group ref={discoveryLightsRef}>
        <pointLight position={[3, 3, 3]} intensity={0} distance={20} color="#ffffff" userData={{ baseIntensity: 400 }} />
        <pointLight position={[-3, 3, 3]} intensity={0} distance={20} color="#ffffff" userData={{ baseIntensity: 400 }} />
        <pointLight position={[0, -3, 3]} intensity={0} distance={20} color="#ffffff" userData={{ baseIntensity: 200 }} />
      </group>
      
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <ringGeometry args={[3, 3.2, 64]} />
        <meshBasicMaterial ref={ringMaterialRef} color="#00ff88" transparent opacity={0} />
      </mesh>
    </group>
  );
}
