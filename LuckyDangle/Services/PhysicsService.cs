using System;
using System.Diagnostics;
using System.Windows.Media;
using LuckyDangle.Physics;

namespace LuckyDangle.Services;

/// <summary>
/// Orchestrates the 60 FPS physics simulation update loop using WPF CompositionTarget.Rendering.
/// Maintains constant delta time and avoids per-frame garbage collector pressure.
/// </summary>
public class PhysicsService : IDisposable
{
    private readonly Rope _rope;
    private readonly Stopwatch _stopwatch = new();
    private TimeSpan _lastRenderingTime = TimeSpan.Zero;
    private bool _isRunning;
    private bool _disposed;

    public event Action? OnPhysicsStep;

    public bool IsRunning => _isRunning;

    public PhysicsService(Rope rope)
    {
        _rope = rope;
    }

    public void Start()
    {
        if (_isRunning) return;
        _isRunning = true;
        _stopwatch.Restart();
        _lastRenderingTime = TimeSpan.Zero;
        CompositionTarget.Rendering += OnCompositionRendering;
    }

    public void Stop()
    {
        if (!_isRunning) return;
        _isRunning = false;
        _stopwatch.Stop();
        CompositionTarget.Rendering -= OnCompositionRendering;
    }

    public void TogglePause()
    {
        if (_isRunning)
            Stop();
        else
            Start();
    }

    private void OnCompositionRendering(object? sender, EventArgs e)
    {
        if (!_isRunning) return;

        TimeSpan current = _stopwatch.Elapsed;
        double dt = (current - _lastRenderingTime).TotalSeconds;
        _lastRenderingTime = current;

        // Clamp delta time to prevent physics explosion after window freeze or debugger pause
        if (dt > 0.05) dt = 0.0166;
        if (dt < 0.001) dt = 0.0166;

        _rope.Step(dt);
        OnPhysicsStep?.Invoke();
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        Stop();
    }
}
