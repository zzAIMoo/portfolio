import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function GodRays() {
  const groupRef = useRef<THREE.Group>(null);
  const initialDepth = globalScrollState.depth;
  const initialOpacity = Math.max(0, 1 - initialDepth / 40) * 0.3;

  const rays = useMemo(() => {
    const rayData = [];
    for (let i = 0; i < 5; i++) {
      rayData.push({
        x: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 8 - 3,
        width: 0.3 + Math.random() * 0.5,
        height: 20,
        rotZ: (Math.random() - 0.5) * 0.3,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return rayData;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const { depth } = globalScrollState;
    const dynamicOpacity = Math.max(0, 1 - depth / 40) * 0.3;

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const ray = rays[i];
        const mat = child.material as THREE.ShaderMaterial;
        if (mat.uniforms) {
          mat.uniforms.uOpacity.value = dynamicOpacity * (0.5 + 0.5 * Math.sin(t * ray.speed + ray.phase));
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[ray.x, 5, ray.z]}
          rotation={[0, 0, ray.rotZ]}
        >
          <planeGeometry args={[ray.width, ray.height]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            uniforms={{
              uOpacity: { value: initialOpacity },
              uColor: { value: new THREE.Color("#a5d8ff") }
            }}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform float uOpacity;
              uniform vec3 uColor;
              varying vec2 vUv;
              void main() {
                float gradient = pow(vUv.y, 1.5);
                gl_FragColor = vec4(uColor, uOpacity * gradient);
              }
            `}
          />
        </mesh>
      ))}
    </group>
  );
}