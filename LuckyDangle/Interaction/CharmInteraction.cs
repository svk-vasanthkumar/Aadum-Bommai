using System;
using System.Collections.Generic;
using System.Windows;
using LuckyDangle.Physics;

namespace LuckyDangle.Interaction;

/// <summary>
/// Handles mouse grab, drag, flick velocity tracking, and release physics for the dangling charm.
/// Samples recent mouse positions to compute genuine flick vectors rather than a single-frame delta.
/// </summary>
public class CharmInteraction
{
    private readonly Rope _rope;
    private readonly Queue<(Point pos, DateTime time)> _recentMouseSamples = new();
    private const int MaxSamples = 6;
    private const double MaxSampleAgeMs = 120.0;

    public bool IsDragging => _rope.IsBeingDragged;

    public event Action? OnDragStarted;
    public event Action? OnDragEnded;

    public CharmInteraction(Rope rope)
    {
        _rope = rope;
    }

    public void OnMouseDown(Point mousePos)
    {
        _recentMouseSamples.Clear();
        _recentMouseSamples.Enqueue((mousePos, DateTime.UtcNow));
        _rope.StartDrag(mousePos.X, mousePos.Y);
        OnDragStarted?.Invoke();
    }

    public void OnMouseMove(Point mousePos)
    {
        if (!_rope.IsBeingDragged) return;

        DateTime now = DateTime.UtcNow;
        _recentMouseSamples.Enqueue((mousePos, now));

        // Trim old samples
        while (_recentMouseSamples.Count > MaxSamples ||
               (_recentMouseSamples.Count > 2 && (now - _recentMouseSamples.Peek().time).TotalMilliseconds > MaxSampleAgeMs))
        {
            _recentMouseSamples.Dequeue();
        }

        _rope.UpdateDrag(mousePos.X, mousePos.Y);
    }

    public void OnMouseUp(Point mousePos)
    {
        if (!_rope.IsBeingDragged) return;

        DateTime now = DateTime.UtcNow;
        _recentMouseSamples.Enqueue((mousePos, now));

        double vx = 0;
        double vy = 0;

        if (_recentMouseSamples.Count >= 2)
        {
            var oldest = _recentMouseSamples.Peek();
            var newest = (mousePos, now);
            double dt = (newest.now - oldest.time).TotalSeconds;

            if (dt > 0.005)
            {
                // Velocity in pixels per frame equivalent (~60fps)
                vx = ((newest.mousePos.X - oldest.pos.X) / dt) * 0.0166;
                vy = ((newest.mousePos.Y - oldest.pos.Y) / dt) * 0.0166;
            }
        }

        _recentMouseSamples.Clear();
        _rope.EndDrag(vx, vy);
        OnDragEnded?.Invoke();
    }
}
