namespace LuckyDangle.Physics;

/// <summary>
/// Represents a single discrete mass point within the Verlet rope simulation.
/// Uses previous and current coordinates to preserve velocity without explicit momentum vectors.
/// </summary>
public class RopePoint
{
    public double X { get; set; }
    public double Y { get; set; }
    public double OldX { get; set; }
    public double OldY { get; set; }
    public bool IsPinned { get; set; }

    public RopePoint(double x, double y, bool isPinned = false)
    {
        X = x;
        Y = y;
        OldX = x;
        OldY = y;
        IsPinned = isPinned;
    }

    /// <summary>
    /// Updates position using Verlet integration:
    /// X_new = X + (X - OldX) * damping + acceleration * dt^2
    /// </summary>
    public void Update(double damping, double accelerationX, double accelerationY)
    {
        if (IsPinned) return;

        double vx = (X - OldX) * damping;
        double vy = (Y - OldY) * damping;

        OldX = X;
        OldY = Y;

        X += vx + accelerationX;
        Y += vy + accelerationY;
    }

    /// <summary>
    /// Instantly injects an impulse velocity to this point.
    /// </summary>
    public void AddImpulse(double impulseX, double impulseY)
    {
        if (IsPinned) return;
        OldX -= impulseX;
        OldY -= impulseY;
    }

    /// <summary>
    /// Teleports the point while preserving or resetting velocity.
    /// </summary>
    public void SetPosition(double x, double y, bool resetVelocity = false)
    {
        X = x;
        Y = y;
        if (resetVelocity)
        {
            OldX = x;
            OldY = y;
        }
    }
}
