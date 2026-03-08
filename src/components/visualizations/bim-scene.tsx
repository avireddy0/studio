'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Edges, Environment, ContactShadows, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

// ─── Building Constants ──────────────────────────────
const W = 16;
const D = 10;
const FH = 3.2;
const ST = 0.22;
const WALL_T = 0.12;
const CR = 0.2;
const NUM_FLOORS = 8;
const MULLION = 0.04;

// ─── Procedural Concrete Texture ─────────────────────
function makeConcreteTexture(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    // Multi-octave noise for concrete grain
    const x = i % size;
    const y = Math.floor(i / size);
    const n1 = Math.sin(x * 0.15) * Math.cos(y * 0.12) * 30;
    const n2 = Math.sin(x * 0.4 + 1.5) * Math.cos(y * 0.35 + 2.1) * 15;
    const n3 = Math.random() * 20; // fine grain noise
    const v = 128 + n1 + n2 + n3;
    const clamped = Math.max(80, Math.min(200, v));
    const idx = i * 4;
    data[idx] = clamped;
    data[idx + 1] = clamped;
    data[idx + 2] = clamped;
    data[idx + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.needsUpdate = true;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Shared texture instances
let _concreteTex: THREE.DataTexture | null = null;
function getConcreteRoughnessMap() {
  if (!_concreteTex) _concreteTex = makeConcreteTexture();
  return _concreteTex;
}

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

// ─── Floor Slab ──────────────────────────────────────
function Slab({ level, status, selected }: { level: number; status: Status; selected: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const y = level * FH;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshPhysicalMaterial;
    if (status === 'PLANNED') {
      mat.opacity = 0.06 + Math.sin(clock.elapsedTime * 1.5 + level * 0.5) * 0.03;
    }
    mat.emissiveIntensity = selected ? 0.3 + Math.sin(clock.elapsedTime * 3) * 0.12 : 0;
  });

  const color = status === 'COMPLETE' ? '#2a3d35'
    : status === 'FINISHING' ? '#2d4438'
    : status === 'ACTIVE' ? '#4a4020'
    : '#0a1418';

  const edgeColor = status === 'ACTIVE' ? '#f59e0b'
    : status === 'PLANNED' ? '#00e5ff'
    : '#007C5A';

  return (
    <group>
      {/* Main slab */}
      <mesh ref={ref} position={[0, y, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, ST, D]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={status === 'PLANNED' ? 0.06 : status === 'ACTIVE' ? 0.85 : 1}
          roughness={0.88}
          roughnessMap={status !== 'PLANNED' ? getConcreteRoughnessMap() : undefined}
          metalness={0.02}
          clearcoat={status === 'COMPLETE' || status === 'FINISHING' ? 0.2 : 0}
          clearcoatRoughness={0.7}
          emissive={edgeColor}
          emissiveIntensity={0}
          envMapIntensity={0.6}
        />
        <Edges color={selected ? '#ffffff' : edgeColor} />
      </mesh>
      {/* Floor edge beam — exposed concrete lip */}
      {status !== 'PLANNED' && (
        <mesh position={[0, y - ST / 2 - 0.08, D / 2 + 0.04]} castShadow>
          <boxGeometry args={[W, 0.16, 0.08]} />
          <meshPhysicalMaterial color="#3a4a42" roughness={0.95} roughnessMap={getConcreteRoughnessMap()} metalness={0.02} />
        </mesh>
      )}
    </group>
  );
}

// ─── Active Floor Progress Indicator ─────────────────
function ProgressFill({ level }: { level: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const y = level * FH + 0.01;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.1 + Math.sin(clock.elapsedTime * 2) * 0.04;
  });

  return (
    <mesh ref={ref} position={[-W * 0.275, y, 0]}>
      <boxGeometry args={[W * 0.45, ST + 0.02, D]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.1} depthWrite={false} />
    </mesh>
  );
}

// ─── Glass Curtain Wall Panel ────────────────────────
function GlassPanel({ position, size, status }: {
  position: [number, number, number];
  size: [number, number, number];
  status: Status;
}) {
  const isGlass = status === 'COMPLETE' || status === 'FINISHING';
  const edgeColor = status === 'ACTIVE' ? '#f59e0b' : '#007C5A';

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color={isGlass ? '#0a1f1a' : '#332810'}
        transparent
        opacity={isGlass ? 0.55 : 0.12}
        roughness={isGlass ? 0.05 : 0.6}
        metalness={isGlass ? 0.9 : 0}
        clearcoat={isGlass ? 1 : 0}
        clearcoatRoughness={isGlass ? 0.02 : 1}
        envMapIntensity={isGlass ? 2.5 : 0}
        side={THREE.DoubleSide}
      />
      <Edges color={edgeColor} />
    </mesh>
  );
}

// ─── Window Mullions (aluminum frame grid) ───────────
function Mullions({ cy, h, status }: { cy: number; h: number; status: Status }) {
  if (status === 'ACTIVE' || status === 'PLANNED') return null;

  const mullionMat = {
    color: '#888888',
    metalness: 0.85,
    roughness: 0.2,
    envMapIntensity: 1.5,
  };

  // Horizontal mullions on front/back
  const hCount = 3;
  const vCount = 8;

  return (
    <group>
      {/* Front face mullions */}
      {Array.from({ length: hCount }).map((_, i) => (
        <mesh key={`fh${i}`} position={[0, cy - h / 2 + (h / (hCount + 1)) * (i + 1), D / 2 + 0.06]}>
          <boxGeometry args={[W, MULLION, MULLION]} />
          <meshPhysicalMaterial {...mullionMat} />
        </mesh>
      ))}
      {Array.from({ length: vCount }).map((_, i) => (
        <mesh key={`fv${i}`} position={[-W / 2 + (W / (vCount + 1)) * (i + 1), cy, D / 2 + 0.06]}>
          <boxGeometry args={[MULLION, h, MULLION]} />
          <meshPhysicalMaterial {...mullionMat} />
        </mesh>
      ))}
      {/* Back face mullions */}
      {Array.from({ length: hCount }).map((_, i) => (
        <mesh key={`bh${i}`} position={[0, cy - h / 2 + (h / (hCount + 1)) * (i + 1), -D / 2 - 0.06]}>
          <boxGeometry args={[W, MULLION, MULLION]} />
          <meshPhysicalMaterial {...mullionMat} />
        </mesh>
      ))}
      {Array.from({ length: vCount }).map((_, i) => (
        <mesh key={`bv${i}`} position={[-W / 2 + (W / (vCount + 1)) * (i + 1), cy, -D / 2 - 0.06]}>
          <boxGeometry args={[MULLION, h, MULLION]} />
          <meshPhysicalMaterial {...mullionMat} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Glass Curtain Walls ─────────────────────────────
function Walls({ level, status }: { level: number; status: Status }) {
  if (status === 'PLANNED') return null;

  const baseY = level * FH + ST / 2;
  const h = FH - ST;
  const cy = baseY + h / 2;

  return (
    <group>
      {/* Front + Back */}
      <GlassPanel position={[0, cy, D / 2]} size={[W, h, WALL_T]} status={status} />
      <GlassPanel position={[0, cy, -D / 2]} size={[W, h, WALL_T]} status={status} />
      {/* Left + Right (not on ACTIVE floors — open for construction) */}
      {status !== 'ACTIVE' && (
        <>
          <GlassPanel position={[-W / 2, cy, 0]} size={[WALL_T, h, D]} status={status} />
          <GlassPanel position={[W / 2, cy, 0]} size={[WALL_T, h, D]} status={status} />
        </>
      )}
      {/* Aluminum mullion grid */}
      <Mullions cy={cy} h={h} status={status} />
    </group>
  );
}

// ─── Exposed Rebar on Active Floor ───────────────────
function Rebar({ level }: { level: number }) {
  const y = level * FH + ST / 2 + 0.5;
  const bars: React.ReactElement[] = [];

  for (let i = 0; i < 6; i++) {
    const x = -W / 2 + 2 + i * (W - 4) / 5;
    bars.push(
      <mesh key={`r${i}`} position={[x, y, 0]}>
        <cylinderGeometry args={[0.03, 0.03, D - 1, 6]} />
        <meshPhysicalMaterial color="#8b4513" metalness={0.7} roughness={0.45} envMapIntensity={1} />
      </mesh>
    );
  }
  for (let i = 0; i < 4; i++) {
    const z = -D / 2 + 1.5 + i * (D - 3) / 3;
    bars.push(
      <mesh key={`c${i}`} position={[0, y, z]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, W - 2, 6]} />
        <meshPhysicalMaterial color="#8b4513" metalness={0.7} roughness={0.45} envMapIntensity={1} />
      </mesh>
    );
  }

  return <group>{bars}</group>;
}

// ─── Safety Netting (active floors) ──────────────────
function SafetyNet({ level }: { level: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const baseY = level * FH + ST / 2;
  const h = FH - ST;
  const cy = baseY + h / 2;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.06 + Math.sin(clock.elapsedTime * 1.2) * 0.02;
  });

  return (
    <group>
      {/* Left side netting */}
      <mesh ref={ref} position={[-W / 2 - 0.1, cy, 0]}>
        <planeGeometry args={[0.01, h, 1]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Right side netting */}
      <mesh position={[W / 2 + 0.1, cy, 0]}>
        <planeGeometry args={[0.01, h, 1]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
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
      0.12 + Math.sin(clock.elapsedTime * 1.5 + level * 0.7) * 0.06;
  });

  return (
    <lineSegments ref={ref} position={[0, cy, 0]} geometry={geo}>
      <lineBasicMaterial color="#00e5ff" transparent opacity={0.15} />
    </lineSegments>
  );
}

// ─── Structural Columns ──────────────────────────────
function Columns({ level, status }: { level: number; status: Status }) {
  const h = FH - ST;
  const cy = level * FH + ST / 2 + h / 2;
  const planned = status === 'PLANNED';

  const color = status === 'COMPLETE' ? '#2a3830'
    : status === 'FINISHING' ? '#2d4035'
    : status === 'ACTIVE' ? '#3a3520'
    : '#0a1215';

  return (
    <group>
      {COLS.map(([x, z], i) => (
        <mesh key={i} position={[x, cy, z]} castShadow>
          <cylinderGeometry args={[CR, CR, h, planned ? 6 : 12]} />
          <meshPhysicalMaterial
            color={color}
            transparent={planned}
            opacity={planned ? 0.1 : 1}
            wireframe={planned}
            roughness={planned ? 0.5 : 0.7}
            roughnessMap={!planned ? getConcreteRoughnessMap() : undefined}
            metalness={planned ? 0 : 0.12}
            clearcoat={planned ? 0 : 0.15}
            clearcoatRoughness={0.6}
            envMapIntensity={0.8}
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
      <meshPhysicalMaterial
        color="#1a2820"
        transparent
        opacity={0.25}
        roughness={0.8}
        roughnessMap={getConcreteRoughnessMap()}
        metalness={0.08}
        envMapIntensity={0.4}
        side={THREE.DoubleSide}
      />
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

  const steelMat = { color: '#3a3a3a', metalness: 0.8, roughness: 0.25, envMapIntensity: 1.8 };
  const paintedMat = { color: '#e8960b', metalness: 0.55, roughness: 0.35, envMapIntensity: 1.5, clearcoat: 0.4, clearcoatRoughness: 0.3 };

  return (
    <group position={[W / 2 + 2.5, 0, -D / 2 + 1]}>
      {/* Mast */}
      <mesh position={[0, tH / 2, 0]} castShadow>
        <boxGeometry args={[0.5, tH, 0.5]} />
        <meshPhysicalMaterial {...steelMat} />
        <Edges color="#555" />
      </mesh>
      {/* Mast cross-bracing (lattice detail) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`brace${i}`} position={[0, 2 + i * 2.6, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.03, 1.2, 0.03]} />
          <meshPhysicalMaterial color="#444" metalness={0.75} roughness={0.3} />
        </mesh>
      ))}
      {/* Rotating top */}
      <group ref={armRef} position={[0, tH, 0]}>
        {/* Jib */}
        <mesh position={[armL / 2 - 3, 0.15, 0]} castShadow>
          <boxGeometry args={[armL, 0.25, 0.25]} />
          <meshPhysicalMaterial {...paintedMat} />
        </mesh>
        {/* Counter-jib */}
        <mesh position={[-3.5, 0.15, 0]} castShadow>
          <boxGeometry args={[5, 0.25, 0.25]} />
          <meshPhysicalMaterial {...paintedMat} />
        </mesh>
        {/* Counterweight */}
        <mesh position={[-5.5, -0.3, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 0.7]} />
          <meshPhysicalMaterial color="#4a4a4a" metalness={0.65} roughness={0.45} envMapIntensity={0.8} />
        </mesh>
        {/* Cable */}
        <mesh position={[armL - 5, -3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 6]} />
          <meshPhysicalMaterial color="#aaa" metalness={0.9} roughness={0.15} envMapIntensity={2} />
        </mesh>
        {/* Hook block */}
        <mesh position={[armL - 5, -6.2, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.25]} />
          <meshPhysicalMaterial {...paintedMat} metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Construction Dust Particles ─────────────────────
function DustParticles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 35;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) + 0.003 + Math.sin(clock.elapsedTime * 0.5 + i) * 0.002;
      pos.setY(i, y > 36 ? -1 : y);
      pos.setX(i, pos.getX(i) + Math.sin(clock.elapsedTime * 0.3 + i * 0.5) * 0.003);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.06} transparent opacity={0.15} depthWrite={false} sizeAttenuation />
    </points>
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
      0.04 + Math.sin(t * Math.PI) * 0.03;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[W + 6, D + 6]} />
      <meshBasicMaterial color="#007C5A" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

// ─── Ground Slab (construction site) ─────────────────
function GroundSlab() {
  return (
    <mesh position={[0, -0.62, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshPhysicalMaterial
        color="#0e1612"
        roughness={0.98}
        roughnessMap={getConcreteRoughnessMap()}
        metalness={0.01}
        envMapIntensity={0.2}
      />
    </mesh>
  );
}

// ─── Full Building Assembly ──────────────────────────
function Building({ selectedFloor, onFloorClick }: { selectedFloor: number; onFloorClick: (l: number) => void }) {
  return (
    <group>
      {/* Foundation */}
      <mesh position={[0, -0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[W + 3, 0.6, D + 3]} />
        <meshPhysicalMaterial color="#1f2e28" roughness={0.92} roughnessMap={getConcreteRoughnessMap()} metalness={0.03} clearcoat={0.08} clearcoatRoughness={0.9} envMapIntensity={0.4} />
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
            {status === 'ACTIVE' && (
              <>
                <ProgressFill level={level} />
                <Rebar level={level} />
                <SafetyNet level={level} />
              </>
            )}
            <Columns level={level} status={status} />
          </group>
        );
      })}

      {/* Roof wireframe */}
      <mesh position={[0, (NUM_FLOORS + 1) * FH, 0]}>
        <boxGeometry args={[W, ST, D]} />
        <meshPhysicalMaterial color="#081418" transparent opacity={0.04} />
        <Edges color="#00e5ff" />
      </mesh>

      <Core />
      <Crane />
      <ScanPlane />
      <DustParticles />
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
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: THREE.NoToneMapping }}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 65, 160]} />

      {/* Custom studio environment — dark night sky, no green cast */}
      <Environment background resolution={512}>
        {/* Night sky dome — deep blue-black */}
        <Lightformer intensity={0.06} position={[0, 50, 0]} scale={[120, 1, 120]} color="#080c18" form="ring" />
        <Lightformer intensity={0.04} position={[0, 30, 0]} scale={[100, 1, 100]} color="#0a0e1c" form="ring" />
        {/* Horizon glow — subtle warm city light pollution */}
        <Lightformer intensity={0.12} position={[0, 2, -60]} scale={[120, 6, 1]} color="#18140e" />
        <Lightformer intensity={0.08} position={[60, 3, 0]} scale={[1, 5, 80]} color="#100e16" />
        <Lightformer intensity={0.08} position={[-60, 3, 0]} scale={[1, 5, 80]} color="#0e1216" />
        {/* Key — large warm panel from above (construction site lighting) */}
        <Lightformer intensity={3} position={[10, 35, 10]} scale={[25, 8, 1]} color="#fff8ee" />
        {/* Fill — cool from left */}
        <Lightformer intensity={1.2} position={[-18, 12, -5]} scale={[12, 15, 1]} color="#88bbff" />
        {/* Rim — subtle cool accent from behind (not green) */}
        <Lightformer intensity={0.6} position={[0, 8, -25]} scale={[35, 8, 1]} color="#334455" />
        {/* Ground bounce — warm */}
        <Lightformer intensity={0.4} position={[0, -3, 0]} scale={[40, 1, 40]} color="#2a1c0e" form="ring" />
        {/* Side accent — catching crane and columns */}
        <Lightformer intensity={0.8} position={[20, 15, 15]} scale={[8, 20, 1]} color="#ffffff" />
      </Environment>

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[25, 40, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={40}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-15, 25, -20]} intensity={0.4} color="#007C5A" />
      <directionalLight position={[-22, 12, 28]} intensity={0.25} color="#88ccff" />
      <pointLight position={[0, 5 * FH, 0]} intensity={1} color="#f59e0b" distance={18} decay={2} />
      <pointLight position={[0, 7 * FH, 0]} intensity={0.5} color="#00e5ff" distance={14} decay={2} />
      <pointLight position={[0, 1.5, 0]} intensity={0.2} color="#ffddaa" distance={25} decay={2} />

      <Suspense fallback={null}>
        <Building selectedFloor={selectedFloor} onFloorClick={(l) => onFloorSelect?.(l)} />
        <GroundSlab />

        <ContactShadows
          position={[0, -0.6, 0]}
          opacity={0.6}
          blur={1.5}
          far={20}
          resolution={1024}
          color="#000000"
        />

        <Grid
          position={[0, -0.61, 0]}
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

      {/* Post-processing */}
      <EffectComposer>
        <N8AO aoRadius={0.8} distanceFalloff={0.5} intensity={1.5} color="#000000" />
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.5}
          intensity={0.4}
          mipmapBlur
        />
        <ToneMapping mode={ToneMappingMode.AGX} />
        <Vignette offset={0.3} darkness={0.6} />
      </EffectComposer>

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
