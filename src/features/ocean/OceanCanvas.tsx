import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OceanScene } from './OceanScene';

export function OceanCanvas() {
  return (
    <div className="ocean-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
        dpr={1}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <OceanScene />
        </Suspense>
      </Canvas>
    </div>
  );
}