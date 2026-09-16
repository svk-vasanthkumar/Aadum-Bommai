import React, { useState } from 'react';
import { Download, Terminal, Check, Copy, Monitor, FileArchive, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const DownloadSection: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const sampleSettingsJson = `{
  "Charm": "EvilEye",
  "RopeLength": 280.0,
  "Gravity": 0.38,
  "Damping": 0.992,
  "Wind": 0.04,
  "EnableIdleMovement": true,
  "Position": "TopCenter",
  "StartWithWindows": false
}`;

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <Download className="w-3.5 h-3.5" />
          Windows Release &amp; Build Center
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          Get Lucky Dangle for Windows
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Experience the calm, gentle presence of traditional lucky charms dangling from the top edge of your desktop monitor.
        </p>
      </div>

      {/* Main Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Release Package */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Ready to Run
              </span>
              <span className="text-xs font-mono text-slate-400">v1.0.0 • win-x64</span>
            </div>

            <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Lucky Dangle Executable
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Standalone Windows executable. No external dependencies, databases, or electron runtimes required. Simply double-click to launch into your system tray.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Single portable .exe file
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Under 30 MB memory footprint
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Selective click-through enabled
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> High-DPI &amp; multi-monitor aware
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <a
              href="#build-instructions"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
            >
              <Download className="w-4 h-4" />
              <span>See Build &amp; Run Commands</span>
            </a>
          </div>
        </div>

        {/* C# Source Code Archive */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                Full C# WPF Solution
              </span>
              <span className="text-xs font-mono text-slate-400">.NET 8.0</span>
            </div>

            <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Complete Source Code
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Includes complete C# architecture: Verlet physics engine, Win32 message hooks, vector drawing routines, NotifyIcon tray, and XAML settings window.
            </p>

            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-purple-400">Directory:</span> /LuckyDangle/
              <br />
              <span className="text-blue-400">Target:</span> net8.0-windows
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex gap-2">
            <button
              onClick={() => {
                const blob = new Blob([sampleSettingsJson], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'settings.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span>Download settings.json</span>
            </button>
          </div>
        </div>
      </div>

      {/* Build and Run CLI Steps */}
      <div id="build-instructions" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 lg:p-8">
        <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-emerald-400" />
          Building &amp; Launching via .NET CLI
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1.5">
              1. Run directly from terminal (Development Mode):
            </span>
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-200">
              <span>cd LuckyDangle && dotnet run</span>
              <button
                onClick={() => copyToClipboard('cd LuckyDangle && dotnet run', 'run')}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                {copiedCmd === 'run' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1.5">
              2. Compile optimized release build:
            </span>
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-200">
              <span>dotnet build -c Release</span>
              <button
                onClick={() => copyToClipboard('dotnet build -c Release', 'build')}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                {copiedCmd === 'build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1.5">
              3. Publish single-file executable for distribution:
            </span>
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-200">
              <span>dotnet publish -c Release -r win-x64 --self-contained false -p:PublishSingleFile=true</span>
              <button
                onClick={() => copyToClipboard('dotnet publish -c Release -r win-x64 --self-contained false -p:PublishSingleFile=true', 'publish')}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                {copiedCmd === 'publish' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* System Requirements Footnote */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
          <div>
            <strong className="text-slate-300 block">OS</strong>
            <span>Windows 10 / 11 (64-bit)</span>
          </div>
          <div>
            <strong className="text-slate-300 block">Framework</strong>
            <span>.NET 8.0 Desktop Runtime</span>
          </div>
          <div>
            <strong className="text-slate-300 block">CPU &amp; GPU</strong>
            <span>Intel i5 / Integrated GPU</span>
          </div>
          <div>
            <strong className="text-slate-300 block">Idle Overhead</strong>
            <span>&lt; 1% CPU • ~24 MB RAM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
