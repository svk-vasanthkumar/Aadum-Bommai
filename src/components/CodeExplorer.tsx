import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, FolderGit2 } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

const CSHARP_FILES: CodeFile[] = [
  {
    name: 'Rope.cs',
    path: 'Physics/Rope.cs',
    language: 'csharp',
    description: 'Verlet integration rope simulation with multi-segment constraint relaxation loop.',
    code: `using System;
using System.Collections.Generic;

namespace LuckyDangle.Physics;

public class Rope
{
    private readonly List<RopePoint> _points = new();
    private double _segmentLength;
    private double _timeAccumulator;

    public IReadOnlyList<RopePoint> Points => _points;
    public RopePoint Anchor => _points[0];
    public RopePoint CharmAttachmentPoint => _points[^1];

    public double Gravity { get; set; } = PhysicsConstants.DefaultGravity;
    public double Damping { get; set; } = PhysicsConstants.DefaultDamping;
    public double WindIntensity { get; set; } = PhysicsConstants.DefaultWind;
    public bool EnableIdleMovement { get; set; } = true;
    public int ConstraintIterations { get; set; } = PhysicsConstants.ConstraintIterations;
    public bool IsBeingDragged { get; private set; }

    public Rope(double anchorX, double anchorY, double totalLength, int segmentCount = 12)
    {
        InitializeRope(anchorX, anchorY, totalLength, segmentCount);
    }

    public void InitializeRope(double anchorX, double anchorY, double totalLength, int segmentCount)
    {
        _points.Clear();
        int count = Math.Max(4, segmentCount);
        _segmentLength = totalLength / count;

        for (int i = 0; i <= count; i++)
        {
            double y = anchorY + (i * _segmentLength);
            bool isPinned = (i == 0);
            _points.Add(new RopePoint(anchorX, y, isPinned));
        }
    }

    public void Step(double dt)
    {
        _timeAccumulator += dt;

        // Compound harmonic ambient breeze
        double breezeForce = 0.0;
        if (EnableIdleMovement && !IsBeingDragged)
        {
            double t = _timeAccumulator * PhysicsConstants.IdleNoiseSpeed;
            breezeForce = (Math.Sin(t * 1.3) * 0.5 + Math.Sin(t * 2.7) * 0.3 + Math.Cos(t * 0.7) * 0.2) 
                          * WindIntensity * PhysicsConstants.IdleBreezeForce;
        }

        // 1. Verlet integration
        for (int i = 1; i < _points.Count; i++)
        {
            if (i == _points.Count - 1 && IsBeingDragged) continue;

            double pointBreeze = breezeForce * (1.0 + (double)i / _points.Count);
            _points[i].Update(Damping, pointBreeze, Gravity);
        }

        // 2. Distance constraint relaxation
        for (int iter = 0; iter < ConstraintIterations; iter++)
        {
            for (int i = 0; i < _points.Count - 1; i++)
            {
                RopePoint p1 = _points[i];
                RopePoint p2 = _points[i + 1];

                double dx = p2.X - p1.X;
                double dy = p2.Y - p1.Y;
                double dist = Math.Sqrt(dx * dx + dy * dy);
                if (dist < 0.0001) continue;

                double diff = (dist - _segmentLength) / dist;

                if (p1.IsPinned)
                {
                    if (!(i + 1 == _points.Count - 1 && IsBeingDragged))
                    {
                        p2.X -= dx * diff;
                        p2.Y -= dy * diff;
                    }
                }
                else if (i + 1 == _points.Count - 1 && IsBeingDragged)
                {
                    p1.X += dx * diff;
                    p1.Y += dy * diff;
                }
                else
                {
                    p1.X += dx * 0.5 * diff;
                    p1.Y += dy * 0.5 * diff;
                    p2.X -= dx * 0.5 * diff;
                    p2.Y -= dy * 0.5 * diff;
                }
            }
        }
    }
}`
  },
  {
    name: 'MainWindow.xaml.cs',
    path: 'MainWindow.xaml.cs',
    language: 'csharp',
    description: 'Win32 WM_NCHITTEST click-through hook, DrawingVisual rope rendering, and drag capture.',
    code: `using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using LuckyDangle.Interaction;
using LuckyDangle.Physics;
using LuckyDangle.Rendering;
using LuckyDangle.Services;

namespace LuckyDangle;

public partial class MainWindow : Window
{
    private const int WM_NCHITTEST = 0x0084;
    private const int HTTRANSPARENT = -1;

    private readonly Rope _rope;
    private readonly PhysicsService _physicsService;
    private readonly RopeRenderer _ropeRenderer;
    private readonly CharmInteraction _interaction;
    private readonly SettingsService _settingsService;

    public MainWindow(CharmService charmService, SettingsService settingsService)
    {
        InitializeComponent();
        _settingsService = settingsService;

        _rope = new Rope(170.0, 0.0, _settingsService.CurrentSettings.RopeLength);
        _ropeRenderer = new RopeRenderer();
        _interaction = new CharmInteraction(_rope);
        _physicsService = new PhysicsService(_rope);

        Loaded += (s, e) =>
        {
            // Install Win32 window message hook for click-through
            var hwnd = new WindowInteropHelper(this).Handle;
            HwndSource.FromHwnd(hwnd)?.AddHook(WndProc);
            _physicsService.Start();
        };
    }

    /// <summary>
    /// Selective Click-Through: Only claims clicks when cursor is inside the charm bounding box!
    /// </summary>
    private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
    {
        if (msg == WM_NCHITTEST)
        {
            if (_interaction.IsDragging) return IntPtr.Zero;

            int screenX = unchecked((short)(long)lParam);
            int screenY = unchecked((short)((long)lParam >> 16));
            var cursorPoint = PointFromScreen(new Point(screenX, screenY));

            var charmRect = new Rect(CharmTranslate.X, CharmTranslate.Y, CharmContainer.ActualWidth, CharmContainer.ActualHeight);
            charmRect.Inflate(8, 8);

            // Outside charm -> pass through to desktop underneath
            if (!charmRect.Contains(cursorPoint))
            {
                handled = true;
                return new IntPtr(HTTRANSPARENT);
            }
        }
        return IntPtr.Zero;
    }
}`
  },
  {
    name: 'SettingsService.cs',
    path: 'Services/SettingsService.cs',
    language: 'csharp',
    description: 'Atomic JSON reading/writing in %AppData% and Windows Startup registry key integration.',
    code: `using System;
using System.IO;
using System.Text.Json;
using LuckyDangle.Models;
using Microsoft.Win32;

namespace LuckyDangle.Services;

public class SettingsService
{
    private const string AppName = "LuckyDangle";
    private const string SettingsFileName = "settings.json";
    private const string StartupRegistryKey = @"Software\\Microsoft\\Windows\\CurrentVersion\\Run";

    private readonly string _settingsFolder;
    private readonly string _settingsFilePath;

    public AppSettings CurrentSettings { get; private set; }

    public SettingsService()
    {
        _settingsFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), AppName);
        _settingsFilePath = Path.Combine(_settingsFolder, SettingsFileName);
        CurrentSettings = LoadSettings();
    }

    public void SaveSettings(AppSettings settings)
    {
        settings.ClampValues();
        CurrentSettings = settings;

        Directory.CreateDirectory(_settingsFolder);
        string json = JsonSerializer.Serialize(settings, new JsonSerializerOptions { WriteIndented = true });

        // Safe atomic write
        string tempFile = _settingsFilePath + ".tmp";
        File.WriteAllText(tempFile, json);
        File.Move(tempFile, _settingsFilePath, overwrite: true);

        SetStartup(settings.StartWithWindows);
    }

    public void SetStartup(bool enable)
    {
        using var key = Registry.CurrentUser.OpenSubKey(StartupRegistryKey, writable: true);
        if (key == null) return;
        string? exePath = Environment.ProcessPath;
        if (string.IsNullOrEmpty(exePath)) return;

        if (enable)
            key.SetValue(AppName, $"\\"{exePath}\\"");
        else
            key.DeleteValue(AppName, throwOnMissingValue: false);
    }
}`
  },
  {
    name: 'LuckyDangle.csproj',
    path: 'LuckyDangle.csproj',
    language: 'xml',
    description: '.NET 8 WPF project manifest with single-file publishing and Windows Forms integration for NotifyIcon.',
    code: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UseWPF>true</UseWPF>
    <UseWindowsForms>true</UseWindowsForms>
    <ApplicationIcon>Resources\\app.ico</ApplicationIcon>
    <AssemblyName>LuckyDangle</AssemblyName>
    <RootNamespace>LuckyDangle</RootNamespace>
    <Version>1.0.0</Version>
    <PublishSingleFile>true</PublishSingleFile>
  </PropertyGroup>

  <ItemGroup>
    <ApplicationManifest Include="app.manifest" />
  </ItemGroup>

</Project>`
  }
];

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(CSHARP_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <Code2 className="w-3.5 h-3.5" />
          Clean C# &amp; WPF Codebase
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          Inspect the Windows Solution
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Browse the actual source code files running in the native Windows desktop companion application.
        </p>
      </div>

      {/* Code Browser Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top File Tab Selector */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2">
            {CSHARP_FILES.map((file) => {
              const isCurrent = file.name === selectedFile.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                    isCurrent
                      ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors shrink-0 ml-4"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* File Description Bar */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px] truncate">
            Path: <span className="text-slate-200 font-semibold">LuckyDangle/{selectedFile.path}</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">
            {selectedFile.description}
          </span>
        </div>

        {/* Code Content View */}
        <div className="p-5 font-mono text-xs text-slate-200 bg-slate-950 overflow-x-auto leading-relaxed max-h-[500px]">
          <pre>
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
