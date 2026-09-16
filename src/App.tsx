import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LiveDemo } from './components/LiveDemo';
import { CharmShowcase } from './components/CharmShowcase';
import { ArchitectureView } from './components/ArchitectureView';
import { CodeExplorer } from './components/CodeExplorer';
import { DownloadSection } from './components/DownloadSection';
import { AboutSection } from './components/AboutSection';
import { CharmId } from './types';
import { Sparkles, Download, Monitor, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('demo');
  const [isDesktopSimulator, setIsDesktopSimulator] = useState<boolean>(false);
  const [selectedCharmId, setSelectedCharmId] = useState<CharmId>('evil-eye');
  const [fps, setFps] = useState<number>(60);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDesktopSimulator={isDesktopSimulator}
        setIsDesktopSimulator={setIsDesktopSimulator}
        fps={fps}
      />

      {/* Hero Header */}
      <div className="pt-8 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400 mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Windows Desktop Companion &amp; Interactive Physics</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2 font-['Plus_Jakarta_Sans']">
          Lucky Dangle
        </h1>
        
        <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto">
          "Bring a little luck to your desktop."
        </p>

        <p className="text-xs text-slate-400 max-w-xl mx-auto mt-1 leading-relaxed">
          A calm, minimal talisman hanging from your screen's top bezel. Naturally swings with real Verlet physics, responds to mouse flicks, and remains completely click-through.
        </p>
      </div>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'demo' && (
          <div className="space-y-12">
            <LiveDemo
              isDesktopSimulator={isDesktopSimulator}
              onFpsUpdate={setFps}
              selectedCharmId={selectedCharmId}
              onSelectCharm={setSelectedCharmId}
            />
            <CharmShowcase
              selectedCharmId={selectedCharmId}
              onSelectCharm={setSelectedCharmId}
            />
            <ArchitectureView />
            <DownloadSection />
          </div>
        )}

        {activeTab === 'charms' && (
          <CharmShowcase
            selectedCharmId={selectedCharmId}
            onSelectCharm={setSelectedCharmId}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}

        {activeTab === 'code' && (
          <CodeExplorer />
        )}

        {activeTab === 'download' && (
          <DownloadSection />
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">Lucky Dangle</span>
            <span>•</span>
            <span>C# WPF &amp; Verlet Physics Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('code')}
              className="hover:text-slate-200 transition-colors"
            >
              C# Source Code
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              className="hover:text-slate-200 transition-colors"
            >
              Architecture Guide
            </button>
            <button 
              onClick={() => setActiveTab('download')}
              className="hover:text-slate-200 transition-colors"
            >
              Build Commands
            </button>
          </div>

          <div className="text-slate-400 text-[11px]">
            Designed with simplicity, serenity &amp; craft.
          </div>
        </div>
      </footer>
    </div>
  );
}
