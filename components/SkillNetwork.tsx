
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Line, OrbitControls, Billboard, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { SKILLS } from '../constants';

interface NodeData {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  size: number;
  isCategory?: boolean;
}

interface LinkData {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

// Category Color Palette
const CAT_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
];

const Node: React.FC<NodeData & { textColor: string }> = ({ position, label, color, size, isCategory, textColor }) => {
  const [hovered, setHover] = useState(false);
  
  return (
    // @ts-ignore
    <group position={position}>
      <Sphere 
        args={[size, 32, 32]} 
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }} 
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
      >
        {/* @ts-ignore */}
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          emissive={color} 
          emissiveIntensity={hovered ? 0.8 : 0.3} 
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, size + 0.35, 0]}
          fontSize={isCategory ? (hovered ? 0.6 : 0.45) : (hovered ? 0.4 : 0.3)}
          color={hovered ? color : textColor} 
          anchorX="center"
          anchorY="bottom"
          outlineWidth={isCategory ? 0.02 : 0}
          outlineColor={textColor}
          fontWeight={isCategory ? "bold" : "normal"}
        >
          {label}
        </Text>
      </Billboard>
    {/* @ts-ignore */}
    </group>
  );
};

const NetworkGraph = ({ accentColor, textColor }: { accentColor: string, textColor: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const { nodes, links } = useMemo(() => {
    const nodes: NodeData[] = [];
    const links: LinkData[] = [];

    // Center Node (Profile)
    const centerPos: [number, number, number] = [0, 0, 0];
    nodes.push({
      id: 'root',
      label: 'Skills',
      position: centerPos,
      color: accentColor,
      size: 0.6,
      isCategory: true
    });

    const catRadius = 5;
    const skillLocalRadius = 2.2;

    SKILLS.forEach((cat, i) => {
        const totalCats = SKILLS.length;
        const theta = (i / totalCats) * Math.PI * 2;
        const cx = Math.cos(theta) * catRadius;
        const cz = Math.sin(theta) * catRadius;
        const cy = (i % 2 === 0 ? 1.0 : -1.0); 

        const catPos: [number, number, number] = [cx, cy, cz];
        const catColor = CAT_COLORS[i % CAT_COLORS.length];

        nodes.push({
            id: `cat-${i}`,
            label: cat.category,
            position: catPos,
            color: catColor, 
            size: 0.35,
            isCategory: true
        });

        links.push({
            start: centerPos,
            end: catPos,
            color: catColor
        });

        const skillsList = cat.skills.split(',').map(s => s.trim());
        const totalSkills = skillsList.length;

        skillsList.forEach((skill, j) => {
            const phi = (j / totalSkills) * Math.PI * 2;
            const sx = Math.cos(phi) * skillLocalRadius;
            const sy = Math.sin(phi) * skillLocalRadius * 0.5;
            const sz = (Math.random() - 0.5) * 2; 
            
            const skillPos: [number, number, number] = [
                cx + sx, 
                cy + sy + (Math.random() * 1 - 0.5), 
                cz + sz
            ];

            nodes.push({
                id: `skill-${i}-${j}`,
                label: skill,
                position: skillPos,
                color: catColor, // Inherit category color
                size: 0.12,
                isCategory: false
            });

            links.push({
                start: catPos,
                end: skillPos,
                color: catColor
            });
        });
    });

    return { nodes, links };
  }, [accentColor]);

  useFrame((state) => {
    if (groupRef.current) {
        // Gentle rotation that slows down if user interacts (handled via orbit controls mostly, but we add constant drift)
        groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    // @ts-ignore
    <group ref={groupRef}>
      {links.map((link, i) => (
         <Line
            key={`link-${i}`}
            points={[link.start, link.end]}
            color={link.color}
            lineWidth={1}
            transparent
            opacity={0.3}
         />
      ))}
      {nodes.map((node) => (
        <Node key={node.id} {...node} textColor={textColor} />
      ))}
    {/* @ts-ignore */}
    </group>
  );
};

const ResponsiveCamera = () => {
    const { camera, size } = useThree();
    useEffect(() => {
        if (size.width < 600) {
            camera.position.set(0, 12, 22); 
        } else if (size.width < 1024) {
             camera.position.set(0, 10, 18);
        } else {
            camera.position.set(0, 8, 14);
        }
    }, [size.width, camera]);
    return null;
}

const SkillNetwork = ({ darkMode, accentColor }: { darkMode: boolean, accentColor: string }) => {
  return (
    <div className="w-full h-full min-h-[inherit] cursor-move">
      <Canvas camera={{ fov: 45 }}>
        <ResponsiveCamera />
        {/* @ts-ignore */}
        {darkMode ? <fog attach="fog" args={['#0f172a', 10, 45]} /> : <fog attach="fog" args={['#F8FAFC', 10, 45]} />}
        {/* @ts-ignore */}
        <ambientLight intensity={0.6} />
        {/* @ts-ignore */}
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        {/* @ts-ignore */}
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        
        <NetworkGraph accentColor={accentColor} textColor={darkMode ? "#e2e8f0" : "#1e293b"} />
        
        <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={5} 
            maxDistance={35} 
            autoRotate={false}
            dampingFactor={0.05}
        />
      </Canvas>
      <div className="absolute bottom-4 right-4 text-[10px] text-text-muted bg-surface/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
        Drag to Rotate • Scroll to Zoom
      </div>
    </div>
  );
};

export default SkillNetwork;
