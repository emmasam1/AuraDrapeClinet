// import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
// import { Canvas } from "@react-three/fiber";
// import {
//   OrbitControls,
//   useGLTF,
//   Center,
//   ContactShadows,
// } from "@react-three/drei";
// import * as THREE from "three";
// import {
//   Row,
//   Col,
//   Card,
//   Typography,
//   Button,
//   Tag,
//   Input,
//   Select,
//   Divider,
//   Tabs,
// } from "antd";
// import { useApp } from "../context/AppContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const { Title, Text } = Typography;
// const { Option } = Select;

// // Preload all assets to guarantee seamless transitions between rendering states
// useGLTF.preload("/shirt.glb");
// useGLTF.preload("/female_shirt.glb");
// useGLTF.preload("/male_trouser.glb");
// useGLTF.preload("/female_skirt.glb");

// /* ─────────────────────────────────────────
//     GARMENT THREE.JS ENGINE LAYER
// ───────────────────────────────────────── */
// function GarmentModel({ design, activeTab, lowerGarmentType }) {
//   // Select the accurate model file based on current active view segment
//   const modelPath = useMemo(() => {
//     if (activeTab === "lower") {
//       return lowerGarmentType === "skirt" ? "/female_skirt.glb" : "/male_trouser.glb";
//     }
//     return design.gender === "female" ? "/female_shirt.glb" : "/shirt.glb";
//   }, [design.gender, activeTab, lowerGarmentType]);

//   const { scene } = useGLTF(modelPath);

//   // Force center and normalize position offsets regardless of asset origins
//   const { cloned, modelNaturalSize } = useMemo(() => {
//     const c = scene.clone();
    
//     // 1. Calculate the absolute structural bounding box of the cloned object
//     const box = new THREE.Box3().setFromObject(c);
//     const center = new THREE.Vector3();
//     box.getCenter(center);

//     // 2. Shift the child geometry vectors directly to force zero-alignment [0, 0, 0]
//     c.traverse((child) => {
//       if (child.isMesh) {
//         // This strips away un-reset transformations that cause shirts/skirts to go out of frame
//         child.geometry.center(); 
//       }
//     });

//     // 3. Recalculate dimensions for proportional sizing
//     const refreshedBox = new THREE.Box3().setFromObject(c);
//     const size = new THREE.Vector3();
//     refreshedBox.getSize(size);

//     return { cloned: c, modelNaturalSize: Math.max(size.x, size.y, size.z) };
//   }, [scene]);

//   // Dynamic Scale Calculator Matrix
//   const dynamicScale = useMemo(() => {
//     const normalizedBase = 1.0 / (modelNaturalSize || 1);

//     if (activeTab === "lower") {
//       if (lowerGarmentType === "skirt") {
//         const sWaist = Number(design.measurements?.skirtWaist) || 28;
//         const sHips = Number(design.measurements?.skirtHips) || 38;
//         const sLength = Number(design.measurements?.skirtLength) || 26;
//         const sFlare = Number(design.measurements?.flareWidth) || 20;

//         return [
//           normalizedBase * (1 + (sHips - 38) * 0.015),
//           normalizedBase * (1 + (sLength - 26) * 0.02),
//           normalizedBase * (1 + (sWaist - 28) * 0.012 + (sFlare - 20) * 0.01),
//         ];
//       } else {
//         // Trouser Spec Mapping Calculations
//         const tHips = Number(design.measurements?.trouserHips) || 36;
//         const tThigh = Number(design.measurements?.thigh) || 22;
//         const tLength = Number(design.measurements?.trouserLength) || 40;
//         const tOpening = Number(design.measurements?.legOpening) || 14;

//         return [
//           normalizedBase * (1 + (tHips - 36) * 0.015),
//           normalizedBase * (1 + (tLength - 40) * 0.02),
//           normalizedBase * (1 + (tThigh - 22) * 0.012 + (tOpening - 14) * 0.008),
//         ];
//       }
//     }

//     // Default Fallback Upper Body Scaling Logic
//     const chest = Number(design.measurements?.chest) || 40;
//     const waist = Number(design.measurements?.waist) || 32;
//     const length = Number(design.measurements?.length) || 30;
//     const sleeve = Number(design.measurements?.sleeve) || 25;

//     return [
//       normalizedBase * (1 + (chest - 40) * 0.015),
//       normalizedBase * (1 + (length - 30) * 0.02),
//       normalizedBase * (1 + (waist - 32) * 0.012 + (sleeve - 25) * 0.005),
//     ];
//   }, [design.measurements, modelNaturalSize, activeTab, lowerGarmentType]);

//   useEffect(() => {
//     const matPresets = {
//       Silk: { roughness: 0.1, metalness: 0.05 },
//       Cotton: { roughness: 0.85, metalness: 0 },
//       Denim: { roughness: 0.95, metalness: 0 },
//       Leather: { roughness: 0.4, metalness: 0.25 },
//     };

//     const { roughness, metalness } = matPresets[design.fabric] || matPresets.Cotton;

//     cloned.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshStandardMaterial({
//           color: new THREE.Color(design.color),
//           roughness,
//           metalness,
//         });
//       }
//     });
//   }, [cloned, design.color, design.fabric]);

//   // Force absolute center placement at local layout coords [0, 0, 0]
//   return <primitive object={cloned} scale={dynamicScale} position={[0, 0, 0]} />;
// }

// /* ── COLOR SWATCH DOT ── */
// function Swatch({ color, selected, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       style={{
//         width: 32,
//         height: 32,
//         borderRadius: "50%",
//         background: color,
//         cursor: "pointer",
//         border: selected ? "3px solid #111" : "2px solid #e5e7eb",
//         transform: selected ? "scale(1.15)" : "scale(1)",
//         transition: "all 0.15s ease-in-out",
//         flexShrink: 0,
//       }}
//     />
//   );
// }

// /* ══════════════════════════════════════════════
//     MAIN DESIGN STUDIO CONTROLLER
// ══════════════════════════════════════════════ */
// const DesignStudio = () => {
//   const { createDesign, updateDesign } = useApp?.() ?? {};

//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [activeTab, setActiveTab] = useState("upper");
//   const [lowerGarmentType, setLowerGarmentType] = useState("trouser");

//   const [design, setDesign] = useState({
//     customerName: "",
//     customerPhone: "",
//     color: "#3b82f6",
//     fabric: "Cotton",
//     gender: "male",
//     measurements: {
//       chest: "",
//       waist: "",
//       length: "",
//       sleeve: "",
//       trouserHips: "",
//       thigh: "",
//       trouserLength: "",
//       legOpening: "",
//       skirtWaist: "",
//       skirtHips: "",
//       skirtLength: "",
//       flareWidth: "",
//     },
//     styleType: "",
//   });

//   const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#1a1a1a", "#ffffff", "#94a3b8"];
//   const fabrics = [
//     { name: "Cotton", desc: "Breathable & standard" },
//     { name: "Silk", desc: "Smooth & Premium" },
//     { name: "Denim", desc: "Rugged & Textured" },
//     { name: "Leather", desc: "Sleek & Clean" },
//   ];

//   const upperFields = [
//     { key: "chest", label: "Chest Circumference (in)", placeholder: "e.g., 40" },
//     { key: "waist", label: "Waist Specification (in)", placeholder: "e.g., 32" },
//     { key: "length", label: "Shirt Total Length (in)", placeholder: "e.g., 30" },
//     { key: "sleeve", label: "Sleeve Total Length (in)", placeholder: "e.g., 25" },
//   ];

//   const trouserFields = [
//     { key: "trouserHips", label: "Hip Circumference (in)", placeholder: "e.g., 38" },
//     { key: "thigh", label: "Thigh Fit Width (in)", placeholder: "e.g., 22" },
//     { key: "trouserLength", label: "Inseam Trouser Length (in)", placeholder: "e.g., 42" },
//     { key: "legOpening", label: "Ankle Leg Opening (in)", placeholder: "e.g., 14" },
//   ];

//   const skirtFields = [
//     { key: "skirtWaist", label: "High Waist Width (in)", placeholder: "e.g., 28" },
//     { key: "skirtHips", label: "Seat Hip Width (in)", placeholder: "e.g., 39" },
//     { key: "skirtLength", label: "Outseam Skirt Length (in)", placeholder: "e.g., 26" },
//     { key: "flareWidth", label: "Bottom Flare Hem (in)", placeholder: "e.g., 19" },
//   ];

//   const handleMeasurementChange = (key, value) => {
//     setDesign((prev) => ({
//       ...prev,
//       measurements: { ...prev.measurements, [key]: value },
//     }));
//   };

//   const handleSave = async () => {
//     if (!design.customerName.trim() || !design.customerPhone.trim()) {
//       toast.warn("Please populate valid Customer Identity fields.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const canvasElement = document.querySelector("canvas");
//       let base64Image = canvasElement ? canvasElement.toDataURL("image/png") : null;

//       // 🧼 Sanitize inputs: Convert string input types into strict numbers for backend calculations
//       const cleanMeasurements = {};
//       Object.keys(design.measurements).forEach((key) => {
//         const val = design.measurements[key];
//         if (val !== "" && val !== null && val !== undefined) {
//           cleanMeasurements[key] = Number(val);
//         }
//       });

//       const payload = { 
//         ...design, 
//         measurements: cleanMeasurements,
//         previewImage: base64Image, 
//         selectionView: activeTab, 
//         targetLowerAsset: lowerGarmentType 
//       };

//       if (editingId) {
//         await updateDesign?.(editingId, payload);
//         toast.success("Profile sheet successfully saved!");
//         setEditingId(null);
//       } else {
//         await createDesign?.(payload);
//         toast.success("Production template created successfully!");
//       }
//     } catch (err) {
//       toast.error("Internal processing fault saving file.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const layoutTabs = [
//     {
//       key: "upper",
//       label: "👕 Upper Garment",
//       children: (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 8 }}>
//           {upperFields.map(({ key, label, placeholder }) => (
//             <div key={key}>
//               <Text style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4, color: "#4b5563" }}>{label}</Text>
//               <Input
//                 type="number"
//                 placeholder={placeholder}
//                 value={design.measurements[key]}
//                 onChange={(e) => handleMeasurementChange(key, e.target.value)}
//                 suffix={<Tag color="blue" style={{ borderRadius: 6, margin: 0, fontSize: 10 }}>in</Tag>}
//                 style={{ borderRadius: 8, height: 38 }}
//               />
//             </div>
//           ))}
//         </div>
//       ),
//     },
//     {
//       key: "lower",
//       label: "👖 Lower Garment",
//       children: (
//         <div style={{ paddingTop: 8 }}>
//           {/* LOWER GARMENT TYPE DROPDOWN SELECTOR */}
//           <div style={{ marginBottom: 16 }}>
//             <Text style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, color: "#1e293b" }}>
//               Garment Classification Selection
//             </Text>
//             <Select
//               value={lowerGarmentType}
//               onChange={(val) => {
//                 setLowerGarmentType(val);
//                 setDesign((p) => ({ ...p, styleType: "" }));
//               }}
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="trouser">👖 Trouser Specification Sheet</Option>
//               <Option value="skirt">👗 Skirt Specification Sheet</Option>
//             </Select>
//           </div>

//           <Divider style={{ margin: "12px 0" }} />

//           {/* DYNAMIC FIELD SEPARATION INJECTION */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
//             {(lowerGarmentType === "trouser" ? trouserFields : skirtFields).map(({ key, label, placeholder }) => (
//               <div key={key}>
//                 <Text style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4, color: "#4b5563" }}>{label}</Text>
//                 <Input
//                   type="number"
//                   placeholder={placeholder}
//                   value={design.measurements[key]}
//                   onChange={(e) => handleMeasurementChange(key, e.target.value)}
//                   suffix={<Tag color={lowerGarmentType === "trouser" ? "blue" : "magenta"} style={{ borderRadius: 6, margin: 0, fontSize: 10 }}>in</Tag>}
//                   style={{ borderRadius: 8, height: 38 }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "12px" }}>
//       <div style={{ marginBottom: 20 }}>
//         <Title level={2} style={{ marginBottom: 4, fontWeight: 700 }}>Design Studio</Title>
//         <Text type="secondary">Toggle configuration cards to construct custom design paths.</Text>
//       </div>

//       <Row gutter={[24, 24]}>
//         {/* LEFT VIEWPORT RIG - FIXED & STICKY RENDERING MATRIX */}
//         <Col xs={24} lg={14} style={{ position: "sticky", top: 12, zIndex: 50 }}>
//           <Card
//             bordered={false}
//             style={{
//               borderRadius: 20,
//               overflow: "hidden",
//               background: "linear-gradient(145deg, #e2e8f0 0%, #f8fafc 100%)",
//               boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
//             }}
//             bodyStyle={{ padding: 0, height: window.innerWidth < 992 ? 360 : 560 }}
//           >
//             {/* The combined use of child.geometry.center() and <Center> locks all frames uniformly */}
//             <Canvas camera={{ position: [0, 0, 2.0], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
//               <ambientLight intensity={1.4} />
//               <directionalLight position={[5, 8, 5]} intensity={1.4} />
//               <Center>
//                 <Suspense fallback={null}>
//                   <GarmentModel design={design} activeTab={activeTab} lowerGarmentType={lowerGarmentType} />
//                 </Suspense>
//               </Center>
//               <ContactShadows position={[0, -0.65, 0]} opacity={0.2} scale={4} blur={2} />
//               <OrbitControls target={[0, 0, 0]} enablePan={false} enableZoom={true} minDistance={0.8} maxDistance={3.5} />
//             </Canvas>

//             <div
//               style={{
//                 position: "absolute",
//                 bottom: 16,
//                 left: 16,
//                 background: "rgba(255,255,255,0.92)",
//                 backdropFilter: "blur(6px)",
//                 borderRadius: 8,
//                 padding: "6px 12px",
//                 fontSize: 11,
//                 fontWeight: 700,
//                 color: "#1e293b",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 textTransform: "uppercase",
//               }}
//             >
//               <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: design.color }} />
//               Active View: {activeTab === "upper" ? "Upper Body Unit" : `${lowerGarmentType}`}
//             </div>
//           </Card>
//         </Col>

//         {/* RIGHT CONTROL RIG SHEET */}
//         <Col xs={24} lg={10}>
//           <Card bordered={false} style={{ borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            
//             {/* TABS CONTROLLER AT THE TOP */}
//             <div style={{ marginBottom: 16 }}>
//               <Tabs
//                 activeKey={activeTab}
//                 onChange={(key) => setActiveTab(key)}
//                 items={layoutTabs}
//                 type="card"
//                 size="middle"
//               />
//             </div>

//             {/* CUSTOMER IDENTIFICATION CARD ENTRY */}
//             <div style={{ marginBottom: 16, background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px solid #edf2f7" }}>
//               <Title level={5} style={{ marginBottom: 10, fontSize: 12, color: "#475569" }}>📋 Production Assignment Identification</Title>
//               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 <div>
//                   <Text style={{ fontSize: 11, fontWeight: 500, display: "block", marginBottom: 2, color: "#64748b" }}>Customer Identity Name</Text>
//                   <Input
//                     type="text"
//                     placeholder="Enter Reference Tag Name"
//                     value={design.customerName}
//                     onChange={(e) => setDesign((p) => ({ ...p, customerName: e.target.value }))}
//                     style={{ borderRadius: 8, height: 36 }}
//                   />
//                 </div>
//                 <div>
//                   <Text style={{ fontSize: 11, fontWeight: 500, display: "block", marginBottom: 2, color: "#64748b" }}>Active Phone Line</Text>
//                   <Input
//                     type="tel"
//                     placeholder="Enter Active Contact Line"
//                     value={design.customerPhone}
//                     onChange={(e) => setDesign((p) => ({ ...p, customerPhone: e.target.value }))}
//                     style={{ borderRadius: 8, height: 36 }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* STRUCTURAL GENDER CONFIGURATOR */}
//             <div style={{ marginBottom: 16 }}>
//               <Title level={5} style={{ marginBottom: 8, fontSize: 12, color: "#475569" }}>Target Baseline Avatar Silhouette</Title>
//               <div style={{ display: "flex", gap: 10 }}>
//                 {["male", "female"].map((g) => (
//                   <Button
//                     key={g}
//                     block
//                     type={design.gender === g ? "primary" : "default"}
//                     onClick={() => setDesign((p) => ({ ...p, gender: g }))}
//                     style={{ borderRadius: 8, fontWeight: 600, height: 36, textTransform: "capitalize" }}
//                   >
//                     {g} Frame Profile
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* PALETTE ELEMENT SWATCH CARDS */}
//             <div style={{ marginBottom: 16 }}>
//               <Title level={5} style={{ marginBottom: 8, fontSize: 12, color: "#475569" }}>Garment Applied Colorway</Title>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                 {colors.map((c) => (
//                   <Swatch key={c} color={c} selected={design.color === c} onClick={() => setDesign((p) => ({ ...p, color: c }))} />
//                 ))}
//               </div>
//             </div>

//             {/* TEXTURE FABRIC CONFIG MATRIX */}
//             <div style={{ marginBottom: 20 }}>
//               <Title level={5} style={{ marginBottom: 8, fontSize: 12, color: "#475569" }}>Material Fabric Variant Selection</Title>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                 {fabrics.map(({ name, desc }) => (
//                   <div
//                     key={name}
//                     onClick={() => setDesign((p) => ({ ...p, fabric: name }))}
//                     style={{
//                       padding: "8px 10px",
//                       borderRadius: 8,
//                       cursor: "pointer",
//                       border: design.fabric === name ? "2px solid #3b82f6" : "2px solid #e2e8f0",
//                       background: design.fabric === name ? "#eff6ff" : "#fff",
//                       transition: "all 0.15s ease",
//                     }}
//                   >
//                     <div style={{ fontWeight: 600, fontSize: 12 }}>{name}</div>
//                     <div style={{ fontSize: 10, color: "#64748b" }}>{desc}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* SUBMIT FORM EXECUTION BUTTON */}
//             <Button
//               type="primary"
//               block
//               size="large"
//               loading={loading}
//               onClick={handleSave}
//               style={{ borderRadius: 10, fontWeight: 700, height: 44, fontSize: 14 }}
//             >
//               {editingId ? "Update Existing Metrics" : "Commit Custom Specification Design"}
//             </Button>
//           </Card>
//         </Col>
//       </Row>

//       <ToastContainer position="top-right" autoClose={2500} theme="dark" />
//     </div>
//   );
// };

// export default DesignStudio;

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Input,
  Select,
  Divider,
  Tabs,
  Upload
} from "antd";
import { PlusOutlined, DeleteOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useApp } from "../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;
const { Option } = Select;

useGLTF.preload("/shirt.glb");
useGLTF.preload("/female_shirt.glb");
useGLTF.preload("/male_trouser.glb");
useGLTF.preload("/female_skirt.glb");

/* ─────────────────────────────────────────
    GARMENT THREE.JS ENGINE LAYER
───────────────────────────────────────── */
function GarmentModel({ design, activeTab, lowerGarmentType }) {
  const modelPath = useMemo(() => {
    if (activeTab === "lower") {
      return lowerGarmentType === "skirt" ? "/female_skirt.glb" : "/male_trouser.glb";
    }
    return design.gender === "female" ? "/female_shirt.glb" : "/shirt.glb";
  }, [design.gender, activeTab, lowerGarmentType]);

  const { scene } = useGLTF(modelPath);

  const { cloned, modelNaturalSize } = useMemo(() => {
    const c = scene.clone();
    const box = new THREE.Box3().setFromObject(c);
    const center = new THREE.Vector3();
    box.getCenter(center);
    c.position.sub(center);

    const refreshedBox = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    refreshedBox.getSize(size);

    return { cloned: c, modelNaturalSize: Math.max(size.x, size.y, size.z) };
  }, [scene]);

  const dynamicScale = useMemo(() => {
    const normalizedBase = 1.0 / (modelNaturalSize || 1);

    if (activeTab === "lower") {
      if (lowerGarmentType === "skirt") {
        const sWaist = Number(design.measurements?.skirtWaist) || 28;
        const sHips = Number(design.measurements?.skirtHips) || 38;
        const sLength = Number(design.measurements?.skirtLength) || 26;
        const sFlare = Number(design.measurements?.flareWidth) || 20;

        return [
          normalizedBase * (1 + (sHips - 38) * 0.015),
          normalizedBase * (1 + (sLength - 26) * 0.02),
          normalizedBase * (1 + (sWaist - 28) * 0.012 + (sFlare - 20) * 0.01),
        ];
      } else {
        const tHips = Number(design.measurements?.trouserHips) || 36;
        const tThigh = Number(design.measurements?.thigh) || 22;
        const tLength = Number(design.measurements?.trouserLength) || 40;
        const tOpening = Number(design.measurements?.legOpening) || 14;

        return [
          normalizedBase * (1 + (tHips - 36) * 0.015),
          normalizedBase * (1 + (tLength - 40) * 0.02),
          normalizedBase * (1 + (tThigh - 22) * 0.012 + (tOpening - 14) * 0.008),
        ];
      }
    }

    const chest = Number(design.measurements?.chest) || 40;
    const waist = Number(design.measurements?.waist) || 32;
    const length = Number(design.measurements?.length) || 30;
    const sleeve = Number(design.measurements?.sleeve) || 25;

    return [
      normalizedBase * (1 + (chest - 40) * 0.015),
      normalizedBase * (1 + (length - 30) * 0.02),
      normalizedBase * (1 + (waist - 32) * 0.012 + (sleeve - 25) * 0.005),
    ];
  }, [design.measurements, modelNaturalSize, activeTab, lowerGarmentType]);

  useEffect(() => {
    const matPresets = {
      Silk: { roughness: 0.1, metalness: 0.05 },
      Cotton: { roughness: 0.85, metalness: 0 },
      Denim: { roughness: 0.95, metalness: 0 },
      Leather: { roughness: 0.4, metalness: 0.25 },
    };

    const { roughness, metalness } = matPresets[design.fabric] || matPresets.Cotton;

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(design.color),
          roughness,
          metalness,
          side: THREE.DoubleSide
        });
        child.material.needsUpdate = true;
      }
    });
  }, [cloned, design.color, design.fabric]);

  return <primitive object={cloned} scale={dynamicScale} position={[0, 0, 0]} />;
}

/* ── COLOR SWATCH DOT ── */
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
        border: selected ? "3px solid #111" : "2px solid #e5e7eb",
        transform: selected ? "scale(1.15)" : "scale(1)",
        transition: "all 0.15s ease-in-out",
        flexShrink: 0,
      }}
    />
  );
}

/* ══════════════════════════════════════════════
    MAIN DESIGN STUDIO CONTROLLER
══════════════════════════════════════════════ */
const DesignStudio = () => {
  const { createDesign, updateDesign, currentEditingDesign } = useApp?.() ?? {};

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("upper");
  const [lowerGarmentType, setLowerGarmentType] = useState("trouser");

  const [logoSketches, setLogoSketches] = useState([]); 
  const [placedLogos, setPlacedLogos] = useState([]); 
  const [activeDragId, setActiveDragId] = useState(null);
  const workspaceRef = useRef(null);

  const [design, setDesign] = useState({
    customerName: "",
    customerPhone: "",
    color: "#3b82f6",
    fabric: "Cotton",
    gender: "male",
    measurements: {
      chest: "",
      waist: "",
      length: "",
      sleeve: "",
      trouserHips: "",
      thigh: "",
      trouserLength: "",
      legOpening: "",
      skirtWaist: "",
      skirtHips: "",
      skirtLength: "",
      flareWidth: "",
    },
    styleType: "",
  });

  // Load from DB Hook verification
  useEffect(() => {
    if (currentEditingDesign) {
      setEditingId(currentEditingDesign._id || currentEditingDesign.id);
      setDesign(currentEditingDesign);
      if (currentEditingDesign.selectionView) setActiveTab(currentEditingDesign.selectionView);
      if (currentEditingDesign.targetLowerAsset) setLowerGarmentType(currentEditingDesign.targetLowerAsset);
      if (currentEditingDesign.placedLogosData) setPlacedLogos(currentEditingDesign.placedLogosData);
    }
  }, [currentEditingDesign]);

  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#1a1a1a", "#ffffff", "#94a3b8"];
  const fabrics = [
    { name: "Cotton", desc: "Breathable & standard" },
    { name: "Silk", desc: "Smooth & Premium" },
    { name: "Denim", desc: "Rugged & Textured" },
    { name: "Leather", desc: "Sleek & Clean" },
  ];

  const upperFields = [
    { key: "chest", label: "Chest Circumference (in)", placeholder: "e.g., 40" },
    { key: "waist", label: "Waist Specification (in)", placeholder: "e.g., 32" },
    { key: "length", label: "Shirt Total Length (in)", placeholder: "e.g., 30" },
    { key: "sleeve", label: "Sleeve Total Length (in)", placeholder: "e.g., 25" },
  ];

  const trouserFields = [
    { key: "trouserHips", label: "Hip Circumference (in)", placeholder: "e.g., 38" },
    { key: "thigh", label: "Thigh Fit Width (in)", placeholder: "e.g., 22" },
    { key: "trouserLength", label: "Inseam Trouser Length (in)", placeholder: "e.g., 42" },
    { key: "legOpening", label: "Ankle Leg Opening (in)", placeholder: "e.g., 14" },
  ];

  const skirtFields = [
    { key: "skirtWaist", label: "High Waist Width (in)", placeholder: "e.g., 28" },
    { key: "skirtHips", label: "Seat Hip Width (in)", placeholder: "e.g., 39" },
    { key: "skirtLength", label: "Outseam Skirt Length (in)", placeholder: "e.g., 26" },
    { key: "flareWidth", label: "Bottom Flare Hem (in)", placeholder: "e.g., 19" },
  ];

  const handleMeasurementChange = (key, value) => {
    setDesign((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value },
    }));
  };

  /* ─────────────────────────────────────────
      DRAG & DROP LOGO LOGIC SYSTEM
  ───────────────────────────────────────── */
  const handleLogoUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoSketches((prev) => [...prev, e.target.result]);
      toast.success("Sketch profile uploaded to panel container.");
    };
    reader.readAsDataURL(file);
    return false;
  };

  const addLogoToGarment = (src) => {
    const newLogo = {
      id: Date.now(),
      src,
      x: 120, 
      y: 160,
      size: 65,
    };
    setPlacedLogos((prev) => [...prev, newLogo]);
    toast.info("Logo layout added to canvas overlay.");
  };

  const handleDragStart = (id, e) => {
    setActiveDragId(id);
  };

  const handleWorkspaceMouseMove = (e) => {
    if (!activeDragId || !workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setPlacedLogos((prev) =>
      prev.map((logo) =>
        logo.id === activeDragId
          ? { ...logo, x: currentX - logo.size / 2, y: currentY - logo.size / 2 }
          : logo
      )
    );
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
  };

  const updateLogoSize = (id, newSize) => {
    setPlacedLogos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, size: Number(newSize) } : l))
    );
  };

  const removePlacedLogo = (id) => {
    setPlacedLogos((prev) => prev.filter((l) => l.id !== id));
    toast.success("Asset removed from layout workbench.");
  };

  /* ─────────────────────────────────────────
      COMPOSITE FLATTEN PREVIEW IMAGE CAPTURE
  ───────────────────────────────────────── */
  const captureStudioLayerSnapshot = () => {
    return new Promise((resolve) => {
      const canvasElement = document.querySelector("canvas");
      if (!canvasElement) return resolve(null);

      const compositeCanvas = document.createElement("canvas");
      compositeCanvas.width = canvasElement.width;
      compositeCanvas.height = canvasElement.height;
      const ctx = compositeCanvas.getContext("2d");

      ctx.drawImage(canvasElement, 0, 0);

      if (placedLogos.length === 0) {
        return resolve(compositeCanvas.toDataURL("image/png"));
      }

      const rect = workspaceRef.current.getBoundingClientRect();
      const scaleX = compositeCanvas.width / rect.width;
      const scaleY = compositeCanvas.height / rect.height;

      let loadedCount = 0;
      placedLogos.forEach((logo) => {
        const img = new Image();
        img.src = logo.src;
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.drawImage(
            img,
            logo.x * scaleX,
            logo.y * scaleY,
            logo.size * scaleX,
            logo.size * scaleY
          );
          loadedCount++;
          if (loadedCount === placedLogos.length) {
            resolve(compositeCanvas.toDataURL("image/png"));
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === placedLogos.length) {
            resolve(compositeCanvas.toDataURL("image/png"));
          }
        };
      });
    });
  };

  const handleSave = async () => {
    if (!design.customerName.trim() || !design.customerPhone.trim()) {
      toast.warn("Please populate valid Customer Identity fields.");
      return;
    }
    try {
      setLoading(true);
      
      const base64Image = await captureStudioLayerSnapshot();

      const cleanMeasurements = {};
      Object.keys(design.measurements).forEach((key) => {
        const val = design.measurements[key];
        if (val !== "" && val !== null && val !== undefined) {
          cleanMeasurements[key] = Number(val);
        }
      });

      const payload = { 
        ...design, 
        measurements: cleanMeasurements,
        previewImage: base64Image, 
        selectionView: activeTab, 
        targetLowerAsset: lowerGarmentType,
        placedLogosData: placedLogos 
      };

      if (editingId) {
        await updateDesign?.(editingId, payload);
        toast.success("Profile sheet successfully saved!");
        setEditingId(null);
      } else {
        await createDesign?.(payload);
        toast.success("Production template created successfully!");
      }
    } catch (err) {
      toast.error("Internal processing fault saving file.");
    } finally {
      setLoading(false);
    }
  };

  const layoutTabs = [
    {
      key: "upper",
      label: "👕 Upper Garment",
      children: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 8 }}>
          {upperFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <Text style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4, color: "#4b5563" }}>{label}</Text>
              <Input
                type="number"
                placeholder={placeholder}
                value={design.measurements[key]}
                onChange={(e) => handleMeasurementChange(key, e.target.value)}
                suffix={<Tag color="blue" style={{ borderRadius: 6, margin: 0, fontSize: 10 }}>in</Tag>}
                style={{ borderRadius: 8, height: 38 }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "lower",
      label: "👖 Lower Garment",
      children: (
        <div style={{ paddingTop: 8 }}>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6, color: "#1e293b" }}>
              Garment Classification Selection
            </Text>
            <Select
              value={lowerGarmentType}
              onChange={(val) => {
                setLowerGarmentType(val);
                setDesign((p) => ({ ...p, styleType: "" }));
              }}
              style={{ width: "100%" }}
              size="large"
            >
              <Option value="trouser">👖 Trouser Specification Sheet</Option>
              <Option value="skirt">👗 Skirt Specification Sheet</Option>
            </Select>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {(lowerGarmentType === "trouser" ? trouserFields : skirtFields).map(({ key, label, placeholder }) => (
              <div key={key}>
                <Text style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4, color: "#4b5563" }}>{label}</Text>
                <Input
                  type="number"
                  placeholder={placeholder}
                  value={design.measurements[key]}
                  onChange={(e) => handleMeasurementChange(key, e.target.value)}
                  suffix={<Tag color={lowerGarmentType === "trouser" ? "blue" : "magenta"} style={{ borderRadius: 6, margin: 0, fontSize: 10 }}>in</Tag>}
                  style={{ borderRadius: 8, height: 38 }}
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "12px" }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ marginBottom: 4, fontWeight: 700 }}>Design Studio Workbench</Title>
        <Text type="secondary">Toggle configuration cards and drag custom sketches onto the canvas layout map.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* LEFT VIEWPORT RIG */}
        <Col xs={24} lg={14} style={{ position: "sticky", top: 12, zIndex: 10 }}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              background: "linear-gradient(145deg, #e2e8f0 0%, #f8fafc 100%)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              position: "relative"
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div 
              ref={workspaceRef}
              onMouseMove={handleWorkspaceMouseMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              style={{ 
                position: "relative", 
                width: "100%", 
                height: window.innerWidth < 992 ? 380 : 580,
                userSelect: "none"
              }}
            >
              <Canvas camera={{ position: [0, 0, 2.0], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
                <ambientLight intensity={1.4} />
                <directionalLight position={[5, 8, 5]} intensity={1.4} />
                <Center>
                  <Suspense fallback={null}>
                    <GarmentModel design={design} activeTab={activeTab} lowerGarmentType={lowerGarmentType} />
                  </Suspense>
                </Center>
                <ContactShadows position={[0, -0.65, 0]} opacity={0.2} scale={4} blur={2} />
                <OrbitControls 
                  target={[0, 0, 0]} 
                  enablePan={false} 
                  enableZoom={true} 
                  minDistance={0.8} 
                  maxDistance={3.5}
                  enabled={activeDragId === null} 
                />
              </Canvas>

              {/* 🎯 2D CANVAS LOGO PLACEMENT OVERLAY */}
              {activeTab === "upper" && placedLogos.map((logo) => (
                <div
                  key={logo.id}
                  onMouseDown={(e) => handleDragStart(logo.id, e)}
                  style={{
                    position: "absolute",
                    left: logo.x,
                    top: logo.y,
                    width: logo.size,
                    height: logo.size,
                    cursor: "move",
                    border: "2px dashed #3b82f6",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  {/* Quick Delete Overlay Button Asset */}
                  <CloseCircleFilled 
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlacedLogo(logo.id);
                    }}
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      color: "#ef4444",
                      fontSize: 18,
                      cursor: "pointer",
                      background: "#fff",
                      borderRadius: "50%",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      zIndex: 100
                    }}
                  />
                  <img src={logo.src} alt="Placed Sketch" style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
                </div>
              ))}

              <div style={{
                position: "absolute", bottom: 16, left: 16, background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(6px)", borderRadius: 8, padding: "6px 12px", fontSize: 11,
                fontWeight: 700, color: "#1e293b", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase"
              }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: design.color }} />
                Active View: {activeTab === "upper" ? "Upper Body Unit" : `${lowerGarmentType}`}
              </div>
            </div>
          </Card>
        </Col>

        {/* RIGHT CONTROL PANEL RIG */}
        <Col xs={24} lg={10}>
          <Card bordered={false} style={{ borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            
            <div style={{ marginBottom: 16 }}>
              <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={layoutTabs}
                type="card"
                size="middle"
              />
            </div>

            {/* SKETCH EMBLEM GRAPHICS MANAGER SECTION */}
            {activeTab === "upper" && (
              <div style={{ marginBottom: 16, padding: "14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #edf2f7" }}>
                <Text style={{ fontSize: 12, fontWeight: 700, display: "block", marginBottom: 8, color: "#1e293b" }}>🎨 Sketch Emblem & Logo Overlay</Text>
                
                <Upload beforeUpload={handleLogoUpload} showUploadList={false} accept="image/*">
                  <Button icon={<PlusOutlined />} style={{ borderRadius: 8, width: "100%", marginBottom: 12 }}>Upload New Custom Sketch Asset</Button>
                </Upload>

                {logoSketches.length > 0 && (
                  <div>
                    <Text style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Tap an asset to inject onto the shirt layout:</Text>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      {logoSketches.map((src, idx) => (
                        <img 
                          key={idx} 
                          src={src} 
                          onClick={() => addLogoToGarment(src)}
                          alt="Sketch option" 
                          style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 6, border: "1px solid #cbd5e1", cursor: "pointer", background: "#fff" }} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Placed Elements Controls Tray List */}
                {placedLogos.length > 0 && (
                  <div style={{ marginTop: 10, background: "#ffffff", padding: 8, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <Text style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>Active Overlays Dimensions Adjuster:</Text>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                      {placedLogos.map((l, index) => (
                        <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#f8fafc", padding: "4px 8px", borderRadius: 6 }}>
                          <span style={{ fontSize: 11, color: "#64748b" }}>Logo #{index + 1} Scale</span>
                          <input 
                            type="range" min="30" max="150" value={l.size} 
                            onChange={(e) => updateLogoSize(l.id, e.target.value)} 
                            style={{ flex: 1, accentColor: "#3b82f6" }}
                          />
                          <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removePlacedLogo(l.id)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CUSTOMER IDENTIFICATION ENTRY */}
            <div style={{ marginBottom: 16, background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px solid #edf2f7" }}>
              <Title level={5} style={{ marginBottom: 10, fontSize: 12, color: "#475569" }}>📋 Production Assignment Identification</Title>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <Text style={{ fontSize: 11, fontWeight: 500, display: "block", marginBottom: 2, color: "#64748b" }}>Customer Identity Name</Text>
                  <Input
                    type="text"
                    placeholder="Enter Reference Tag Name"
                    value={design.customerName}
                    onChange={(e) => setDesign((p) => ({ ...p, customerName: e.target.value }))}
                    style={{ borderRadius: 8, height: 36 }}
                  />
                </div>
                <div>
                  <Text style={{ fontSize: 11, fontWeight: 500, display: "block", marginBottom: 2, color: "#64748b" }}>Active Phone Line</Text>
                  <Input
                    type="tel"
                    placeholder="Enter Active Contact Line"
                    value={design.customerPhone}
                    onChange={(e) => setDesign((p) => ({ ...p, customerPhone: e.target.value }))}
                    style={{ borderRadius: 8, height: 36 }}
                  />
                </div>
              </div>
            </div>

            {/* STRUCTURAL GENDER CONFIGURATOR */}
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ marginBottom: 8, fontSize: 12, color: "#475569" }}>Target Baseline Avatar Silhouette</Title>
              <div style={{ display: "flex", gap: 10 }}>
                {["male", "female"].map((g) => (
                  <Button
                    key={g}
                    block
                    type={design.gender === g ? "primary" : "default"}
                    onClick={() => setDesign((p) => ({ ...p, gender: g }))}
                    style={{ borderRadius: 8, fontWeight: 600, height: 36, textTransform: "capitalize" }}
                  >
                    {g} Frame Profile
                  </Button>
                ))}
              </div>
            </div>

            {/* PALETTE ELEMENT SWATCH CARDS */}
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ marginBottom: 8, fontSize: 12, color: "#475569" }}>Garment Applied Colorway</Title>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {colors.map((c) => (
                  <Swatch key={c} color={c} selected={design.color === c} onClick={() => setDesign((p) => ({ ...p, color: c }))} />
                ))}
              </div>
            </div>

            {/* TEXTURE FABRIC CONFIG MATRIX */}
            <div style={{ marginBottom: 20 }}>
              <Title level={5} style={{ marginBottom: 8, fontSize: 12, color: "#475569" }}>Material Fabric Variant Selection</Title>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {fabrics.map(({ name, desc }) => (
                  <div
                    key={name}
                    onClick={() => setDesign((p) => ({ ...p, fabric: name }))}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      cursor: "pointer",
                      border: design.fabric === name ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                      background: design.fabric === name ? "#eff6ff" : "#fff",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{name}</div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handleSave}
              style={{ borderRadius: 10, fontWeight: 700, height: 44, fontSize: 14 }}
            >
              {editingId ? "Update Existing Metrics" : "Commit Custom Specification Design"}
            </Button>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
    </div>
  );
};

export default DesignStudio;