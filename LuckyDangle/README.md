# Lucky Dangle 🍀

> **"Bring a little luck to your desktop."**
> A lightweight Windows desktop companion application featuring physics-simulated lucky charms hanging naturally from the top of your screen.

---

## Overview

**Lucky Dangle** is a calm, minimal desktop utility inspired by traditional charms hanging from rear-view mirrors and door lintels. It hangs gracefully from the very top of your primary display, gently swaying with ambient environmental breeze or responding to mouse interactions (grab, drag, and flick).

When you are not interacting with the charm, all clicks pass seamlessly through the transparent window to whatever application is beneath, ensuring zero disruption to your daily workflow.

---

## Key Features

- **Verlet Integration Rope Physics**:
  - Multi-segment rope chain with iterative distance constraint solving.
  - Natural pendulum swing with smooth velocity preservation and damping.
  - Flick velocity tracking: fling the charm across the screen and watch it dynamically whip and settle.
  - Zero heap allocation per frame inside the 60 FPS physics loop.
- **Selective Win32 Click-Through**:
  - Transparent borderless desktop overlay window (`WS_EX_TRANSPARENT` via `WM_NCHITTEST`).
  - Seamless pass-through when clicking anywhere on the screen except the charm hitbox.
  - Direct, responsive mouse capture when clicking or dragging the charm.
- **Cultural Lucky Charms (Original Vector Art)**:
  - **Nazar Evil Eye**: Mediterranean talisman warding off negative glances and envy.
  - **Maneki-neko (Lucky Cat)**: Japanese beckoning cat inviting good fortune and prosperity.
  - **Four Leaf Clover**: Celtic emblem of faith, hope, love, and luck.
  - **Golden Feng Shui Coin**: Traditional symbol of wealth, abundance, and balance.
  - **Hamsa Hand of Miriam**: Ancient symbol of spiritual protection and strength.
  - **Nimbu Mirchi**: Traditional Indian string of fresh lemon and green chilis warding off discord.
  - **Daruma Doll**: Japanese symbol of perseverance and steadfast goal attainment.
  - **Golden Acorn**: Norse symbol of life, longevity, and endurance.
- **Ambient Idle Breeze**:
  - Compound harmonic breeze forces produce subtle, natural atmospheric movement without mechanical repetition.
  - Charms naturally settle to equilibrium over time.
- **System Tray Companion**:
  - Lives quietly in your Windows system tray.
  - Quick menu for switching charms, pausing simulation, changing screen position, and accessing settings.
  - Optional Windows startup integration via CurrentUser registry key.
- **High-DPI & Multi-Monitor Support**:
  - Native `PerMonitorV2` DPI scaling awareness.
  - Supports dual-monitor setups and arbitrary display resolutions.
- **Ultra-Lightweight & Efficient**:
  - Designed for modest hardware (Intel i5, 8GB RAM, integrated graphics).
  - Sub-1% CPU usage when idling; zero continuously growing memory allocations.

---

## Project Structure

```text
LuckyDangle/
├── LuckyDangle.csproj           # .NET 8.0-windows WPF Project Manifest
├── app.manifest                 # Per-Monitor V2 DPI & Windows 10/11 compatibility
├── App.xaml                     # Application entry point & resource definitions
├── App.xaml.cs                  # Mutex single-instance guard & exception safety
│
├── MainWindow.xaml              # Transparent, borderless topmost desktop canvas
├── MainWindow.xaml.cs           # Win32 WM_NCHITTEST click-through hook & rendering
│
├── Physics/
│   ├── RopePoint.cs             # Discrete mass point with Verlet position tracking
│   ├── PhysicsConstants.cs      # Gravity, damping, constraint iterations & limits
│   └── Rope.cs                  # Verlet integration solver & ambient breeze engine
│
├── Models/
│   ├── Charm.cs                 # Charm metadata, cultural origins, and vector paths
│   └── AppSettings.cs           # Serializable configuration with range clamping
│
├── Services/
│   ├── PhysicsService.cs        # 60 FPS CompositionTarget.Rendering loop
│   ├── CharmService.cs          # Registry of supported cultural charms
│   ├── SettingsService.cs       # Atomic JSON settings & Windows startup registry
│   └── TrayService.cs           # Windows NotifyIcon context menu
│
├── Rendering/
│   └── RopeRenderer.cs          # Cached StreamGeometry rope drawing with zero allocations
│
├── Interaction/
│   └── CharmInteraction.cs      # Mouse grab, drag tracking, and flick velocity calculator
│
└── UI/
    ├── SettingsWindow.xaml      # Clean, dark-mode settings dialog
    └── SettingsWindow.xaml.cs   # Dynamic parameter sliders and charm preview
```

---

## Build & Run Instructions

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or higher.
- Windows 10 / 11 (64-bit).

### 1. Quick Launch (Development)
```bash
cd LuckyDangle
dotnet run
```

### 2. Standard Release Build
```bash
dotnet build -c Release
```

### 3. Single-File Standalone Publish (Distribution)
To publish a single, self-contained executable that end-users can run without installing .NET:
```bash
dotnet publish -c Release -r win-x64 --self-contained false -p:PublishSingleFile=true
```
Or fully self-contained (includes runtime):
```bash
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=false
```
The resulting executable will be located in:
`bin/Release/net8.0-windows/win-x64/publish/LuckyDangle.exe`

---

## Settings Configuration

Settings are saved automatically to:
`%AppData%\LuckyDangle\settings.json`

Example:
```json
{
  "Charm": "EvilEye",
  "RopeLength": 280.0,
  "Gravity": 0.38,
  "Damping": 0.992,
  "Wind": 0.04,
  "EnableIdleMovement": true,
  "Position": "TopCenter",
  "StartWithWindows": false
}
```

---

## Architecture Highlights

1. **Verlet Integration**:
   $$x_{t+\Delta t} = x_t + (x_t - x_{t-\Delta t}) \cdot \text{damping} + a \cdot \Delta t^2$$
   By keeping track of `OldX` and `OldY`, velocity is implicitly preserved without storing momentum vectors, resulting in unconditionally stable constraint resolution even under erratic mouse flicks.

2. **Win32 Click-Through (`WM_NCHITTEST`)**:
   Rather than placing a global mouse hook that trips anti-cheat or antivirus software, the window intercepts the standard Windows `WM_NCHITTEST` query. If the cursor is within the charm container's bounding rectangle (plus 8px padding), the window claims the hit. Otherwise, it returns `HTTRANSPARENT` (`-1`), instructing Windows to dispatch the click to whatever window sits beneath.

3. **Zero-Allocation Rendering**:
   Every frame uses pre-allocated, frozen brushes, pens, and an internal `DrawingVisual` connected to a custom `VisualHost`, avoiding WPF DependencyObject instantiation in the render pipeline.
