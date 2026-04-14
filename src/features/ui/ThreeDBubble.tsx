import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Shadow, OrbitControls, MeshDistortMaterial, Float } from '@react-three/drei';

export function Bubble(props: any) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        distort={0.25}
        transmission={1.05}
        thickness={-0.5}
        roughness={0}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1200]}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

export default function ThreeDBubbleDemo() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0f4061' }}>
      <Canvas camera={{ fov: 65, position: [0, 0, 5] }}>
        <Float floatIntensity={1.5} speed={0.5}>
          <Bubble scale={1.5} />
        </Float>
        <Shadow scale={2} position={[0, -1.35, 0]} opacity={0.15} />
        <OrbitControls />
        <Environment preset="apartment" background={false} blur={1} />
      </Canvas>
    </div>
  );
}