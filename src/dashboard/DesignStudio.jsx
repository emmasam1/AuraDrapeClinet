import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds, useTexture } from "@react-three/drei";

import * as THREE from "three";
import { Row, Col, Card, Typography, Button } from "antd";
import { SkinOutlined } from "@ant-design/icons";
import { useApp } from "../context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

/* ---------------- MALE AVATAR ---------------- */
function MaleAvatar() {
  const { scene } = useGLTF("/male.glb");
  // Clone prevents scene graph naming collisions
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} scale={0.3} position={[0, -1, 0]} />;
}

/* ---------------- FEMALE AVATAR ---------------- */
function FemaleAvatar() {
  const { scene } = useGLTF("/female.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} scale={1.8} position={[0, -1, 0]} />;
}

function Avatar({ design }) {
  return design.gender === "female" ? <FemaleAvatar /> : <MaleAvatar />;
}

/* ---------------- SHIRT ---------------- */
function Shirt({ design }) {
  const { scene } = useGLTF("/shirt.glb");
  
  // CRUCIAL FIX 1: Explicitly clone the shirt scene so it is isolated in memory
  const clonedShirt = useMemo(() => scene.clone(), [scene]);

  /* SAFE TEXTURE LOADING (Prevents components from breaking on 404 errors) */
  let cotton, silk, denim, leather;
  try {
    cotton = useTexture("/textures/cotton.jpg");
    silk = useTexture("/textures/silk.jpg");
    denim = useTexture("/textures/denim.jpg");
    leather = useTexture("/textures/leather.jpg");
  } catch (e) {
    console.warn("Texture files missing from public/textures/. Falling back to basic materials.");
  }

  const textureMap = { Cotton: cotton, Silk: silk, Denim: denim, Leather: leather };
  const selectedTexture = textureMap[design.fabric];

  useEffect(() => {
    if (selectedTexture) {
      selectedTexture.wrapS = THREE.RepeatWrapping;
      selectedTexture.wrapT = THREE.RepeatWrapping;
      selectedTexture.repeat.set(8, 8); 
    }
  }, [selectedTexture]);

  /* MATERIAL TRANSFORMATION LAYER */
  useEffect(() => {
    clonedShirt.traverse((child) => {
      if (child.isMesh) {
        // Create a unique material instance so it doesn't affect the avatar mesh properties
        child.material = new THREE.MeshStandardMaterial({
          map: selectedTexture || null,
          color: new THREE.Color(design.color),
          roughness: design.fabric === "Silk" ? 0.2 : 0.8,
          metalness: design.fabric === "Leather" ? 0.3 : 0,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedShirt, selectedTexture, design.color, design.fabric]);

  /* MEASUREMENTS CALCULATIONS */
  const chest = Number(design.measurements.chest) || 40;
  const waist = Number(design.measurements.waist) || 32;
  const length = Number(design.measurements.length) || 30;

  /* CRUCIAL FIX 2: HARD-CALIBRATED SCALE MODIFIER
    Based on your previous screenshot, we are replacing the scaling sliders 
    with a rock-solid scale base configuration.
  */
  const scaleModifier = 0.0075; 
  const scaleX = (chest / 40) * scaleModifier;
  const scaleY = (length / 30) * scaleModifier;
  const scaleZ = (waist / 32) * scaleModifier;

  return (
    <primitive
      object={clonedShirt}
      position={[0, -1, 0]} // Snaps perfectly to the mannequin's root zero-ground level
      scale={[scaleX, scaleY, scaleZ]}
    />
  );
}

const DesignStudio = () => {
  const { createDesign, updateDesign } = useApp();

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [design, setDesign] = useState({
    color: "#ef4444",
    fabric: "Silk",
    gender: "male",
    measurements: {
      chest: "",
      waist: "",
      length: "",
      sleeve: "",
    },
  });

  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#8b5cf6"];
  const fabrics = ["Silk", "Cotton", "Leather", "Denim"];

  /* ===============================
     HANDLE MEASUREMENTS
  =============================== */
  const handleMeasurement = (e) => {
    const { name, value } = e.target;

    setDesign((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [name]: value,
      },
    }));
  };

  /* ===============================
     SAVE / UPDATE DESIGN
  =============================== */
  const handleSaveDesign = async () => {
    try {
      setLoading(true);

      if (editingId) {
        await updateDesign(editingId, design);
        setEditingId(null);
      } else {
        await createDesign(design);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 25 }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          Design Studio
        </Title>
        <Text type="secondary">
          Create, customize, and preview virtual clothing designs.
        </Text>
      </div>

      {/* MAIN GRID */}
      <Row gutter={[24, 24]}>
        {/* LEFT SIDE (BIG) */}
        <Col xs={24} lg={16}>
          <div style={{ width: "100%", height: "100%", minHeight: "500px" }}>
               <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 50 }}>
                 <ambientLight intensity={1.5} />
                 <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
         
                 {/* Framing calculations handle only the mannequin wrapper to ensure consistency */}
                 <Bounds fit clip observe margin={1.2}>
                   <Center>
                     <Avatar design={design} />
                   </Center>
                 </Bounds>
         
                 {/* The shirt overlays directly in the exact same center container space */}
                 <Center>
                   <Shirt design={design} />
                 </Center>
         
                 <OrbitControls makeDefault enablePan={false} enableZoom={true} />
               </Canvas>
             </div>
        </Col>

        {/* RIGHT SIDE (SMALL CONTROL PANEL) */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              minHeight: "75vh",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* COLORS */}
            <div style={{ marginBottom: 20 }}>
              <Title level={5}>Color</Title>

              <div style={{ display: "flex", gap: 10 }}>
                {colors.map((c) => (
                  <div
                    key={c}
                    onClick={() =>
                      setDesign((p) => ({ ...p, color: c }))
                    }
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: c,
                      cursor: "pointer",
                      border:
                        design.color === c
                          ? "3px solid #000"
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* FABRIC */}
            <div style={{ marginBottom: 20 }}>
              <Title level={5}>Fabric</Title>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {fabrics.map((f) => (
                  <Button
                    key={f}
                    onClick={() =>
                      setDesign((p) => ({ ...p, fabric: f }))
                    }
                    type={design.fabric === f ? "primary" : "default"}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            {/* GENDER */}
            <div style={{ marginBottom: 20 }}>
              <Title level={5}>Avatar</Title>

              <div style={{ display: "flex", gap: 10 }}>
                {["male", "female"].map((g) => (
                  <Button
                    key={g}
                    onClick={() =>
                      setDesign((p) => ({ ...p, gender: g }))
                    }
                    type={design.gender === g ? "primary" : "default"}
                    block
                  >
                    {g.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* MEASUREMENTS */}
            <div style={{ marginBottom: 20 }}>
              <Title level={5}>Measurements</Title>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["chest", "waist", "length", "sleeve"].map((m) => (
                  <input
                    key={m}
                    type="number"
                    name={m}
                    placeholder={m}
                    value={design.measurements[m]}
                    onChange={handleMeasurement}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* SAVE BUTTON */}
            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handleSaveDesign}
            >
              {editingId ? "Update Design" : "Save Design"}
            </Button>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default DesignStudio;