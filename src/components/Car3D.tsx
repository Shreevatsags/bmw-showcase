import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import type { Finish, Flake } from "@/lib/carCustomization";

interface CarMeshProps {
  bodyColor: string;
  accentColor: string;
  bodyType: "sedan" | "suv" | "coupe";
  autoRotate?: boolean;
  finish?: Finish;
  flake?: Flake;
  float?: boolean;
}

// Stylized parametric BMW-inspired car built from primitives.
const CarMesh = ({
  bodyColor,
  accentColor,
  bodyType,
  autoRotate = true,
  finish = "gloss",
  flake = "metal",
}: CarMeshProps) => {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += dt * 0.35;
    }
  });

  const cfg = {
    sedan: { length: 4.4, width: 1.8, lower: 0.55, cabinH: 0.55, cabinLen: 2.0, cabinOffset: -0.1, roofTaper: 0.85 },
    suv:   { length: 4.3, width: 1.95, lower: 0.85, cabinH: 0.85, cabinLen: 2.4, cabinOffset: 0.05, roofTaper: 0.95 },
    coupe: { length: 4.4, width: 1.85, lower: 0.5, cabinH: 0.5, cabinLen: 1.7, cabinOffset: -0.3, roofTaper: 0.7 },
  }[bodyType];

  // Finish + flake mapping
  // gloss: smooth + high clearcoat ; matte: rough + zero clearcoat
  // metal: high metalness, low sheen ; pearl: lower metalness + high sheen tint
  const isMatte = finish === "matte";
  const isPearl = flake === "pearl";

  const metalness = isPearl ? 0.35 : 0.9;
  const roughness = isMatte ? 0.85 : isPearl ? 0.3 : 0.22;
  const clearcoat = isMatte ? 0 : isPearl ? 0.6 : 1;
  const clearcoatRoughness = isMatte ? 1 : isPearl ? 0.25 : 0.08;
  const sheen = isPearl ? 1 : 0;
  const sheenRoughness = isPearl ? 0.4 : 1;

  const bodyMat = (
    <meshPhysicalMaterial
      color={bodyColor}
      metalness={metalness}
      roughness={roughness}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      sheen={sheen}
      sheenRoughness={sheenRoughness}
      sheenColor={isPearl ? "#ffffff" : "#000000"}
      reflectivity={isMatte ? 0.2 : 0.7}
    />
  );

  const glassMat = (
    <meshPhysicalMaterial
      color="#0a0f1a"
      metalness={0.1}
      roughness={0.05}
      transmission={0.6}
      thickness={0.3}
      transparent
      opacity={0.55}
    />
  );

  const wheelMat = <meshStandardMaterial color="#0b0b0b" metalness={0.6} roughness={0.4} />;
  const rimMat = <meshStandardMaterial color="#c9cdd2" metalness={0.95} roughness={0.2} />;

  const wheelY = 0.35;
  const wheelOffsetX = cfg.length / 2 - 0.85;
  const wheelOffsetZ = cfg.width / 2 + 0.02;

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      <mesh position={[0, cfg.lower / 2 + 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[cfg.length, cfg.lower, cfg.width]} />
        {bodyMat}
      </mesh>

      <mesh position={[cfg.length / 2 - 0.6, cfg.lower / 2 + 0.25, 0]} castShadow>
        <boxGeometry args={[1.2, cfg.lower * 0.9, cfg.width * 0.98]} />
        {bodyMat}
      </mesh>
      <mesh position={[-cfg.length / 2 + 0.6, cfg.lower / 2 + 0.25, 0]} castShadow>
        <boxGeometry args={[1.2, cfg.lower * 0.95, cfg.width * 0.98]} />
        {bodyMat}
      </mesh>

      <mesh position={[cfg.cabinOffset, cfg.lower + cfg.cabinH / 2 + 0.25, 0]} castShadow>
        <boxGeometry args={[cfg.cabinLen, cfg.cabinH, cfg.width * cfg.roofTaper]} />
        {bodyMat}
      </mesh>

      <mesh position={[cfg.cabinOffset, cfg.lower + cfg.cabinH / 2 + 0.25, 0]}>
        <boxGeometry args={[cfg.cabinLen * 0.92, cfg.cabinH * 0.85, cfg.width * cfg.roofTaper + 0.01]} />
        {glassMat}
      </mesh>

      <group position={[cfg.length / 2 + 0.001, 0.55, 0]}>
        <mesh position={[0, 0, -0.22]}>
          <boxGeometry args={[0.05, 0.32, 0.32]} />
          <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.22]}>
          <boxGeometry args={[0.05, 0.32, 0.32]} />
          <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      <mesh position={[cfg.length / 2 + 0.005, 0.7, -cfg.width / 2 + 0.32]}>
        <boxGeometry args={[0.04, 0.12, 0.4]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[cfg.length / 2 + 0.005, 0.7, cfg.width / 2 - 0.32]}>
        <boxGeometry args={[0.04, 0.12, 0.4]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[-cfg.length / 2 - 0.005, 0.7, 0]}>
        <boxGeometry args={[0.04, 0.12, cfg.width * 0.85]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>

      {[
        [wheelOffsetX, wheelY, wheelOffsetZ],
        [wheelOffsetX, wheelY, -wheelOffsetZ],
        [-wheelOffsetX, wheelY, wheelOffsetZ],
        [-wheelOffsetX, wheelY, -wheelOffsetZ],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 32]} />
            {wheelMat}
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.3, 16]} />
            {rimMat}
          </mesh>
        </group>
      ))}
    </group>
  );
};

interface Car3DProps {
  bodyColor: string;
  accentColor: string;
  bodyType: "sedan" | "suv" | "coupe";
  autoRotate?: boolean;
  finish?: Finish;
  flake?: Flake;
  interactive?: boolean;
  className?: string;
}

const Car3D = ({
  bodyColor,
  accentColor,
  bodyType,
  autoRotate = true,
  finish = "gloss",
  flake = "metal",
  interactive = true,
  className,
}: Car3DProps) => {
  return (
    <div className={className}>
      <Canvas
        shadows={interactive}
        dpr={interactive ? [1, 2] : 1}
        camera={{ position: [5.5, 2.8, 5.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 20]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow={interactive}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color={accentColor} />

        <Suspense fallback={null}>
          {interactive ? (
            <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
              <CarMesh
                bodyColor={bodyColor}
                accentColor={accentColor}
                bodyType={bodyType}
                autoRotate={autoRotate}
                finish={finish}
                flake={flake}
              />
            </Float>
          ) : (
            <CarMesh
              bodyColor={bodyColor}
              accentColor={accentColor}
              bodyType={bodyType}
              autoRotate={autoRotate}
              finish={finish}
              flake={flake}
            />
          )}

          {interactive && (
            <ContactShadows
              position={[0, -0.42, 0]}
              opacity={0.6}
              scale={10}
              blur={2.5}
              far={4}
            />
          )}
          <Environment preset="city" />
        </Suspense>

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 4}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Car3D;
