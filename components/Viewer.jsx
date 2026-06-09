'use client';

import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Center,
  Bounds,
  Grid,
  GizmoHelper,
  GizmoViewport,
  useProgress,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import InfoPanel from './InfoPanel';

const CLIP_PLANE = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

// Runs once on the first rendered frame — after Bounds' useEffect has fired and
// set controls.minDistance to the fit distance. Resets it so the user can zoom freely.
function ZoomUnlocker() {
  const { controls } = useThree();
  const done = useRef(false);
  useFrame(() => {
    if (done.current || !controls) return;
    controls.minDistance = 0;
    done.current = true;
  });
  return null;
}

// ─── Loading overlay ─────────────────────────────────────────────────────────
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          color: '#7bbcff',
          fontSize: 13,
          fontFamily: 'system-ui, sans-serif',
          background: 'rgba(10,10,20,0.9)',
          padding: '8px 18px',
          borderRadius: 8,
          border: '1px solid rgba(99,179,237,0.25)',
          whiteSpace: 'nowrap',
        }}
      >
        Loading {Math.round(progress)}%
      </div>
    </Html>
  );
}

// ─── 3D scene ────────────────────────────────────────────────────────────────
function Scene({ wireframe, transparent, sectionCut, cutPosition, onBoundsReady }) {
  const { scene } = useGLTF('/version2_full.glb');
  const { gl } = useThree();
  const boundsComputed = useRef(false);

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  useEffect(() => {
    if (boundsComputed.current) return;
    boundsComputed.current = true;
    const box = new THREE.Box3().setFromObject(scene);
    const centerY = (box.min.y + box.max.y) / 2;
    onBoundsReady(box.min.y - centerY, box.max.y - centerY);
  }, [scene, onBoundsReady]);

  useEffect(() => {
    scene.traverse((node) => {
      if (!node.isMesh) return;
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach((mat) => {
        if (!mat?.isMaterial) return;
        mat.wireframe = wireframe;
        mat.transparent = transparent;
        mat.opacity = transparent ? 0.3 : 1;
        mat.side = sectionCut ? THREE.DoubleSide : THREE.FrontSide;
        mat.clippingPlanes = sectionCut ? [CLIP_PLANE] : [];
        mat.needsUpdate = true;
      });
    });
  }, [scene, wireframe, transparent, sectionCut]);

  useEffect(() => {
    CLIP_PLANE.constant = cutPosition;
  }, [cutPosition]);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

useGLTF.preload('/version2_full.glb');

// ─── Toolbar icons ────────────────────────────────────────────────────────────
const IconWireframe = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <polygon points="7,1 13,12 1,12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    <line x1="7" y1="1" x2="7" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    <line x1="3.5" y1="6.5" x2="10.5" y2="6.5" stroke="currentColor" strokeWidth="1" opacity="0.45" />
  </svg>
);

const IconTransparent = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2" fill="none" />
    <circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.4" opacity="0.55" fill="none" />
  </svg>
);

const IconSection = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <rect x="1.5" y="7" width="11" height="5.5" fill="currentColor" opacity="0.15" />
    <line x1="0" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconFullscreen = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 1h4v1.5H2.5V5H1V1zM13 1h-4v1.5h2.5V5H13V1zM1 13h4v-1.5H2.5V9H1v4zM13 13h-4v-1.5h2.5V9H13v4z" fill="currentColor" />
  </svg>
);

const IconExit = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M4.5 1H1v3.5h1.5V2.5H4.5V1zM9.5 1v1.5h2.5v2H13.5V1H9.5zM1 9.5V13h3.5v-1.5H2.5V9.5H1zM11.5 9.5H13v3.5H9.5V11.5h2V9.5z" fill="currentColor" />
  </svg>
);

// ─── Toolbar button ───────────────────────────────────────────────────────────
function Btn({ active = false, onClick, icon, label }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '7px 13px',
        borderRadius: 9,
        border: active ? '1px solid rgba(99,179,237,0.45)' : '1px solid transparent',
        background: active
          ? 'rgba(66,153,225,0.18)'
          : hover
          ? 'rgba(255,255,255,0.06)'
          : 'transparent',
        color: active ? '#90cdf4' : 'rgba(255,255,255,0.62)',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'inherit',
        letterSpacing: 0.2,
        transition: 'background 0.12s, color 0.12s, border-color 0.12s',
        outline: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Tab pill button ──────────────────────────────────────────────────────────
function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 18px',
        borderRadius: 7,
        border: 'none',
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.38)',
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'background 0.12s, color 0.12s',
        letterSpacing: 0.2,
      }}
    >
      {children}
    </button>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function Viewer() {
  const containerRef = useRef(null);
  const [tab, setTab] = useState('info');
  const [wireframe, setWireframe] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const [sectionCut, setSectionCut] = useState(false);
  const [cutPosition, setCutPosition] = useState(0);
  const [cutRange, setCutRange] = useState({ min: -1, max: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleBoundsReady = useCallback((minY, maxY) => {
    const pad = Math.max(Math.abs(maxY - minY) * 0.04, 0.02);
    setCutRange({ min: minY - pad, max: maxY + pad });
    setCutPosition((minY + maxY) / 2);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0c0c12',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          height: 50,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,8,16,0.95)',
          zIndex: 20,
        }}
      >
        {/* Logo */}
        <span
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
            userSelect: 'none',
            minWidth: 120,
          }}
        >
          NeoVenturi
        </span>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 10,
            padding: '3px',
          }}
        >
          <Tab active={tab === 'info'} onClick={() => setTab('info')}>
            Info
          </Tab>
          <Tab active={tab === 'model'} onClick={() => setTab('model')}>
            Model
          </Tab>
        </div>

        {/* Right spacer / hint */}
        <span
          style={{
            color: 'rgba(255,255,255,0.16)',
            fontSize: 11,
            minWidth: 120,
            textAlign: 'right',
            userSelect: 'none',
            display: tab === 'model' ? 'block' : 'none',
          }}
        >
          Drag · Scroll · Right-click
        </span>
        {tab === 'info' && <span style={{ minWidth: 120 }} />}
      </div>

      {/* ── Content area ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Info tab */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: tab === 'info' ? 'block' : 'none',
          }}
        >
          <InfoPanel />
        </div>

        {/* Model tab — always mounted so camera/state are preserved on tab switch */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: tab === 'model' ? 'block' : 'none',
          }}
        >
          <Canvas
            camera={{ position: [4, 3, 5], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
            onCreated={({ gl }) => {
              gl.localClippingEnabled = true;
            }}
          >
            <color attach="background" args={['#0c0c12']} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[8, 12, 5]} intensity={1.4} />
            <directionalLight position={[-6, -4, -8]} intensity={0.22} color="#6680ff" />
            <pointLight position={[0, 6, 0]} intensity={0.3} />

            <Suspense fallback={<Loader />}>
              <Bounds fit clip margin={1.4}>
                <Scene
                  wireframe={wireframe}
                  transparent={transparent}
                  sectionCut={sectionCut}
                  cutPosition={cutPosition}
                  onBoundsReady={handleBoundsReady}
                />
              </Bounds>
              <ZoomUnlocker />
            </Suspense>

            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.06}
              minDistance={0.2}
              maxDistance={100}
            />

            <Grid
              infiniteGrid
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#15152a"
              sectionSize={2}
              sectionThickness={1}
              sectionColor="#24243c"
              fadeDistance={24}
              fadeStrength={1.5}
            />

            <GizmoHelper alignment="bottom-right" margin={[88, 96]}>
              <GizmoViewport
                axisColors={['#ff5555', '#55dd55', '#4488ff']}
                labelColor="white"
              />
            </GizmoHelper>
          </Canvas>

          {/* Viewer controls */}
          <div
            style={{
              position: 'absolute',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              zIndex: 10,
            }}
          >
            {sectionCut && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'rgba(8,8,18,0.92)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: '9px 18px',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255,255,255,0.32)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  Cut Height
                </span>
                <input
                  type="range"
                  min={cutRange.min}
                  max={cutRange.max}
                  step={(cutRange.max - cutRange.min) / 400}
                  value={cutPosition}
                  onChange={(e) => setCutPosition(parseFloat(e.target.value))}
                  style={{ width: 200, accentColor: '#4299e1', cursor: 'pointer' }}
                />
                <span
                  style={{
                    color: 'rgba(255,255,255,0.25)',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    minWidth: 42,
                    textAlign: 'right',
                  }}
                >
                  {cutPosition.toFixed(2)}
                </span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                background: 'rgba(8,8,18,0.92)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: '8px 10px',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
              }}
            >
              <Btn active={wireframe} onClick={() => setWireframe((v) => !v)} icon={<IconWireframe />} label="Wireframe" />
              <Btn active={transparent} onClick={() => setTransparent((v) => !v)} icon={<IconTransparent />} label="Transparent" />
              <Btn active={sectionCut} onClick={() => setSectionCut((v) => !v)} icon={<IconSection />} label="Section Cut" />
              <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
              <Btn
                onClick={toggleFullscreen}
                icon={isFullscreen ? <IconExit /> : <IconFullscreen />}
                label={isFullscreen ? 'Exit' : 'Fullscreen'}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
