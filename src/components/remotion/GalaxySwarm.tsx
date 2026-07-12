import React, { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Swarm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 10000;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Swirl math
      const radius = Math.random() * 5 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2 * (1 / radius); 

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      color.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [particleCount]);

  // Deterministic animation
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = (frame / fps) * 0.5;
      pointsRef.current.rotation.z = (frame / fps) * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

export const GalaxySwarm: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ThreeCanvas width={width} height={height} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.5} />
        <Swarm />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
