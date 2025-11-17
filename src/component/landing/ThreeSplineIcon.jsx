import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";

function SplineIconModel(props) {
  const { scene } = useGLTF("/3d/spline-icon.gltf");

  useFrame((state, delta) => {
    scene.rotation.y += delta * 0.6; // slow spin
  });

  return <primitive object={scene} {...props} />;
}

// Preload for faster first render
useGLTF.preload("/3d/spline-icon.gltf");

export default function ThreeSplineIcon() {
  return (
    <div className="tw:absolute tw:right-6 tw:bottom-6 tw:h-32 tw:w-32 tw:pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <directionalLight intensity={1.2} position={[2, 4, 3]} />
        <Suspense fallback={null}>
          <SplineIconModel />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
