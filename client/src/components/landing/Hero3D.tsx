import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

const Hologram = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} scale={1.5}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#00f3ff"
                    emissive="#00f3ff"
                    emissiveIntensity={2}
                    wireframe
                    transparent
                    opacity={0.8}
                />
            </mesh>
            <mesh scale={1.48}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.9} />
            </mesh>
        </Float>
    );
};

const Grid = () => {
    const gridRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (gridRef.current) {
            // Move grid towards camera to simulate speed
            gridRef.current.position.z = (state.clock.getElapsedTime() * 0.5) % 2;
        }
    });

    return (
        <group rotation={[Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
            <gridHelper args={[20, 40, 0xff00ff, 0x00f3ff]} position={[0, 0, 0]} />
            <gridHelper args={[20, 40, 0xff00ff, 0x00f3ff]} position={[0, 0, -20]} />
        </group>
    );
};

const Particles = () => {
    const count = 1000;
    const mesh = useRef<THREE.InstancedMesh>(null);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <Stars radius={50} depth={50} count={count} factor={4} saturation={0} fade speed={1} />
    );
};

const FloatingSymbols = () => {
    const symbols = useMemo(() => {
        const chars = ['$', '₿', 'Ξ', '€', '£', '¥', '₮'];
        return new Array(20).fill(0).map(() => ({
            char: chars[Math.floor(Math.random() * chars.length)],
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            scale: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 2 + 1
        }));
    }, []);

    return (
        <>
            {symbols.map((props, i) => (
                <Float key={i} speed={props.speed} rotationIntensity={2} floatIntensity={2}>
                    <Text
                        position={props.position}
                        fontSize={props.scale}
                        color="#00f3ff"
                        fillOpacity={0.1}
                        outlineWidth={0.01}
                        outlineColor="#00f3ff"
                        outlineOpacity={0.2}
                    >
                        {props.char}
                    </Text>
                </Float>
            ))}
        </>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />

                <Hologram />
                <FloatingSymbols />
                <Particles />
                <Grid />

                <Environment preset="city" />
                <fog attach="fog" args={['#050505', 5, 15]} />
            </Canvas>
        </div>
    );
};

export default Hero3D;
