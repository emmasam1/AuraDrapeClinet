import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Bounds,
  useTexture,
} from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

/* ---------------- MALE ---------------- */
function MaleAvatar() {
  const { scene } = useGLTF("/male.glb");

  return (
    <primitive
      object={scene}
      scale={1.8}
      position={[0, -1, 0]}
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
      position={[0, -1, 0]}
    />
  );
}

/* ---------------- AVATAR SWITCH ---------------- */
function Avatar({ design }) {
  return design.gender === "female"
    ? <FemaleAvatar />
    : <MaleAvatar />;
}

/* ---------------- SHIRT ---------------- */
function Shirt({ design }) {
  const { scene } = useGLTF("/shirt.glb");

  /* FABRIC TEXTURES */
  const cotton = useTexture("/textures/cotton.jpg");
  const silk = useTexture("/textures/silk.jpg");
  const denim = useTexture("/textures/denim.jpg");
  const leather = useTexture("/textures/leather.jpg");

  const textureMap = {
    Cotton: cotton,
    Silk: silk,
    Denim: denim,
    Leather: leather,
  };

  const selectedTexture = textureMap[design.fabric];

  /* APPLY MATERIAL ON CHANGE */
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: selectedTexture,
          color: new THREE.Color(design.color),
          roughness: design.fabric === "Silk" ? 0.2 : 0.8,
          metalness: design.fabric === "Leather" ? 0.3 : 0,
        });

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, selectedTexture, design.color, design.fabric]);

  /* MEASUREMENTS */
  const chest =
    Number(design.measurements.chest) || 40;

  const waist =
    Number(design.measurements.waist) || 32;

  const length =
    Number(design.measurements.length) || 30;

  const sleeve =
    Number(design.measurements.sleeve) || 25;

  /* SCALING */
  const scaleX = chest / 40;
  const scaleY = length / 30;
  const scaleZ = waist / 32;

  return (
    <primitive
      object={scene}
      position={[0, -1, 0]}
      scale={[scaleX, scaleY, scaleZ]}
    />
  );
}

/* ---------------- MAIN VIEWER ---------------- */
function ModelViewer({ design }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 3], fov: 50 }}
    >
      {/* LIGHTS */}
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[3, 5, 2]}
        intensity={1.5}
        castShadow
      />

      {/* MODEL */}
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <group>
            <Avatar design={design} />
            <Shirt design={design} />
          </group>
        </Center>
      </Bounds>

      {/* CONTROLS */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
      />
    </Canvas>
  );
}

export default ModelViewer;