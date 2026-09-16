using System.Text.Json.Serialization;

namespace LuckyDangle.Models;

public enum ScreenPosition
{
    TopCenter,
    TopLeft,
    TopRight,
    Custom
}

/// <summary>
/// Serializable configuration model stored in local app data JSON.
/// </summary>
public class AppSettings
{
    public string Charm { get; set; } = "EvilEye";
    public double RopeLength { get; set; } = 280.0;
    public double Gravity { get; set; } = 0.38;
    public double Damping { get; set; } = 0.992;
    public double Wind { get; set; } = 0.04;
    public bool EnableIdleMovement { get; set; } = true;
    public ScreenPosition Position { get; set; } = ScreenPosition.TopCenter;
    public bool StartWithWindows { get; set; } = false;
    public double CustomX { get; set; } = -1;
    public double CustomY { get; set; } = 0;
    public int TargetMonitorIndex { get; set; } = 0;

    public void ClampValues()
    {
        RopeLength = Math.Clamp(RopeLength, 120.0, 500.0);
        Gravity = Math.Clamp(Gravity, 0.05, 1.2);
        Damping = Math.Clamp(Damping, 0.90, 0.999);
        Wind = Math.Clamp(Wind, 0.0, 0.2);
    }
}
