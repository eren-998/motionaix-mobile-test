import React, { useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Waves: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const meshRef = useRef<THREE.Mesh>(null);

  const geom = useMemo(() => new THREE.PlaneGeometry(20, 20, 100, 100), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const time = (frame / fps) * 2;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const u = geom.attributes.position.getX(i);
      const v = geom.attributes.position.getY(i);
      // Complex sine wave math for heavy CPU load
      const z = Math.sin(u * 2 + time) * 0.5 + Math.cos(v * 2 + time) * 0.5 + Math.sin(u * v * 0.5 + time) * 0.2;
      positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2, -5]}>
      <meshStandardMaterial color="#0055ff" roughness={0.1} metalness={0.8} />
    </mesh>
  );
};

export const OceanWave: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#87CEEB" }}>
      <ThreeCanvas width={width} height={height} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
        <Waves />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
