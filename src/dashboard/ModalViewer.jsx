import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds, useTexture } from "@react-three/drei";

import * as THREE from "three";

/* ─────────────────────────────────────────
   NORMALIZE MODEL
───────────────────────────────────────── */
function normalizeModel(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = 1 / maxAxis;

  scene.scale.setScalar(scale);

  const center = new THREE.Vector3();
  box.getCenter(center);
  scene.position.sub(center.multiplyScalar(scale));

  return scene;
}

/* ─────────────────────────────────────────
   BODY MEASUREMENTS
───────────────────────────────────────── */
function getBodyMeasurements(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  return {
    chest: Math.round(size.x * 0.85 * 100),
    waist: Math.round(size.x * 0.70 * 100),
    length: Math.round(size.y * 100),
  };
}

/* ─────────────────────────────────────────
   FEMALE
───────────────────────────────────────── */
function FemaleAvatar({ onMeasure, measuredRef }) {
  const { scene } = useGLTF("/female.glb");

  const cloned = useMemo(() => {
    const c = scene.clone();
    return normalizeModel(c);
  }, [scene]);

  useEffect(() => {
    if (!cloned || measuredRef.current) return;

    const m = getBodyMeasurements(cloned);
    onMeasure(m);
    measuredRef.current = true;
  }, [cloned]);

  return <primitive object={cloned} scale={1.8} position={[0, -1, 0]} />;
}

/* ─────────────────────────────────────────
   MALE
───────────────────────────────────────── */
function MaleAvatar({ onMeasure, measuredRef }) {
  const { scene } = useGLTF("/male.glb");

  const cloned = useMemo(() => {
    const c = scene.clone();
    return normalizeModel(c);
  }, [scene]);

  useEffect(() => {
    if (!cloned || measuredRef.current) return;

    const m = getBodyMeasurements(cloned);
    onMeasure(m);
    measuredRef.current = true;
  }, [cloned]);

  return <primitive object={cloned} scale={1.8} position={[0, -1, 0]} />;
}

/* ─────────────────────────────────────────
   SHIRT
───────────────────────────────────────── */
function Shirt({ design }) {
  const { scene } = useGLTF("/shirt.glb");

  const cloned = useMemo(() => {
    const c = scene.clone();

    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box.getCenter(center);

    c.traverse((child) => {
      if (child.isMesh) {
        child.geometry = child.geometry.clone();
        child.geometry.translate(-center.x, -center.y, -center.z);
      }
    });

    return c;
  }, [scene]);

  const shirtScale = useMemo(() => {
    const chest = design.measurements?.chest || 40;
    const waist = design.measurements?.waist || 32;
    const length = design.measurements?.length || 30;

    const base = 0.28;

    const factor =
      1 +
      (chest - 40) * 0.008 +
      (waist - 32) * 0.005 +
      (length - 30) * 0.006;

    return [base * factor, base * factor, base * factor];
  }, [design.measurements]);

  return (
    <primitive
      object={cloned}
      scale={shirtScale}
      position={[0, 0.18, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

/* ─────────────────────────────────────────
   AVATAR CONTROLLER
───────────────────────────────────────── */
function AvatarWithShirt({ design, onMeasure, measuredRef }) {
  const isFemale = design.gender === "female";

  return (
    <>
      {isFemale ? (
        <FemaleAvatar onMeasure={onMeasure} measuredRef={measuredRef} />
      ) : (
        <MaleAvatar onMeasure={onMeasure} measuredRef={measuredRef} />
      )}

      {design.fabric && <Shirt design={design} />}
    </>
  );
}

/* ─────────────────────────────────────────
   MAIN VIEWER
───────────────────────────────────────── */
function ModelViewer({ design: initialDesign }) {
  const [design, setDesign] = useState({
    gender: "male",
    fabric: null,
    color: "#ffffff",
    measurements: null,
    ...initialDesign,
  });

  const measuredRef = useRef(false);

  /* =========================
     UPDATE MEASUREMENTS ONCE
  ========================= */
  const handleMeasure = (m) => {
    setDesign((prev) => {
      if (prev.measurements) return prev; // prevent overwrite loop
      return { ...prev, measurements: m };
    });
  };

  /* =========================
     RESET WHEN GENDER CHANGES
  ========================= */
  useEffect(() => {
    measuredRef.current = false;
    setDesign((prev) => ({ ...prev, measurements: null }));
  }, [design.gender]);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "500px" }}>

      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />

        <Center>
          <Suspense fallback={null}>
            <AvatarWithShirt
              design={design}
              onMeasure={handleMeasure}
              measuredRef={measuredRef}
            />
          </Suspense>
        </Center>

        <OrbitControls enablePan={false} />
      </Canvas>

      {/* DEBUG PANEL */}
      <div style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        background: "#111",
        color: "white",
        padding: 10,
        borderRadius: 8
      }}>
        <div>Gender: {design.gender}</div>
        <div>Fabric: {design.fabric || "none"}</div>
        <div>Chest: {design.measurements?.chest}</div>
        <div>Waist: {design.measurements?.waist}</div>
        <div>Length: {design.measurements?.length}</div>
      </div>

    </div>
  );
}

export default ModelViewer;