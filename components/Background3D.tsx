
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';

interface BackgroundProps {
  darkMode: boolean;
  accentColor: string;
}

// Manual implementation of random point generation in a sphere
function generateSpherePoints(count: number, radius: number) {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random()) * radius;
    const sinPhi = Math.sin(phi);
    const x = r * sinPhi * Math.cos(theta);
    const y = r * sinPhi * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    data[i * 3] = x;
    data[i * 3 + 1] = y;
    data[i * 3 + 2] = z;
  }
  return data;
}

const ParticleSphere = ({ darkMode, accentColor }: { darkMode: boolean, accentColor: string }) => {
  const ref = useRef<any>(null);
  
  const sphere = useMemo(() => {
    return generateSpherePoints(3000, 1.8);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    // @ts-ignore
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={darkMode ? accentColor : "#334155"} // Darker particles in light mode for visibility
          size={darkMode ? 0.005 : 0.004}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={darkMode ? 0.8 : 0.4}
        />
      </Points>
    {/* @ts-ignore */}
    </group>
  );
};

const Background3D: React.FC<BackgroundProps> = ({ darkMode, accentColor }) => {
  return (
    <div className="absolute inset-0 z-0 transition-opacity duration-700">
      <Canvas camera={{ position: [0, 0, 3] }}>
        {/* @ts-ignore */}
        {darkMode && <fog attach="fog" args={['#0B1120', 2, 6]} />}
        {/* @ts-ignore */}
        {!darkMode && <fog attach="fog" args={['#F8FAFC', 2, 8]} />}
        
        {/* @ts-ignore */}
        <ambientLight intensity={0.5} />
        
        {darkMode && <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />}
        
        <ParticleSphere darkMode={darkMode} accentColor={accentColor} />
      </Canvas>
    </div>
  );
};

export default Background3D;
