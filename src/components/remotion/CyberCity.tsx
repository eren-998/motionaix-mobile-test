import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CityGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create a lot of boxes to simulate buildings
  const buildings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      const height = Math.random() * 5 + 1;
      arr.push({ x, z, height });
    }
    return arr;
  }, []);

  return (
    <group position={[0, -2, (frame / fps) * 10 % 40]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z - 20]}>
          <boxGeometry args={[1, b.height, 1]} />
          <meshStandardMaterial color="#0f0f1b" wireframe={Math.random() > 0.8} emissive="#ff00ff" emissiveIntensity={Math.random() > 0.9 ? 1 : 0} />
          <lineSegments>
            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, b.height, 1)]} />
            <lineBasicMaterial attach="material" color="#00ffff" />
          </lineSegments>
        </mesh>
      ))}
      <gridHelper args={[80, 80, "#ff00ff", "#00ffff"]} position={[0, 0, -20]} />
    </group>
  );
};

export const CyberCity: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050510" }}>
      <ThreeCanvas width={width} height={height} gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 2, 10], fov: 60 }}>
        <fog attach="fog" args={["#050510", 10, 30]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ff00ff" />
        <CityGrid />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
