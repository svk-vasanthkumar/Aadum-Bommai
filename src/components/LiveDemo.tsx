import React, { useEffect, useRef, useState, useCallback } from 'react';
import { VerletRopeSimulation } from '../physics/VerletRope';
import { CHARMS, getCharmById } from '../data/charms';
import { CharmId, PhysicsParams, PhysicsTelemetry } from '../types';
import { 
  Play, 
  RotateCcw, 
  Wind, 
  Sliders, 
  Info, 
  MousePointer2, 
  Zap, 
  Volume2, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface LiveDemoProps {
  isDesktopSimulator: boolean;
  onFpsUpdate: (fps: number) => void;
  selectedCharmId: CharmId;
  onSelectCharm: (id: CharmId) => void;
}

export const LiveDemo: React.FC<LiveDemoProps> = ({
  isDesktopSimulator,
  onFpsUpdate,
  selectedCharmId,
  onSelectCharm
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simRef = useRef<VerletRopeSimulation | null>(null);

  const [physicsParams, setPhysicsParams] = useState<PhysicsParams>({
    ropeLength: 280,
    segments: 14,
    gravity: 0.38,
    damping: 0.992,
    wind: 0.04,
    idleMovement: true,
    anchorYOffset: 12
  });

  const [telemetry, setTelemetry] = useState<PhysicsTelemetry>({
    fps: 60,
    speed: 0,
    angleDeg: 0,
    tension: 20,
    state: 'idle'
  });

  const [isHoveringCharm, setIsHoveringCharm] = useState(false);
  const [clickThroughNote, setClickThroughNote] = useState<string | null>(null);
  const currentCharm = getCharmById(selectedCharmId);

  // Initialize simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const anchorX = width / 2;
    const anchorY = physicsParams.anchorYOffset;

    const sim = new VerletRopeSimulation(anchorX, anchorY, physicsParams);
    simRef.current = sim;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.033, (time - lastTime) / 1000);
      lastTime = time;

      sim.step(dt);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render rope
        sim.renderRope(ctx);

        // Render charm at bottom
        const bottomPoint = sim.points[sim.points.length - 1];
        const angle = sim.getCharmAngle();

        ctx.save();
        ctx.translate(bottomPoint.x, bottomPoint.y);
        ctx.rotate(-angle);

        // Center charm visual
        const charmSize = 64;
        currentCharm.draw(ctx, charmSize, angle);

        // If hovered or dragged, draw subtle interactive aura
        if (sim.isDragging || isHoveringCharm) {
          ctx.beginPath();
          ctx.arc(0, 0, charmSize * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.restore();
      }

      // Telemetry update
      const currentTelemetry = sim.getTelemetry();
      setTelemetry(currentTelemetry);
      onFpsUpdate(currentTelemetry.fps);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [physicsParams.anchorYOffset, selectedCharmId, isHoveringCharm]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas || !simRef.current) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      const displayWidth = Math.round(rect.width);
      const displayHeight = isDesktopSimulator ? 480 : Math.max(480, Math.min(620, window.innerHeight - 240));

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      simRef.current.setAnchor(displayWidth / 2, physicsParams.anchorYOffset);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktopSimulator, physicsParams.anchorYOffset]);

  // Synchronize parameter changes
  useEffect(() => {
    if (simRef.current) {
      simRef.current.updateConfig(physicsParams);
    }
  }, [physicsParams]);

  // Pointer event helpers
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const isNearCharm = (x: number, y: number): boolean => {
    if (!simRef.current) return false;
    const bottom = simRef.current.points[simRef.current.points.length - 1];
    const dx = x - bottom.x;
    const dy = y - bottom.y;
    return Math.sqrt(dx * dx + dy * dy) <= 46;
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasCoords(e);
    if (!simRef.current) return;

    if (isNearCharm(x, y)) {
      simRef.current.startDrag(x, y);
      setIsHoveringCharm(true);
      setClickThroughNote(null);
    } else {
      // Clicked outside charm hitbox
      if (isDesktopSimulator) {
        setClickThroughNote(`Click passed through at (${Math.round(x)}, ${Math.round(y)}) to desktop background`);
        setTimeout(() => setClickThroughNote(null), 2500);
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasCoords(e);
    if (!simRef.current) return;

    if (simRef.current.isDragging) {
      simRef.current.updateDrag(x, y);
    } else {
      setIsHoveringCharm(isNearCharm(x, y));
    }
  };

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!simRef.current) return;
    let x = 0;
    let y = 0;
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        x = e.changedTouches[0].clientX - rect.left;
        y = e.changedTouches[0].clientY - rect.top;
      }
    } else if ('clientX' in e) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
    }
    simRef.current.endDrag(x, y);
  };

  // Impulse presets
  const triggerImpulse = (impulseX: number, impulseY: number = 0) => {
    if (!simRef.current) return;
    const bottom = simRef.current.points[simRef.current.points.length - 1];
    bottom.oldX -= impulseX;
    bottom.oldY -= impulseY;
  };

  const applyPreset = (type: 'calm' | 'feather' | 'storm' | 'elastic') => {
    switch (type) {
      case 'calm':
        setPhysicsParams({
          ...physicsParams,
          ropeLength: 280,
          gravity: 0.38,
          damping: 0.992,
          wind: 0.04,
          idleMovement: true
        });
        break;
      case 'feather':
        setPhysicsParams({
          ...physicsParams,
          ropeLength: 240,
          gravity: 0.16,
          damping: 0.996,
          wind: 0.08,
          idleMovement: true
        });
        break;
      case 'storm':
        setPhysicsParams({
          ...physicsParams,
          ropeLength: 320,
          gravity: 0.45,
          damping: 0.988,
          wind: 0.14,
          idleMovement: true
        });
        triggerImpulse(18, 5);
        break;
      case 'elastic':
        setPhysicsParams({
          ...physicsParams,
          ropeLength: 220,
          gravity: 0.70,
          damping: 0.995,
          wind: 0.02,
          idleMovement: false
        });
        break;
    }
  };

  return (
    <div className="w-full">
      {/* Simulation Stage */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden border transition-all duration-300 ${
          isDesktopSimulator 
            ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-amber-500/30 shadow-2xl'
            : 'bg-slate-950 border-slate-800 shadow-xl'
        }`}
      >
        {/* Top Screen Mounting Edge Bar */}
        <div className="absolute top-0 inset-x-0 h-8 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 z-20 flex items-center justify-between px-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="text-[11px] font-mono text-slate-400 ml-2">
              Top Screen Bezel • Anchor (X: Center, Y: 0)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${telemetry.state === 'dragging' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span className="capitalize">{telemetry.state}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {telemetry.angleDeg}°
            </div>
          </div>
        </div>

        {/* Desktop Simulator Visual Elements (Background windows behind charm) */}
        {isDesktopSimulator && (
          <div className="absolute inset-0 pointer-events-none opacity-40 flex flex-col justify-between p-6 pt-12">
            {/* Mock Code Window */}
            <div className="w-96 h-56 bg-slate-900/90 rounded-lg border border-slate-700/80 p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">~/projects/LuckyDangle/Rope.cs</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 space-y-1">
                <p><span className="text-purple-400">public void</span> <span className="text-blue-400">Step</span>(double dt)</p>
                <p className="pl-4 text-emerald-400">// Verlet Integration &amp; Constraints</p>
                <p className="pl-4">X += (X - OldX) * Damping;</p>
                <p className="pl-4">Y += (Y - OldY) * Damping + Gravity;</p>
              </div>
            </div>

            {/* Click-through badge indicator */}
            <div className="self-end bg-slate-900/80 border border-slate-700/80 rounded-lg p-3 max-w-xs text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                <MousePointer2 className="w-3.5 h-3.5" />
                <span>Selective Hit-Testing Active</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Clicks outside the charm pass through to underlying applications. Click anywhere to verify!
              </p>
            </div>
          </div>
        )}

        {/* Click Through Toast feedback */}
        {clickThroughNote && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium shadow-md backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            {clickThroughNote}
          </div>
        )}

        {/* The Live HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className={`block w-full touch-none select-none ${
            isHoveringCharm ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
        />

        {/* Interactive Overlay Bottom Helper Bar */}
        <div className="absolute bottom-3 inset-x-4 flex flex-wrap items-center justify-between gap-2 z-20 pointer-events-none">
          {/* Active Charm Badge */}
          <div className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-md">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: currentCharm.accentColor }} 
            />
            <div>
              <span className="text-xs font-bold text-slate-100 block leading-tight">
                {currentCharm.name}
              </span>
              <span className="text-[10px] text-slate-400 block leading-none">
                {currentCharm.culture}
              </span>
            </div>
          </div>

          {/* Quick Impulse Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl backdrop-blur-md">
            <button
              onClick={() => triggerImpulse(-12, 0)}
              title="Push Left"
              className="px-2.5 py-1 text-xs rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ← Swing
            </button>
            <button
              onClick={() => triggerImpulse(12, 0)}
              title="Push Right"
              className="px-2.5 py-1 text-xs rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Swing →
            </button>
            <button
              onClick={() => triggerImpulse(0, -18)}
              title="Flick Up"
              className="px-2.5 py-1 text-xs rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ↑ Toss
            </button>
            <button
              onClick={() => {
                if (simRef.current) {
                  simRef.current.initializeRope();
                }
              }}
              title="Reset to Neutral"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Charm Selector Carousel */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Choose Your Desktop Talisman
          </span>
          <span className="text-[11px] text-slate-400">
            Click or drag to dangle
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {CHARMS.map((charm) => {
            const isSelected = charm.id === selectedCharmId;
            return (
              <button
                key={charm.id}
                onClick={() => onSelectCharm(charm.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-blue-500 shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: charm.accentColor }} 
                  />
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    {charm.culture.split('/')[0].trim()}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-100 truncate">
                  {charm.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {charm.symbolism}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Physics & Environment Controls */}
      <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-slate-100 font-['Plus_Jakarta_Sans']">
              Physics &amp; Dynamics Configurator
            </h3>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Presets:</span>
            <button
              onClick={() => applyPreset('calm')}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              Zen Calm
            </button>
            <button
              onClick={() => applyPreset('feather')}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              Feather Breeze
            </button>
            <button
              onClick={() => applyPreset('storm')}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              Gusty Wind
            </button>
            <button
              onClick={() => applyPreset('elastic')}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
            >
              Heavy Cord
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Rope Length */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Rope Length</span>
              <span className="font-mono text-blue-400 font-semibold">{physicsParams.ropeLength} px</span>
            </div>
            <input
              type="range"
              min={140}
              max={440}
              step={10}
              value={physicsParams.ropeLength}
              onChange={(e) => setPhysicsParams({ ...physicsParams, ropeLength: Number(e.target.value) })}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Screen hang depth</span>
          </div>

          {/* Gravity */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Gravity Acceleration</span>
              <span className="font-mono text-blue-400 font-semibold">{physicsParams.gravity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.10}
              max={0.90}
              step={0.02}
              value={physicsParams.gravity}
              onChange={(e) => setPhysicsParams({ ...physicsParams, gravity: Number(e.target.value) })}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Downward pulling force</span>
          </div>

          {/* Air Damping */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Air Resistance (Damping)</span>
              <span className="font-mono text-blue-400 font-semibold">{physicsParams.damping.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={0.960}
              max={0.999}
              step={0.001}
              value={physicsParams.damping}
              onChange={(e) => setPhysicsParams({ ...physicsParams, damping: Number(e.target.value) })}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Settles pendulum swing</span>
          </div>

          {/* Wind Breeze */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Ambient Breeze</span>
              <span className="font-mono text-blue-400 font-semibold">{physicsParams.wind.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={0.15}
              step={0.01}
              value={physicsParams.wind}
              onChange={(e) => setPhysicsParams({ ...physicsParams, wind: Number(e.target.value) })}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
            />
            <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={physicsParams.idleMovement}
                onChange={(e) => setPhysicsParams({ ...physicsParams, idleMovement: e.target.checked })}
                className="accent-blue-500 rounded"
              />
              <span className="text-[10px] text-slate-300">Natural harmonic breeze</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
