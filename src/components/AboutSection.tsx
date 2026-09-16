import React from 'react';
import { Heart, Sparkles, Shield, Feather, Wind, Monitor, Coffee } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto space-y-12">
      {/* Hero statement */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" />
          Mindful Desktop Companion
        </div>
        <h2 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
          Bring a Little Luck to Your Desktop
        </h2>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          In a world of constant notifications, high-pressure deadlines, and cluttered taskbars, Lucky Dangle brings the quiet charm of a lucky talisman hanging from your rear-view mirror to your computer screen.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Feather className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">Non-Intrusive by Design</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Clicks outside the charm pass straight through to your browser, code editor, or spreadsheet. It never blocks your work.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Wind className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">Gentle Ambient Physics</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Naturally sways with soft simulated atmospheric breezes. When you feel restless, grab and flick it for a quick calming tactile interaction.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">Zero Battery Drain</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Built without bloated webview wrappers or heavy 3D frameworks. Uses lightweight native WPF vector drawing running under 1% CPU.
          </p>
        </div>
      </div>

      {/* Cultural Traditions Story */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Across Millennia and Cultures
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          From ancient Anatolian Nazar glass beads protecting travelers, to Celtic four-leaf clover lore, to Indian Nimbu Mirchi hung on shop doorways, to Japanese Maneki-neko cats waving good fortune into storefronts — humans have long cherished physical tokens that anchor positive intention and peace of mind. Lucky Dangle translates this comforting tradition into the modern digital workspace.
        </p>
      </div>
    </div>
  );
};
