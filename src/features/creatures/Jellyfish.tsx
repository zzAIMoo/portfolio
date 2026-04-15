import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { globalScrollState } from '@/hooks/useScrollDepth';

interface JellyfishProps {
  count?: number;
}

const JELLY_PALETTE = [
  { color: '#bae6fd', emissive: '#22d3ee' },
  { color: '#fbcfe8', emissive: '#f472b6' },
  { color: '#ddd6fe', emissive: '#8b5cf6' },
  { color: '#e9d5ff', emissive: '#c084fc' },
  { color: '#86efac', emissive: '#22c55e' },
  { color: '#fef08a', emissive: '#eab308' },
];

export function Jellyfish({ count = 3 }: JellyfishProps) {
  const jellyData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        -3 - Math.random() * 8,
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      speedX: 0.02 + Math.random() * 0.05,
      speedY: 0.05 + Math.random() * 0.1,
      ampX: 1 + Math.random() * 2,
      ampY: 0.5 + Math.random() * 1,
      palette: JELLY_PALETTE[Math.floor(Math.random() * JELLY_PALETTE.length)],
      initialRotation: [
        Math.random() * 0.4 - 0.2,
        Math.random() * Math.PI * 2,
        Math.random() * 0.4 - 0.2
      ] as [number, number, number],
    }));
  }, [count]);

  return (
    <group>
      {jellyData.map((data, i) => (
        <SingleJellyfish
          key={i}
          position={data.position}
          scale={data.scale}
          phase={data.phase}
          speedX={data.speedX}
          speedY={data.speedY}
          ampX={data.ampX}
          ampY={data.ampY}
          palette={data.palette}
          initialRotation={data.initialRotation}
        />
      ))}
    </group>
  );
}

interface SingleJellyfishProps {
  position: [number, number, number];
  scale: number;
  phase: number;
  speedX: number;
  speedY: number;
  ampX: number;
  ampY: number;
  palette: { color: string, emissive: string };
  initialRotation: [number, number, number];
}

function SingleJellyfish({
  position,
  scale,
  phase,
  speedX,
  speedY,
  ampX,
  ampY,
  palette,
  initialRotation
}: SingleJellyfishProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/jellyfish.glb');

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPhase: { value: phase },
    uSpeed: { value: (speedX + speedY) / 2 }
  }), [phase, speedX, speedY]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          mesh.material = mesh.material.clone();
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.color.set(palette.color);
          if (mat.emissive) mat.emissive.set(palette.emissive);

          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = uniforms.uTime;
            shader.uniforms.uPhase = uniforms.uPhase;
            shader.uniforms.uSpeed = uniforms.uSpeed;
            shader.vertexShader = `
              uniform float uTime;
              uniform float uPhase;
              uniform float uSpeed;
            ` + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
              #include <begin_vertex>
              float mask = smoothstep(0.2, -0.5, position.y);
              float time = uTime * 2.0 + uPhase;
              float waveX = sin(time + position.y * 2.0) * 0.1 * mask;
              float waveZ = cos(time * 0.8 + position.y * 1.5) * 0.08 * mask;
              float pulse = sin(time * 1.5) * 0.05 * mask;
              transformed.x += waveX;
              transformed.z += waveZ;
              transformed.y += pulse;
            `);
          };
        }
      }
    });
    return clone;
  }, [scene, uniforms, palette]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const { depth } = globalScrollState;

    const fadeIn = Math.min(1, Math.max(0, (depth - 50) / 8));
    const fadeOut = Math.max(0, 1 - Math.max(0, depth - 92) / 8);
    const visibility = Math.min(fadeIn, fadeOut);

    uniforms.uTime.value = clock.getElapsedTime();

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          const mat = mesh.material as any;
          mat.transparent = true;
          mat.opacity = 0.6 * visibility;
          if (mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = 0.8 * visibility;
          }
        }
      }
    });

    const t = clock.getElapsedTime();
    const newX = position[0] + Math.sin(t * speedX + phase) * ampX;
    const newY = position[1] + Math.cos(t * speedY + phase) * ampY;

    groupRef.current.position.x = newX;
    groupRef.current.position.y = newY;
    groupRef.current.rotation.y = initialRotation[1] + Math.sin(t * 0.5 + phase) * 0.1;
    groupRef.current.visible = visibility > 0.01;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}