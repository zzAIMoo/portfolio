import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function CausticsPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const opacity = Math.max(0, 1 - globalScrollState.depth / 55);

  useFrame(({ clock }) => {
    const { depth } = globalScrollState;
    const opacity = Math.max(0, 1 - depth / 55);
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation-x={-Math.PI / 2}
      position={[0, -5, 0]}
    >
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uOpacity: { value: opacity },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uOpacity;
          varying vec2 vUv;

          float caustic(vec2 uv, float time) {
            vec2 p = uv * 6.0;
            float t = time * 0.4;
            
            float v = 0.0;
            v += sin(p.x * 1.5 + t) * 0.5 + 0.5;
            v += sin(p.y * 1.5 + t * 1.3) * 0.5 + 0.5;
            v += sin((p.x + p.y) * 1.0 + t * 0.7) * 0.5 + 0.5;
            v += sin(length(p) * 2.0 - t) * 0.5 + 0.5;
            
            v /= 4.0;
            v = pow(v, 2.0);
            
            return v;
          }

          void main() {
            float c1 = caustic(vUv, uTime);
            float c2 = caustic(vUv * 1.3 + 0.5, uTime * 0.8);
            float c = (c1 + c2) * 0.5;
            
            vec3 color = mix(
              vec3(0.1, 0.5, 0.7),
              vec3(0.3, 0.8, 1.0),
              c
            );
            
            float alpha = c * uOpacity * 0.4;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}