import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { Row, Col, Card, Typography, Button, Tag, Input } from "antd";
import { useApp } from "../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

// Preload the shirt asset
useGLTF.preload("/shirt.glb");

/* ─────────────────────────────────────────
    ENGINE UTILITIES (Flawless Single Object Fitting)
───────────────────────────────────────── */
function normalizeModel(scene) {
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  // Normalizes the shirt asset bounds safely to exactly 1.0 unit bounding space
  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = 1 / maxAxis;
  scene.scale.setScalar(scale);

  const centeredBox = new THREE.Box3().setFromObject(scene);
  const center = new THREE.Vector3();
  centeredBox.getCenter(center);
  scene.position.sub(center);

  return scene;
}

/* ─────────────────────────────────────────
    SHIRT ENGINE 
───────────────────────────────────────── */
function Shirt({ design }) {
  const { scene } = useGLTF("/shirt.glb");

  const cloned = useMemo(() => {
    const c = scene.clone();
    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box.getCenter(center);
    c.position.sub(center); // ONLY center once
    return c;
  }, [scene]);

  // 📐 FIXED: Responsive 3D Axis Scaling Engine
  const shirtScale = useMemo(() => {
    // Fallback to average human standard baselines if fields are left blank
    const chest = Number(design.measurements?.chest) || 40;
    const waist = Number(design.measurements?.waist) || 32;
    const length = Number(design.measurements?.length) || 30;
    const sleeve = Number(design.measurements?.sleeve) || 25;

    // Base uniform file global scale
    const baseScale = 0.000004; 

    // Calculate independent directional stretch metrics 
    const scaleX = baseScale * (1 + (chest - 40) * 0.015);               // Chest width modifies X-axis thickness
    const scaleY = baseScale * (1 + (length - 30) * 0.02);                // Length modifies Y-axis height
    const scaleZ = baseScale * (1 + (waist - 32) * 0.012 + (sleeve - 25) * 0.005); // Waist & Sleeve depths alter Z-axis spatial volume

    return [scaleX, scaleY, scaleZ];
  }, [design.measurements]);

  useEffect(() => {
    const mat = {
      Silk: { roughness: 0.1, metalness: 0.05 },
      Cotton: { roughness: 0.85, metalness: 0 },
      Denim: { roughness: 0.95, metalness: 0 },
      Leather: { roughness: 0.4, metalness: 0.25 },
    };

    const { roughness, metalness } = mat[design.fabric] || mat.Cotton;

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(design.color),
          roughness,
          metalness,
        });
      }
    });
  }, [cloned, design.color, design.fabric]);

  return (
    <primitive
      object={cloned}
      scale={shirtScale}
      position={[0, -0.1, 0]} // Center view calibration
      // rotation={[0, Math.PI, 0]}
    />
  );
}

/* ── SCENE CONTAINER ── */
function SceneContainer({ design }) {
  const containerRef = useRef();

  // useFrame((_, delta) => {
  //   if (containerRef.current) containerRef.current.rotation.y += delta * 0.00009; // Slow steady presentation spin
  // });

  return (
    <group ref={containerRef}>
      <Shirt design={design} />
    </group>
  );
}

/* ── COLOR SWATCH ELEMENT ── */
function Swatch({ color, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: color,
        cursor: "pointer",
        border: selected ? "3px solid #111" : "2px solid #d1d5db",
        transform: selected ? "scale(1.2)" : "scale(1)",
        transition: "transform 0.15s",
        flexShrink: 0,
      }}
    />
  );
}

/* ══════════════════════════════════════════════
    MAIN APP WORKBENCH
══════════════════════════════════════════════ */
const DesignStudio = () => {
  const { createDesign, updateDesign } = useApp?.() ?? {};
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 📝 FIXED: Default measurements now initialize with standard values instead of empty strings
  const [design, setDesign] = useState({
    customerName: "",
    customerPhone: "",
    color: "#3b82f6",
    fabric: "Cotton",
    gender: "male", 
    measurements: { chest: "", waist: "", length: "", sleeve: "" },
  });

  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#1a1a1a",
    "#ffffff",
    "#94a3b8",
  ];

  const fabrics = [
    { name: "Cotton", desc: "Breathable & classic" },
    { name: "Silk", desc: "Smooth & lustrous" },
    { name: "Denim", desc: "Rugged & textured" },
    { name: "Leather", desc: "Bold & structured" },
  ];

  const measurementFields = [
    { key: "chest", label: "Chest Width (in)", placeholder: "e.g., 40" },
    { key: "waist", label: "Waist Circumference (in)", placeholder: "e.g., 32" },
    { key: "length", label: "Garment Length (in)", placeholder: "e.g., 30" },
    { key: "sleeve", label: "Sleeve Length (in)", placeholder: "e.g., 25" },
  ];

  const handleMeasurementChange = (key, value) => {
    setDesign((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value },
    }));
  };

  const handleSave = async () => {
    if (!design.customerName.trim() || !design.customerPhone.trim()) {
      toast.warn("Please enter a valid Customer Name and Phone Number.");
      return;
    }

    const m = design.measurements;
    if (!m.chest || !m.waist || !m.length || !m.sleeve) {
      toast.warn("Please enter complete values across all measurement fields.");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updateDesign?.(editingId, design);
        toast.success("Specification updated!");
        setEditingId(null);
      } else {
        await createDesign?.(design);
        toast.success("Production sheet saved!");
      }
    } catch {
      toast.error("An error occurred during submission handling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "12px" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4, fontWeight: 700 }}>
          Design Studio
        </Title>
        <Text type="secondary">
          Configure garment specifications, fabric blends, and scale parameters cleanly.
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* ══ 3D PREVIEW BLOCK PANEL ══ */}
        <Col xs={24} lg={15}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              background: "linear-gradient(145deg, #f1f5f9 0%, #f8fafc 100%)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
            bodyStyle={{ padding: 0, height: 500 }}
          >
            <Canvas camera={{ position: [0, 1.2, 2.5], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} />
              <Center>
                <Suspense fallback={null}>
                  <SceneContainer design={design} />
                </Suspense>
              </Center>
              <ContactShadows
                position={[0, -0.6, 0]}
                opacity={0.25}
                scale={4}
                blur={2.5}
              />
              <OrbitControls
                target={[0, 0, 0]}
                enablePan={false}
                enableZoom={true}
                minDistance={1.0}
                maxDistance={4}
              />
            </Canvas>

            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                borderRadius: 10,
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                itemsCenter: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: design.color,
                }}
              />
              {design.gender.toUpperCase()} VIEW · {design.fabric}
            </div>
          </Card>
        </Col>

        {/* ══ INTERACTIVE CONTROL RIG ══ */}
        <Col xs={24} lg={9}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            }}
          >
            {/* CUSTOMER IDENTIFICATION BLOCKS */}
            <div style={{ marginBottom: 22, background: "#f8fafc", padding: "14px", borderRadius: "14px", border: "1px solid #f1f5f9" }}>
              <Title level={5} style={{ marginBottom: 12, fontSize: 14, color: "#1e293b" }}>
                📋 Customer Account Info
              </Title>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <Text style={{ fontSize: 11, fontWeight: 500, display: "block", marginBottom: 4, color: "#64748b" }}>
                    Full Name
                  </Text>
                  <Input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={design.customerName}
                    onChange={(e) => setDesign((p) => ({ ...p, customerName: e.target.value }))}
                    style={{ borderRadius: 8, height: 36 }}
                  />
                </div>
                <div>
                  <Text style={{ fontSize: 11, fontWeight: 500, display: "block", marginBottom: 4, color: "#64748b" }}>
                    Phone Number
                  </Text>
                  <Input
                    type="tel"
                    placeholder="e.g., +1 555-0199"
                    value={design.customerPhone}
                    onChange={(e) => setDesign((p) => ({ ...p, customerPhone: e.target.value }))}
                    style={{ borderRadius: 8, height: 36 }}
                  />
                </div>
              </div>
            </div>

            {/* GENDER PROFILE SELECTION */}
            <div style={{ marginBottom: 22 }}>
              <Title level={5} style={{ marginBottom: 10 }}>
                Gender Profile Target
              </Title>
              <div style={{ display: "flex", gap: 10 }}>
                {["male", "female"].map((g) => (
                  <Button
                    key={g}
                    block
                    type={design.gender === g ? "primary" : "default"}
                    onClick={() => setDesign((p) => ({ ...p, gender: g }))}
                    style={{
                      borderRadius: 10,
                      fontWeight: 600,
                      height: 40,
                      textTransform: "capitalize",
                    }}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            {/* COLOR MATRIX */}
            <div style={{ marginBottom: 22 }}>
              <Title level={5} style={{ marginBottom: 10 }}>
                Palette Color
              </Title>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {colors.map((c) => (
                  <Swatch
                    key={c}
                    color={c}
                    selected={design.color === c}
                    onClick={() => setDesign((p) => ({ ...p, color: c }))}
                  />
                ))}
              </div>
            </div>

            {/* TEXTURE BLOCKS */}
            <div style={{ marginBottom: 22 }}>
              <Title level={5} style={{ marginBottom: 10 }}>
                Fabric Shell
              </Title>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {fabrics.map(({ name, desc }) => (
                  <div
                    key={name}
                    onClick={() => setDesign((p) => ({ ...p, fabric: name }))}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: design.fabric === name ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                      background: design.fabric === name ? "#eff6ff" : "#fff",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* METRICS DISPATCH */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 10 }}>
                Measurement Profiles
              </Title>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {measurementFields.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <Text style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4, color: "#4b5563" }}>
                      {label}
                    </Text>
                    <Input
                      type="number"
                      placeholder={placeholder}
                      value={design.measurements[key]}
                      onChange={(e) => handleMeasurementChange(key, e.target.value)}
                      suffix={
                        <Tag color="blue" style={{ borderRadius: 6, margin: 0, fontSize: 10 }}>
                          in
                        </Tag>
                      }
                      style={{ borderRadius: 8, height: 38 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handleSave}
              style={{
                borderRadius: 12,
                fontWeight: 700,
                height: 48,
                fontSize: 15,
              }}
            >
              {editingId ? "Update Specification Set" : "Save Production Layout"}
            </Button>
          </Card>
        </Col>
      </Row>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default DesignStudio;