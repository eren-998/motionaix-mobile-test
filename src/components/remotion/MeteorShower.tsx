import React, { useRef, useMemo } from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Meteors: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const meteorCount = 1000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const data = useMemo(() => {
    return Array.from({ length: meteorCount }, () => ({
      x: (Math.random() - 0.5) * 50,
      y: Math.random() * 50 + 20,
      z: (Math.random() - 0.5) * 50,
      speed: Math.random() * 20 + 10,
    }));
  }, [meteorCount]);

  useFrame(() => {
    if (!meshRef.current) return;
    const time = frame / fps;
    
    data.forEach((d, i) => {
      // Meteors fall diagonally
      const currentY = d.y - d.speed * time;
      const currentX = d.x - d.speed * 0.5 * time;
      
      // Loop them back to top if they fall too far
      const loopedY = currentY < -10 ? (currentY % 60) + 50 : currentY;
      const loopedX = currentX < -25 ? (currentX % 50) + 25 : currentX;

      dummy.position.set(loopedX, loopedY, d.z);
      dummy.rotation.set(time * 2, time * 2, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, meteorCount]}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#ff5500" emissive="#ff2200" emissiveIntensity={2} roughness={0.8} />
    </instancedMesh>
  );
};

export const MeteorShower: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#020005" }}>
      <ThreeCanvas width={width} height={height} gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 5, 20], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 20, 0]} intensity={2} color="#ffffff" />
        
        {/* Ground */}
        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        
        <Meteors />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
