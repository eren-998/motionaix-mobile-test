import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
  continueRender,
  delayRender,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════════
   TYPES & CITY DATA
   ═══════════════════════════════════════════════════════════════════════ */

export type City = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export const CITIES: City[] = [
  { id: "la", name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { id: "ny", name: "New York", lat: 40.7128, lon: -74.006 },
  { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522 },
  { id: "london", name: "London", lat: 51.5074, lon: -0.1278 },
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { id: "dubai", name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { id: "mumbai", name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { id: "singapore", name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { id: "cairo", name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { id: "rio", name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
  { id: "cape_town", name: "Cape Town", lat: -33.9249, lon: 18.4241 },
  { id: "beijing", name: "Beijing", lat: 39.9042, lon: 116.4074 },
  { id: "toronto", name: "Toronto", lat: 43.6532, lon: -79.3832 },
  { id: "moscow", name: "Moscow", lat: 55.7558, lon: 37.6173 },
  { id: "sao_paulo", name: "São Paulo", lat: -23.5505, lon: -46.6333 },
];

export type EarthTravelProps = {
  origin: string;
  destination: string;
};

/* ═══════════════════════════════════════════════════════════════════════
   MATH
   ═══════════════════════════════════════════════════════════════════════ */

const EARTH_RADIUS = 2;

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/* Build the cubic bezier arc between two points on the globe */
function buildFlightCurve(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3
): THREE.CubicBezierCurve3 {
  const dist = startVec.distanceTo(endVec);
  const arcHeight = Math.max(0.3, dist * 0.28);
  const mid = startVec
    .clone()
    .lerp(endVec, 0.5)
    .normalize()
    .multiplyScalar(EARTH_RADIUS + arcHeight);
  const cp1 = startVec
    .clone()
    .lerp(mid, 0.4)
    .normalize()
    .multiplyScalar(EARTH_RADIUS + arcHeight * 0.8);
  const cp2 = endVec
    .clone()
    .lerp(mid, 0.4)
    .normalize()
    .multiplyScalar(EARTH_RADIUS + arcHeight * 0.8);
  return new THREE.CubicBezierCurve3(startVec, cp1, cp2, endVec);
}

/* ═══════════════════════════════════════════════════════════════════════
   EARTH TEXTURE — always returns a valid texture (sync fallback)
   ═══════════════════════════════════════════════════════════════════════ */

function createFallbackTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  // Ocean gradient
  const grad = ctx.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, "#1a5276");
  grad.addColorStop(0.35, "#2980b9");
  grad.addColorStop(0.5, "#5dade2");
  grad.addColorStop(0.65, "#2980b9");
  grad.addColorStop(1, "#1a5276");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);
  // Grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * c.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(c.width, y);
    ctx.stroke();
  }
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * c.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, c.height);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createGeoTexture(geojsonData: any): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 4096;
  c.height = 2048;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#6eb3fa";
  ctx.fillRect(0, 0, c.width, c.height);

  const drawPoly = (ring: number[][]) => {
    ctx.beginPath();
    ring.forEach((coords, i) => {
      const x = ((coords[0] + 180) / 360) * c.width;
      const y = ((90 - coords[1]) / 180) * c.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  ctx.fillStyle = "#e8d890";
  ctx.strokeStyle = "#c4b570";
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";

  geojsonData.features.forEach((f: any) => {
    const g = f.geometry;
    if (g.type === "Polygon") g.coordinates.forEach(drawPoly);
    else if (g.type === "MultiPolygon")
      g.coordinates.forEach((p: number[][][]) => p.forEach(drawPoly));
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/* ═══════════════════════════════════════════════════════════════════════
   DETERMINISTIC CAMERA — no lerp, pure function of progress
   ═══════════════════════════════════════════════════════════════════════ */

function computeCameraState(
  progress: number,
  flightProg: number,
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  curve: THREE.CubicBezierCurve3
): { pos: THREE.Vector3; target: THREE.Vector3 } {
  if (progress < 0.08) {
    // Phase 1: Show origin
    const n = startVec.clone().normalize();
    const pos = n.clone().multiplyScalar(5.2);
    pos.y += 1.2;
    return { pos, target: new THREE.Vector3(0, 0, 0) };
  }

  if (progress < 0.18) {
    // Phase 2: Transition to route overview
    const t = interpolate(progress, [0.08, 0.18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    });
    const n1 = startVec.clone().normalize();
    const p1 = n1.clone().multiplyScalar(5.2);
    p1.y += 1.2;

    const midN = startVec.clone().add(endVec).normalize();
    const p2 = midN.clone().multiplyScalar(5.8);
    p2.y += 1.8;

    return { pos: p1.lerp(p2, t), target: new THREE.Vector3(0, 0, 0) };
  }

  if (progress < 0.82) {
    // Phase 3: Cinematic follow — directly behind & above plane
    const planePos = curve.getPoint(flightProg);
    const tangent = curve.getTangent(flightProg);
    const up = planePos.clone().normalize();

    const behind = tangent.clone().multiplyScalar(-1.5);
    const above = up.clone().multiplyScalar(0.85);
    const pos = planePos.clone().add(behind).add(above);

    return { pos, target: planePos };
  }

  // Phase 4: Arrival at destination
  const t = interpolate(progress, [0.82, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const planePos = curve.getPoint(flightProg);
  const tangent = curve.getTangent(Math.min(flightProg, 0.98));
  const up = planePos.clone().normalize();
  const followPos = planePos
    .clone()
    .add(tangent.clone().multiplyScalar(-1.5))
    .add(up.clone().multiplyScalar(0.85));

  const endN = endVec.clone().normalize();
  const arrivePos = endN.clone().multiplyScalar(4.2);
  arrivePos.y += 0.8;

  return {
    pos: followPos.lerp(arrivePos, t),
    target: new THREE.Vector3(0, 0, 0).lerp(new THREE.Vector3(0, 0, 0), t),
  };
}

/* Camera applier inside ThreeCanvas */
const CameraSync: React.FC<{
  pos: THREE.Vector3;
  target: THREE.Vector3;
}> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.copy(pos);
  camera.lookAt(target);
  return null;
};

/* ═══════════════════════════════════════════════════════════════════════
   AIRPLANE
   ═══════════════════════════════════════════════════════════════════════ */

const Airplane: React.FC<{
  position: THREE.Vector3;
  lookTarget: THREE.Vector3;
}> = ({ position, lookTarget }) => {
  const ref = useRef<THREE.Group>(null);
  // orient every render
  if (ref.current) ref.current.lookAt(lookTarget);

  return (
    <group ref={ref} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.22, 12]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.28, 0.01, 0.08]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.04, -0.08]}>
        <boxGeometry args={[0.01, 0.08, 0.06]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   3D SCENE
   ═══════════════════════════════════════════════════════════════════════ */

const EarthScene: React.FC<{
  startVec: THREE.Vector3;
  endVec: THREE.Vector3;
  curve: THREE.CubicBezierCurve3;
  flightProgress: number;
  cameraPos: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  earthTexture: THREE.CanvasTexture | null;
}> = ({
  startVec,
  endVec,
  curve,
  flightProgress,
  cameraPos,
  cameraTarget,
  earthTexture,
}) => {
  /* ── Trail — quantized to ~50 updates (not every frame!) ── */
  const quantizedProg = Math.round(flightProgress * 50) / 50;
  const trailGeo = useMemo(() => {
    if (quantizedProg <= 0.02) return null;
    const pts: THREE.Vector3[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      pts.push(curve.getPoint((i / steps) * quantizedProg));
    }
    const sub = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(sub, 24, 0.012, 4, false);
  }, [curve, quantizedProg]);

  /* ── Plane pos & look-at ── */
  const planePos = useMemo(
    () => curve.getPoint(flightProgress),
    [curve, flightProgress]
  );
  const planeLook = useMemo(
    () => curve.getPoint(Math.min(flightProgress + 0.02, 1)),
    [curve, flightProgress]
  );

  const showPlane = flightProgress > 0.01 && flightProgress < 0.99;

  return (
    <>
      {/* Sync camera */}
      <CameraSync pos={cameraPos} target={cameraTarget} />

      {/* Lighting */}
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 3, 5]} intensity={0.6} />

      {/* Earth */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        {earthTexture ? (
          <meshBasicMaterial map={earthTexture} />
        ) : (
          <meshBasicMaterial color="#2980b9" />
        )}
      </mesh>

      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.018, 48, 48]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Origin pin */}
      <mesh position={startVec}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      {/* Destination pin */}
      <mesh position={endVec}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>

      {/* Trail */}
      {trailGeo && (
        <mesh geometry={trailGeo}>
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      )}

      {/* Plane */}
      {showPlane && <Airplane position={planePos} lookTarget={planeLook} />}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPOSITION
   ═══════════════════════════════════════════════════════════════════════ */

export const EarthTravel: React.FC<EarthTravelProps> = ({
  origin = "mumbai",
  destination = "tokyo",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  /* ── Interactive city selector (works in Studio preview) ── */
  const [selOrigin, setSelOrigin] = useState(origin);
  const [selDest, setSelDest] = useState(destination);

  const originCity = CITIES.find((c) => c.id === selOrigin) || CITIES[0];
  const destCity = CITIES.find((c) => c.id === selDest) || CITIES[4];

  /* ── Earth texture — start with sync fallback, upgrade async ── */
  const [earthTexture, setEarthTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Load fallback texture on mount
    const fb = createFallbackTexture();
    if (fb) {
      setEarthTexture(fb);
    }

    fetch(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    )
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          const tex = createGeoTexture(data);
          if (tex) setEarthTexture(tex);
        }
      })
      .catch((err) => {
        console.warn("Failed to load map texture, using fallback grid:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Precompute vectors & curve ── */
  const startVec = useMemo(
    () => latLonToVec3(originCity.lat, originCity.lon, EARTH_RADIUS),
    [originCity]
  );
  const endVec = useMemo(
    () => latLonToVec3(destCity.lat, destCity.lon, EARTH_RADIUS),
    [destCity]
  );
  const curve = useMemo(
    () => buildFlightCurve(startVec, endVec),
    [startVec, endVec]
  );

  /* ═══ TIMELINE ═══ */
  const totalProgress = frame / durationInFrames;

  const rawFlight = interpolate(totalProgress, [0.1, 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flightProgress = easeInOutQuad(rawFlight);
  const cameraProgress = totalProgress;

  /* ── Camera (deterministic, pure function) ── */
  const { pos: camPos, target: camTarget } = useMemo(
    () => computeCameraState(cameraProgress, flightProgress, startVec, endVec, curve),
    [cameraProgress, flightProgress, startVec, endVec, curve]
  );

  /* ── Label opacities ── */
  const originLabelOp = interpolate(
    totalProgress,
    [0.02, 0.08, 0.92, 0.97],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const destLabelOp = interpolate(
    totalProgress,
    [0.05, 0.12, 0.92, 0.97],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const selectorOp = interpolate(
    totalProgress,
    [0.0, 0.04, 0.93, 0.97],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const exitOp = interpolate(totalProgress, [0.95, 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const font = "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";

  return (
    <AbsoluteFill style={{ backgroundColor: "#020813" }}>
      {/* ── 3D Globe ── */}
      <ThreeCanvas width={width} height={height}>
        <EarthScene
          startVec={startVec}
          endVec={endVec}
          curve={curve}
          flightProgress={flightProgress}
          cameraPos={camPos}
          cameraTarget={camTarget}
          earthTexture={earthTexture}
        />
      </ThreeCanvas>

      {/* ── Top Selector Bar ── */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: selectorOp,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          padding: "8px 16px",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          fontFamily: font,
          zIndex: 20,
        }}
      >
        {/* Origin select */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              flexShrink: 0,
            }}
          />
          <select
            value={selOrigin}
            onChange={(e) => setSelOrigin(e.target.value)}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
              background: "white",
              cursor: "pointer",
              outline: "none",
              fontFamily: font,
            }}
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Arrow */}
        <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 700 }}>→</span>

        {/* Destination select */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              flexShrink: 0,
            }}
          />
          <select
            value={selDest}
            onChange={(e) => setSelDest(e.target.value)}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 13,
              fontWeight: 700,
              color: "#0f172a",
              background: "white",
              cursor: "pointer",
              outline: "none",
              fontFamily: font,
            }}
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Origin City Label ── */}
      <div
        style={{
          position: "absolute",
          left: "12%",
          bottom: "18%",
          transform: "translateX(-50%)",
          opacity: originLabelOp,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "white",
            color: "#0f172a",
            fontWeight: 700,
            fontSize: 14,
            padding: "6px 16px",
            borderRadius: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 7,
            whiteSpace: "nowrap",
            fontFamily: font,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#dc2626",
            }}
          />
          {originCity.name}
        </div>
        <div
          style={{
            width: 2,
            height: 24,
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* ── Destination City Label ── */}
      <div
        style={{
          position: "absolute",
          right: "12%",
          bottom: "18%",
          transform: "translateX(50%)",
          opacity: destLabelOp,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "white",
            color: "#0f172a",
            fontWeight: 700,
            fontSize: 14,
            padding: "6px 16px",
            borderRadius: 20,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 7,
            whiteSpace: "nowrap",
            fontFamily: font,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#2563eb",
            }}
          />
          {destCity.name}
        </div>
        <div
          style={{
            width: 2,
            height: 24,
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* ── Exit fade ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#020813",
          opacity: exitOp,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
