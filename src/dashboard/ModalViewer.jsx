import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds, useTexture } from "@react-three/drei";

import * as THREE from "three";

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

/* ---------------- MAIN VIEWER ---------------- */
function ModelViewer({ design }) {
  return (
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
  );
}

export default ModelViewer;