import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Avatar() {
  return (
    <mesh rotation={[0,0,0]}>
      <boxGeometry args={[2,4,1]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  );
}

function ModelViewer() {
  return (
    <Canvas camera={{ position:[0,0,8] }}>

      <ambientLight intensity={1} />
      <directionalLight position={[2,5,2]} />

      <Avatar />

      <OrbitControls />

    </Canvas>
  );
}

export default ModelViewer;