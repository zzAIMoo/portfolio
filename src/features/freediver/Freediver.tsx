import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { globalScrollState } from '@/hooks/useScrollDepth';

export function Freediver() {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const swimPhase = useRef(0);
  const currentAmplitude = useRef(0);
  const prevScroll = useRef(0);
  const targetRotationZ = useRef(Math.PI);
  const currentRotationZ = useRef(Math.PI);

  const { camera, viewport: baseViewport } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const { scrollProgress } = globalScrollState;
    const viewport = baseViewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, -1));

    const rawDelta = scrollProgress - prevScroll.current;
    prevScroll.current = scrollProgress;

    const targetAmplitude = Math.min(1.0, Math.abs(rawDelta) * 100);
    currentAmplitude.current += (targetAmplitude - currentAmplitude.current) * delta * 5;

    if (rawDelta > 0.0001) {
      targetRotationZ.current = Math.PI;
    } else if (rawDelta < -0.0001) {
      targetRotationZ.current = 0;
    }

    currentRotationZ.current += (targetRotationZ.current - currentRotationZ.current) * delta * 5;

    swimPhase.current += delta * 15 * currentAmplitude.current;

    if (groupRef.current) {
      const y = 3 - scrollProgress * 8;
      groupRef.current.position.y = y + Math.sin(t * 0.5) * 0.15;

      const targetX = (viewport.width / 2) - 0.6;
      groupRef.current.position.x = targetX + Math.sin(t * 0.3) * 0.1;
      groupRef.current.position.z = -1;

      groupRef.current.rotation.z = currentRotationZ.current + Math.sin(t * 0.4) * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.03;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;

      const bodyOpacity = Math.max(0.3, 1 - scrollProgress * 0.7);
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material.opacity = child.name === 'mask' || child.name === 'fin' ? bodyOpacity * 0.9 : bodyOpacity;
        }
      });
    }

    if (leftLegRef.current && rightLegRef.current) {
      const kickAngle = Math.sin(swimPhase.current) * currentAmplitude.current * 0.6;
      leftLegRef.current.rotation.x = kickAngle;
      rightLegRef.current.rotation.x = -kickAngle;
    }
  });

  const suitColor = '#1e293b';
  const skinColor = '#d4a574';

  return (
    <group ref={groupRef} scale={0.35}>
      

      
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.18, 6, 6]} />
        <meshPhysicalMaterial
          color={suitColor}
          roughness={0.8}
          transparent
        />
      </mesh>

      
      <mesh name="mask" position={[0, 0.9, 0.12]}>
        <boxGeometry args={[0.2, 0.1, 0.08]} />
        <meshPhysicalMaterial
          color="#0ea5e9"
          roughness={0.2}
          metalness={0.3}
          transparent
        />
      </mesh>

      
      <mesh position={[0, 0.35, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 4, 6]} />
        <meshPhysicalMaterial
          color={suitColor}
          roughness={0.7}
          transparent
        />
      </mesh>

      
      <mesh position={[0.08, 0.9, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 4]} />
        <meshPhysicalMaterial
          color={suitColor}
          roughness={0.7}
          transparent
        />
      </mesh>
      <mesh position={[-0.08, 0.9, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 4]} />
        <meshPhysicalMaterial
          color={suitColor}
          roughness={0.7}
          transparent
        />
      </mesh>

      
      <group position={[0.08, 0.1, 0]} ref={rightLegRef}>
        
        <mesh position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.07, 0.5, 4, 4]} />
          <meshPhysicalMaterial
            color={suitColor}
            roughness={0.7}
            transparent
          />
        </mesh>
        
        <mesh name="fin" position={[0, -0.8, 0]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.05]} />
          <meshPhysicalMaterial
            color="#0ea5e9"
            roughness={0.3}
            transparent
          />
        </mesh>
      </group>

      
      <group position={[-0.08, 0.1, 0]} ref={leftLegRef}>
        
        <mesh position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.07, 0.5, 4, 4]} />
          <meshPhysicalMaterial
            color={suitColor}
            roughness={0.7}
            transparent
          />
        </mesh>
        
        <mesh name="fin" position={[0, -0.8, 0]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.05]} />
          <meshPhysicalMaterial
            color="#0ea5e9"
            roughness={0.3}
            transparent
          />
        </mesh>
      </group>

      
      <BubbleTrail />
    </group>
  );
}

function BubbleTrail() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((bubble, i) => {
        if (bubble instanceof THREE.Mesh) {
          bubble.position.y = -0.9 - i * 0.2 + Math.sin(t * 2 + i) * 0.05;
          bubble.position.x = Math.sin(t + i * 0.5) * 0.1;
          const s = (0.03 + i * 0.01) * (1 + Math.sin(t * 3 + i) * 0.3);
          bubble.scale.setScalar(s);

          if (bubble.material) {
            bubble.material.opacity = globalScrollState.scrollProgress > 0.02 ? Math.max(0.3, 1 - globalScrollState.scrollProgress * 0.7) * (0.4 - i * 0.08) : 0;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, -0.9 - i * 0.2, 0]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color="#a5f3fc"
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}