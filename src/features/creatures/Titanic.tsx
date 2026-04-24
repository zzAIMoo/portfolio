import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function Titanic() {
  const { scene } = useGLTF('/models/TitanicWreckage.glb');
  const groupRef = useRef<THREE.Group>(null);
  const discoveryLightRef = useRef<THREE.PointLight>(null);
  const discoveryLight2Ref = useRef<THREE.PointLight>(null);

  const emissiveColor = useMemo(() => new THREE.Color('#334455'), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { depth } = globalScrollState;
    const t = clock.getElapsedTime();

    const visibility = Math.min(
      Math.max(0, (depth - 3600) / 200),
      Math.max(0, (4300 - depth) / 200)
    );

    scene.traverse((child) => {
      child.visible = visibility > 0.01;
      
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach(mat => {
             const m = mat as THREE.MeshStandardMaterial;
             m.transparent = true;
             m.opacity = Math.min(1, visibility * 1.5); 
             m.emissive = emissiveColor;
             m.emissiveIntensity = visibility * 0.4;
          });
        }
      }
    });

    if (discoveryLightRef.current) {
      discoveryLightRef.current.intensity = visibility * 5000;
    }
    if (discoveryLight2Ref.current) {
      discoveryLight2Ref.current.intensity = visibility * 3000;
    }

    groupRef.current.position.y = -3 + Math.sin(t * 0.2) * 0.15;
    groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.01;
    groupRef.current.visible = visibility > 0.01;
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, -3, -8]} 
      rotation={[0, -Math.PI / 8, 0]} 
      scale={8}
    >
      <primitive object={scene} />
      <pointLight 
        ref={discoveryLightRef}
        position={[0, 5, 10]} 
        intensity={0} 
        distance={60} 
        color="#ffffff" 
      />
      <pointLight 
        ref={discoveryLight2Ref}
        position={[10, 0, 5]} 
        intensity={0} 
        distance={40} 
        color="#22d3ee" 
      />
      <pointLight 
        position={[-10, 2, 5]} 
        intensity={1000} 
        distance={30} 
        color="#ffffff" 
      />
    </group>
  );
}
