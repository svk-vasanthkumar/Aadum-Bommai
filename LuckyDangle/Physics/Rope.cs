using System;
using System.Collections.Generic;

namespace LuckyDangle.Physics;

/// <summary>
/// Verlet integration rope simulation with multi-segment distance constraint solving.
/// Guarantees zero allocation per update frame to ensure 60 FPS on integrated GPUs.
/// </summary>
public class Rope
{
    private readonly List<RopePoint> _points = new();
    private double _segmentLength;
    private double _timeAccumulator;
    private readonly Random _random = new();

    public IReadOnlyList<RopePoint> Points => _points;
    public RopePoint Anchor => _points[0];
    public RopePoint CharmAttachmentPoint => _points[^1];

    public double Gravity { get; set; } = PhysicsConstants.DefaultGravity;
    public double Damping { get; set; } = PhysicsConstants.DefaultDamping;
    public double WindIntensity { get; set; } = PhysicsConstants.DefaultWind;
    public bool EnableIdleMovement { get; set; } = true;
    public int ConstraintIterations { get; set; } = PhysicsConstants.ConstraintIterations;

    public bool IsBeingDragged { get; private set; }

    public Rope(double anchorX, double anchorY, double totalLength, int segmentCount = PhysicsConstants.DefaultSegmentCount)
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

    public void ResizeRope(double totalLength)
    {
        if (_points.Count < 2) return;
        _segmentLength = totalLength / (_points.Count - 1);
    }

    public void SetAnchor(double anchorX, double anchorY)
    {
        if (_points.Count > 0)
        {
            _points[0].SetPosition(anchorX, anchorY, resetVelocity: false);
        }
    }

    public void StartDrag(double x, double y)
    {
        IsBeingDragged = true;
        CharmAttachmentPoint.SetPosition(x, y, resetVelocity: false);
    }

    public void UpdateDrag(double x, double y)
    {
        if (!IsBeingDragged) return;
        CharmAttachmentPoint.SetPosition(x, y, resetVelocity: false);
    }

    public void EndDrag(double releaseVx, double releaseVy)
    {
        if (!IsBeingDragged) return;
        IsBeingDragged = false;

        // Clamp impulse velocity
        double clampedVx = Math.Clamp(releaseVx, -PhysicsConstants.MaxFlickImpulse, PhysicsConstants.MaxFlickImpulse);
        double clampedVy = Math.Clamp(releaseVy, -PhysicsConstants.MaxFlickImpulse, PhysicsConstants.MaxFlickImpulse);

        CharmAttachmentPoint.AddImpulse(clampedVx, clampedVy);
    }

    /// <summary>
    /// Core physics step executed at ~60 FPS.
    /// Updates position with Verlet integration and solves distance constraints iteratively.
    /// </summary>
    public void Step(double dt)
    {
        _timeAccumulator += dt;

        // Idle environmental breeze computation (Perlin-like smooth compound harmonic breeze)
        double breezeForce = 0.0;
        if (EnableIdleMovement && !IsBeingDragged)
        {
            double t = _timeAccumulator * PhysicsConstants.IdleNoiseSpeed;
            breezeForce = (Math.Sin(t * 1.3) * 0.5 + Math.Sin(t * 2.7) * 0.3 + Math.Cos(t * 0.7) * 0.2) 
                          * WindIntensity * PhysicsConstants.IdleBreezeForce;
        }

        // 1. Verlet integration for all free points
        for (int i = 1; i < _points.Count; i++)
        {
            // If the user is actively dragging the charm, keep the end point pinned to the cursor
            if (i == _points.Count - 1 && IsBeingDragged)
            {
                continue;
            }

            // Rope points lower down feel slightly more breeze due to aerodynamic drag
            double pointBreeze = breezeForce * (1.0 + (double)i / _points.Count);
            double ax = pointBreeze;
            double ay = Gravity;

            _points[i].Update(Damping, ax, ay);
        }

        // 2. Relax distance constraints between adjacent points
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

                // Adjust points according to pinning
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

    /// <summary>
    /// Calculates the current tilt angle (in degrees) of the bottom rope segment to align the charm naturally.
    /// </summary>
    public double GetCharmAngle()
    {
        if (_points.Count < 2) return 0.0;
        RopePoint pPrev = _points[^2];
        RopePoint pEnd = _points[^1];

        double dx = pEnd.X - pPrev.X;
        double dy = pEnd.Y - pPrev.Y;
        double angleRad = Math.Atan2(dx, dy); // 0 = straight down
        return -angleRad * (180.0 / Math.PI);
    }
}
