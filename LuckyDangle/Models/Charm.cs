using System.Windows.Media;

namespace LuckyDangle.Models;

public enum CharmType
{
    EvilEye,
    LuckyCat,
    FourLeafClover,
    LuckyCoin,
    Hamsa,
    NimbuMirchi,
    Daruma,
    GoldenAcorn
}

/// <summary>
/// Data model describing a lucky charm aesthetic, cultural meaning, and rendering properties.
/// </summary>
public class Charm
{
    public CharmType Type { get; set; }
    public string Id => Type.ToString();
    public string DisplayName { get; set; } = string.Empty;
    public string OriginCulture { get; set; } = string.Empty;
    public string Meaning { get; set; } = string.Empty;
    public double Width { get; set; } = 64.0;
    public double Height { get; set; } = 64.0;
    public double AttachmentOffsetY { get; set; } = 0.0;
    public string AccentColorHex { get; set; } = "#3B82F6";

    // Geometry data string for WPF vector path rendering
    public string VectorPathData { get; set; } = string.Empty;
}
