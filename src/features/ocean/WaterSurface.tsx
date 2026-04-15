import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalScrollState } from '@/hooks/useScrollDepth';

export function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    const { depth } = globalScrollState;

    if (meshRef.current) {
      meshRef.current.position.y = 2 + depth * 0.2;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      const opacity = Math.max(0, 1 - depth / 30);
      materialRef.current.uniforms.uOpacity.value = opacity;

      meshRef.current!.visible = opacity > 0;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation-x={Math.PI / 2}
      position={[0, 2, 0]}
    >
      <planeGeometry args={[50, 50, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={{
          uTime: { value: 0 },
          uOpacity: { value: 1.0 },
          uColor: { value: new THREE.Color('#06b6d4') }
        }}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;

          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                               -0.577350269189626,  // -1.0 + 2.0 * C.x
                                0.024390243902439); // 1.0 / 41.0
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i); 
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
              + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }

          void main() {
            vUv = uv;
            
            float elevation = snoise(vec2(position.x * 0.2 + uTime * 0.2, position.y * 0.2 + uTime * 0.15)) * 0.5;
            elevation += snoise(vec2(position.x * 0.5 - uTime * 0.3, position.y * 0.5 + uTime * 0.1)) * 0.2;
            
            vElevation = elevation;
            
            vec3 newPosition = position;
            newPosition.z += elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uOpacity;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            float radialMask = 1.0 - smoothstep(0.3, 0.5, dist);
            
            vec3 waveColor = mix(uColor * 0.6, uColor * 1.5, (vElevation + 0.7) / 1.4);
            
            float alpha = uOpacity * radialMask * 0.8;
            gl_FragColor = vec4(waveColor, alpha);
          }
        `}
      />
    </mesh>
  );
}
