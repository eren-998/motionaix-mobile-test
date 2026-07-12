import React, { useRef } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Tunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const time = frame / fps;
      groupRef.current.position.z = (time * 5) % 10;
      groupRef.current.rotation.z = time * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 2]} rotation={[0, 0, i * 0.1]}>
          <torusKnotGeometry args={[3, 0.2, 100, 16]} />
          <meshPhysicalMaterial 
            color={`hsl(${(i * 10) % 360}, 80%, 50%)`} 
            metalness={0.9} 
            roughness={0.1} 
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

export const FractalTunnel: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ThreeCanvas width={width} height={height} gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 5], fov: 75 }}>
        <fog attach="fog" args={["#000", 10, 50]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={5} color="#ffffff" distance={20} />
        <Tunnel />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
