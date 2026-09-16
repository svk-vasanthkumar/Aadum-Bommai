import React, { useRef, useEffect } from 'react';
import { CHARMS } from '../data/charms';
import { CharmId, CharmInfo } from '../types';
import { Sparkles, Shield, Compass, Heart, Award } from 'lucide-react';

interface CharmShowcaseProps {
  selectedCharmId: CharmId;
  onSelectCharm: (id: CharmId) => void;
}

// Mini interactive preview canvas for an individual charm card
const MiniCharmCard: React.FC<{
  charm: CharmInfo;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ charm, isSelected, onSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.03;
      // Gentle natural pendulum sway
      const naturalSway = Math.sin(time * 1.6) * 0.08;
      angleRef.current += angularVelocityRef.current;
      angularVelocityRef.current *= 0.94; // damping

      const totalAngle = angleRef.current + naturalSway;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = 20;

      // Draw top small cord
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top knot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#D97706';
      ctx.fill();

      // Charm centered
      ctx.translate(cx, cy + 42);
      ctx.rotate(totalAngle);
      charm.draw(ctx, 52, totalAngle);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [charm]);

  const handleNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    angularVelocityRef.current = (Math.random() > 0.5 ? 1 : -1) * 0.35;
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl p-5 border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
        isSelected
          ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50 shadow-xl shadow-blue-500/10'
          : 'bg-slate-900/40 border-slate-800/90 hover:bg-slate-900/80 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <span 
            className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border"
            style={{ 
              borderColor: `${charm.accentColor}40`, 
              backgroundColor: `${charm.accentColor}15`,
              color: charm.accentColor 
            }}
          >
            {charm.culture}
          </span>
          <button
            onClick={handleNudge}
            title="Nudge to swing"
            className="text-slate-500 hover:text-amber-400 text-xs p-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Preview Canvas */}
        <div className="flex items-center justify-center my-2 h-28 bg-slate-950/40 rounded-xl border border-slate-800/50 relative overflow-hidden group-hover:bg-slate-950/60 transition-colors">
          <canvas
            ref={canvasRef}
            width={160}
            height={112}
            className="block"
          />
        </div>

        <h3 className="text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans'] mt-2">
          {charm.name}
        </h3>

        <p className="text-xs font-medium text-emerald-400 mt-0.5">
          {charm.symbolism}
        </p>

        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
          {charm.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 italic text-[11px] truncate mr-2">
          "{charm.tagline}"
        </span>
        <span className={`text-[11px] font-semibold ${isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
          {isSelected ? 'Active Charm ✓' : 'Select'}
        </span>
      </div>
    </div>
  );
};

export const CharmShowcase: React.FC<CharmShowcaseProps> = ({
  selectedCharmId,
  onSelectCharm
}) => {
  return (
    <div className="py-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5" />
          Authentic Cultural Talismans
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          8 Traditional Charms for Your Desktop
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Each charm is crafted with original vector geometry, authentic cultural symbolism, and calibrated physical mass. Tap any card to test its swing physics.
        </p>
      </div>

      {/* Grid of 8 Charms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {CHARMS.map((charm) => (
          <MiniCharmCard
            key={charm.id}
            charm={charm}
            isSelected={charm.id === selectedCharmId}
            onSelect={() => onSelectCharm(charm.id)}
          />
        ))}
      </div>
    </div>
  );
};
