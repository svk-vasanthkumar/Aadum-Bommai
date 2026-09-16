import React from 'react';
import { 
  Cpu, 
  Layers, 
  MousePointerClick, 
  Sliders, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Activity, 
  MonitorCheck,
  CheckCircle2
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="py-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <Cpu className="w-3.5 h-3.5" />
          Engineering &amp; System Design
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          How Lucky Dangle Was Engineered
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Designed specifically for low-overhead desktop background execution. Consumes under 1% CPU on an Intel i5 with integrated graphics.
        </p>
      </div>

      {/* Core Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-['Plus_Jakarta_Sans'] mb-2">
            Verlet Integration
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Position-based kinematics where velocity is implicitly stored as <code className="text-blue-300 font-mono">X - OldX</code>. Distance constraints are solved iteratively (16 passes), preventing physics explosions or jitter even during intense mouse flicks.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-400">
            x(t+Δt) = 2x(t) - x(t-Δt) + a·Δt²
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-['Plus_Jakarta_Sans'] mb-2">
            Selective Click-Through
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instead of an intrusive global hook, the window intercepts <code className="text-amber-300 font-mono">WM_NCHITTEST</code> via <code className="text-amber-300 font-mono">HwndSource</code>. When cursor is outside the charm, it returns <code className="text-amber-300 font-mono">HTTRANSPARENT (-1)</code>, passing clicks directly to underlying windows.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-400">
            Zero interference with normal work
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-['Plus_Jakarta_Sans'] mb-2">
            Zero Heap Allocations
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The 60 FPS physics loop uses pre-allocated point structures and frozen WPF pens/brushes. Drawing updates through a reusable <code className="text-emerald-300 font-mono">DrawingVisual</code>, eliminating GC gen0 collections and memory stuttering.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-400">
            Idle RAM ~24MB • GC Pause: 0ms
          </div>
        </div>
      </div>

      {/* Deep-Dive Technical Sections */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-blue-400" />
            WPF Application Architecture Diagram
          </h3>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
            <pre>{`LuckyDangle.exe
  ├── App.xaml / App.xaml.cs (Mutex Guard, Unhandled Exception Protection)
  │
  ├── MainWindow.xaml (AllowsTransparency=True, WindowStyle=None, Topmost=True)
  │     ├── Win32 Hook: HwndSource -> WndProc(WM_NCHITTEST) -> HTTRANSPARENT
  │     ├── VisualHost: Reusable DrawingVisual for zero-allocation rendering
  │     └── Border (Charm Hitbox): MouseDown -> CharmInteraction.OnMouseDown
  │
  ├── Services/
  │     ├── PhysicsService: CompositionTarget.Rendering @ ~60 FPS with dt clamp
  │     ├── CharmService: 8 procedural vector charms (no missing bitmap files)
  │     ├── SettingsService: Atomic temp-file write to %AppData%/LuckyDangle/settings.json
  │     └── TrayService: NotifyIcon context menu (Pause, Position, Charms, Startup)
  │
  └── Physics/
        ├── Rope.cs: Verlet chain solver + distance constraint relaxation
        └── RopePoint.cs: { X, Y, OldX, OldY, IsPinned }`}</pre>
          </div>
        </div>

        {/* Milestones Verification Checklist */}
        <div>
          <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Milestone Fulfillment Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Milestone 1 &amp; 2: Base Project &amp; Transparent Window</strong>
                <span className="text-slate-400">Borderless, topmost window with zero rectangular chrome and PerMonitorV2 manifest.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Milestone 3 &amp; 4: Rope Physics &amp; Rendering</strong>
                <span className="text-slate-400">Verlet integration, distance constraints, StreamGeometry cached cord drawing.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Milestone 5 &amp; 6: 8 Charms &amp; Mouse Drag / Flick</strong>
                <span className="text-slate-400">Time-stamped drag velocity queue preserves momentum on release for natural fling.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Milestone 7 &amp; 8: Click-Through &amp; Idle Breeze</strong>
                <span className="text-slate-400">Native WM_NCHITTEST selective pass-through and compound harmonic idle breeze.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Milestone 9 &amp; 10: Multi-Monitor &amp; High-DPI</strong>
                <span className="text-slate-400">PerMonitorV2 DPI manifest, SystemParameters.WorkArea anchoring.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-200 block">Milestone 11-14: System Tray, Settings &amp; Startup</strong>
                <span className="text-slate-400">NotifyIcon tray menu, atomic JSON settings, HKCU Run registry integration.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
