namespace LuckyDangle.Physics;

/// <summary>
/// Centralized physics configuration and simulation limits.
/// Provides default physical characteristics for the rope and charm.
/// </summary>
public static class PhysicsConstants
{
    public const double DefaultGravity = 0.38;
    public const double DefaultDamping = 0.992;
    public const double DefaultWind = 0.04;
    public const int DefaultSegmentCount = 12;
    public const double DefaultRopeLength = 280.0;
    public const int ConstraintIterations = 16;

    // Safety and clamping thresholds
    public const double MaxVelocityClamp = 45.0;
    public const double MaxFlickImpulse = 35.0;
    public const double FlickVelocityThreshold = 8.0;

    // Idle motion timing
    public const double IdleNoiseSpeed = 0.8;
    public const double IdleBreezeForce = 0.06;

    // Window dimensions
    public const double DefaultWindowWidth = 320.0;
    public const double DefaultWindowHeight = 520.0;
    public const double AnchorRelativeX = 160.0;
    public const double AnchorRelativeY = 0.0;
}
