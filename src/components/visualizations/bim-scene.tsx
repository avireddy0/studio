'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Edges } from '@react-three/drei';
import * as THREE from 'three';

// ─── Building Constants ──────────────────────────────
const W = 16;
const D = 10;
const FH = 3.2;
const ST = 0.22;
const WALL_T = 0.1;
const CR = 0.18;
const NUM_FLOORS = 8;

// Column grid: 5 wide x 3 deep = 15 columns
const COLS: [number, number][] = [];
for (let x = 0; x < 5; x++) {
  for (let z = 0; z < 3; z++) {
    COLS.push([
      -W / 2 + 1.2 + x * (W - 2.4) / 4,
      -D / 2 + 1.2 + z * (D - 2.4) / 2,
    ]);
  }
}

type Status = 'COMPLETE' | 'FINISHING' | 'ACTIVE' | 'PLANNED';

const STATUSES: Status[] = [
  'COMPLETE', 'COMPLETE', 'COMPLETE', 'FINISHING',
  'ACTIVE', 'PLANNED', 'PLANNED', 'PLANNED',
];

const THEME = {
  COMPLETE: { slab: '#1a2e28', wall: '#182822', edge: '#007C5A', col: '#152520' },
  FINISHING: { slab: '#1f3a30', wall: '#1a3028', edge: '#007C5A', col: '#182a22' },
  ACTIVE: { slab: '#3a3018', wall: '#332810', edge: '#f59e0b', col: '#2a2515' },
  PLANNED: { slab: '#081418', wall: '#081418', edge: '#00e5ff', col: '#0a1215' },
};

// ─── Floor Slab ──────────────────────────────────────
function Slab({ level, status, selected }: { level: number; status: Status; selected: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const y = level * FH;
  const t = THEME[status];

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    if (status === 'PLANNED') {
      mat.opacity = 0.07 + Math.sin(clock.elapsedTime * 1.5 + level * 0.5) * 0.04;
    }
    mat.emissiveIntensity = selected ? 0.35 + Math.sin(clock.elapsedTime * 3) * 0.15 : 0;
  });

  return (
    <mesh ref={ref} position={[0, y, 0]} castShadow receiveShadow>
      <boxGeometry args={[W, ST, D]} />
      <meshStandardMaterial
        color={t.slab}
        transparent
        opacity={status === 'PLANNED' ? 0.08 : status === 'ACTIVE' ? 0.75 : 1}
        roughness={0.85}
        emissive={t.edge}
        emissiveIntensity={0}
      />
      <Edges color={selected ? '#ffffff' : t.edge} />
    </mesh>
  );
}

// ─── Active Floor Progress Indicator ─────────────────
function ProgressFill({ level }: { level: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const y = level * FH + 0.01;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.12 + Math.sin(clock.elapsedTime * 2) * 0.05;
  });

  return (
    <mesh ref={ref} position={[-W * 0.275, y, 0]}>
      <boxGeometry args={[W * 0.45, ST + 0.02, D]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.12} depthWrite={false} />
    </mesh>
  );
}

// ─── Glass Curtain Walls ─────────────────────────────
function Walls({ level, status }: { level: number; status: Status }) {
  if (status === 'PLANNED') return null;

  const baseY = level * FH + ST / 2;
  const h = FH - ST;
  const cy = baseY + h / 2;
  const t = THEME[status];
  const op = status === 'ACTIVE' ? 0.15 : status === 'FINISHING' ? 0.45 : 0.5;

  return (
    <group>
      {/* Front */}
      <mesh position={[0, cy, D / 2]}>
        <boxGeometry args={[W, h, WALL_T]} />
        <meshStandardMaterial color={t.wall} transparent opacity={op} roughness={0.6} side={THREE.DoubleSide} />
        <Edges color={t.edge} />
      </mesh>
      {/* Back */}
      <mesh position={[0, cy, -D / 2]}>
        <boxGeometry args={[W, h, WALL_T]} />
        <meshStandardMaterial color={t.wall} transparent opacity={op} roughness={0.6} side={THREE.DoubleSide} />
        <Edges color={t.edge} />
      </mesh>
      {/* Left + Right (not on ACTIVE floors — open for construction) */}
      {status !== 'ACTIVE' && (
        <>
          <mesh position={[-W / 2, cy, 0]}>
            <boxGeometry args={[WALL_T, h, D]} />
            <meshStandardMaterial color={t.wall} transparent opacity={op} roughness={0.6} side={THREE.DoubleSide} />
            <Edges color={t.edge} />
          </mesh>
          <mesh position={[W / 2, cy, 0]}>
            <boxGeometry args={[WALL_T, h, D]} />
            <meshStandardMaterial color={t.wall} transparent opacity={op} roughness={0.6} side={THREE.DoubleSide} />
            <Edges color={t.edge} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ─── Wireframe Ghost Volume (planned floors) ─────────
function GhostVolume({ level }: { level: number }) {
  const ref = useRef<THREE.LineSegments>(null!);
  const h = FH - ST;
  const cy = level * FH + ST / 2 + h / 2;

  const geo = useMemo(() => {
    const box = new THREE.BoxGeometry(W, h, D);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, [h]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    (ref.current.material as THREE.LineBasicMaterial).opacity =
      0.15 + Math.sin(clock.elapsedTime * 1.5 + level * 0.7) * 0.08;
  });

  return (
    <lineSegments ref={ref} position={[0, cy, 0]} geometry={geo}>
      <lineBasicMaterial color="#00e5ff" transparent opacity={0.2} />
    </lineSegments>
  );
}

// ─── Structural Columns ──────────────────────────────
function Columns({ level, status }: { level: number; status: Status }) {
  const h = FH - ST;
  const cy = level * FH + ST / 2 + h / 2;
  const t = THEME[status];
  const planned = status === 'PLANNED';

  return (
    <group>
      {COLS.map(([x, z], i) => (
        <mesh key={i} position={[x, cy, z]}>
          <cylinderGeometry args={[CR, CR, h, planned ? 6 : 10]} />
          <meshStandardMaterial
            color={t.col}
            transparent={planned}
            opacity={planned ? 0.12 : 1}
            wireframe={planned}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Elevator Core Shaft ─────────────────────────────
function Core() {
  const totalH = NUM_FLOORS * FH;
  return (
    <mesh position={[0, totalH / 2 + FH / 2, 0]}>
      <boxGeometry args={[3, totalH, 2]} />
      <meshStandardMaterial color="#0a1a15" transparent opacity={0.2} roughness={0.9} side={THREE.DoubleSide} />
      <Edges color="#007C5A" />
    </mesh>
  );
}

// ─── Tower Crane ─────────────────────────────────────
function Crane() {
  const armRef = useRef<THREE.Group>(null!);
  const tH = 34;
  const armL = 20;

  useFrame(({ clock }) => {
    if (armRef.current) {
      armRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.3;
    }
  });

  return (
    <group position={[W / 2 + 2.5, 0, -D / 2 + 1]}>
      {/* Mast */}
      <mesh position={[0, tH / 2, 0]}>
        <boxGeometry args={[0.5, tH, 0.5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.6} />
        <Edges color="#444" />
      </mesh>
      {/* Rotating top */}
      <group ref={armRef} position={[0, tH, 0]}>
        {/* Jib */}
        <mesh position={[armL / 2 - 3, 0.15, 0]}>
          <boxGeometry args={[armL, 0.25, 0.25]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Counter-jib */}
        <mesh position={[-3.5, 0.15, 0]}>
          <boxGeometry args={[5, 0.25, 0.25]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Counterweight */}
        <mesh position={[-5.5, -0.3, 0]}>
          <boxGeometry args={[1.5, 0.8, 0.7]} />
          <meshStandardMaterial color="#555" roughness={0.8} />
        </mesh>
        {/* Cable */}
        <mesh position={[armL - 5, -3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 6]} />
          <meshBasicMaterial color="#999" />
        </mesh>
        {/* Hook block */}
        <mesh position={[armL - 5, -6.2, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.25]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Horizontal Scan Plane ───────────────────────────
function ScanPlane() {
  const ref = useRef<THREE.Mesh>(null!);
  const totalH = NUM_FLOORS * FH + 2;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * 0.12) % 1;
    ref.current.position.y = t * totalH;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.06 + Math.sin(t * Math.PI) * 0.05;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[W + 6, D + 6]} />
      <meshBasicMaterial color="#007C5A" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

// ─── Full Building Assembly ──────────────────────────
function Building({ selectedFloor, onFloorClick }: { selectedFloor: number; onFloorClick: (l: number) => void }) {
  return (
    <group>
      {/* Foundation */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[W + 3, 0.6, D + 3]} />
        <meshStandardMaterial color="#151f1a" roughness={0.95} />
        <Edges color="#007C5A" />
      </mesh>

      {/* 8 Floors */}
      {STATUSES.map((status, i) => {
        const level = i + 1;
        return (
          <group key={level} onClick={(e) => { e.stopPropagation(); onFloorClick(level); }}>
            <Slab level={level} status={status} selected={selectedFloor === level} />
            <Walls level={level} status={status} />
            {status === 'PLANNED' && <GhostVolume level={level} />}
            {status === 'ACTIVE' && <ProgressFill level={level} />}
            <Columns level={level} status={status} />
          </group>
        );
      })}

      {/* Roof wireframe */}
      <mesh position={[0, (NUM_FLOORS + 1) * FH, 0]}>
        <boxGeometry args={[W, ST, D]} />
        <meshStandardMaterial color="#081418" transparent opacity={0.04} />
        <Edges color="#00e5ff" />
      </mesh>

      <Core />
      <Crane />
      <ScanPlane />
    </group>
  );
}

// ─── Main Scene Export ───────────────────────────────
export default function BimScene({
  selectedFloor = 5,
  onFloorSelect,
}: {
  selectedFloor?: number;
  onFloorSelect?: (level: number) => void;
}) {
  return (
    <Canvas
      camera={{ position: [38, 30, 38], fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 50, 120]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[25, 35, 15]} intensity={1} castShadow />
      <directionalLight position={[-15, 20, -20]} intensity={0.3} color="#007C5A" />
      <pointLight position={[0, 5 * FH, 0]} intensity={0.8} color="#f59e0b" distance={15} decay={2} />
      <pointLight position={[0, 7 * FH, 0]} intensity={0.4} color="#00e5ff" distance={12} decay={2} />

      <Suspense fallback={null}>
        <Building selectedFloor={selectedFloor} onFloorClick={(l) => onFloorSelect?.(l)} />

        <Grid
          position={[0, -0.6, 0]}
          cellSize={2}
          cellThickness={0.4}
          cellColor="#007C5A"
          sectionSize={10}
          sectionThickness={0.8}
          sectionColor="#007C5A"
          fadeDistance={70}
          fadeStrength={1.5}
          infiniteGrid
        />
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.05}
        minDistance={18}
        maxDistance={70}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 15, 0]}
      />
    </Canvas>
  );
}
