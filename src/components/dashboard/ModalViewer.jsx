import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds } from "@react-three/drei";

/* ---------------- MALE ---------------- */
function MaleAvatar() {
  const { scene } = useGLTF("/male.glb");

  return (
    <primitive
      object={scene}
      scale={1.8}
      position={[0, -1, 0]}   // 🔥 normalize height
    />
  );
}

/* ---------------- FEMALE ---------------- */
function FemaleAvatar() {
  const { scene } = useGLTF("/female.glb");

  return (
    <primitive
      object={scene}
      scale={1.8}
      position={[0, -1, 0]}   // 🔥 same baseline as male
    />
  );
}

/* ---------------- SWITCH AVATAR ---------------- */
function Avatar({ design }) {
  return design.gender === "female"
    ? <FemaleAvatar />
    : <MaleAvatar />;
}

/* ---------------- SHIRT OVERLAY ---------------- */
function Shirt({ design }) {
  return (
    <mesh position={[0, 0.2, 0.35]} scale={[1, 1.2, 1]}>
      <planeGeometry args={[0.9, 1.2]} />

      <meshStandardMaterial
        color={design.color}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ---------------- MAIN VIEWER ---------------- */
function ModelViewer({ design }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      
      {/* LIGHTS */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} />

      {/* AUTO FIT + CENTER */}
      <Bounds fit clip observe margin={1.5}>
        <Center>
          <group scale={1.8} position={[0, 0, 0]}>
            
            {/* BODY */}
            <Avatar design={design} />

            {/* SHIRT */}
            <Shirt design={design} />

          </group>
        </Center>
      </Bounds>

      {/* CAMERA CONTROLS */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
      />

    </Canvas>
  );
}

export default ModelViewer;