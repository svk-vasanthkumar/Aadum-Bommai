using System.Collections.Generic;
using System.Linq;
using LuckyDangle.Models;

namespace LuckyDangle.Services;

/// <summary>
/// Registry of all supported cultural lucky charms.
/// Provides metadata, aesthetic colors, and vector representations.
/// </summary>
public class CharmService
{
    private readonly List<Charm> _charms = new();

    public IReadOnlyList<Charm> AvailableCharms => _charms;

    public CharmService()
    {
        InitializeCharms();
    }

    private void InitializeCharms()
    {
        _charms.Add(new Charm
        {
            Type = CharmType.EvilEye,
            DisplayName = "Nazar Evil Eye",
            OriginCulture = "Mediterranean / Anatolian",
            Meaning = "Protects against envy and wards off negative energy.",
            Width = 60,
            Height = 60,
            AttachmentOffsetY = -28,
            AccentColorHex = "#1D4ED8"
        });

        _charms.Add(new Charm
        {
            Type = CharmType.LuckyCat,
            DisplayName = "Maneki-neko (Lucky Cat)",
            OriginCulture = "Japanese",
            Meaning = "Beckons good fortune, wealth, and happy visitors.",
            Width = 62,
            Height = 68,
            AttachmentOffsetY = -32,
            AccentColorHex = "#F59E0B"
        });

        _charms.Add(new Charm
        {
            Type = CharmType.FourLeafClover,
            DisplayName = "Four Leaf Clover",
            OriginCulture = "Celtic / Irish",
            Meaning = "Faith, Hope, Love, and extraordinary Good Luck.",
            Width = 60,
            Height = 64,
            AttachmentOffsetY = -29,
            AccentColorHex = "#10B981"
        });

        _charms.Add(new Charm
        {
            Type = CharmType.LuckyCoin,
            DisplayName = "Golden Feng Shui Coin",
            OriginCulture = "East Asian",
            Meaning = "Abundance, financial harmony, and protective balance.",
            Width = 58,
            Height = 58,
            AttachmentOffsetY = -27,
            AccentColorHex = "#D97706"
        });

        _charms.Add(new Charm
        {
            Type = CharmType.Hamsa,
            DisplayName = "Hamsa Hand of Miriam",
            OriginCulture = "Middle Eastern",
            Meaning = "Strength, blessing, and defense against the evil eye.",
            Width = 58,
            Height = 68,
            AttachmentOffsetY = -33,
            AccentColorHex = "#0284C7"
        });

        _charms.Add(new Charm
        {
            Type = CharmType.NimbuMirchi,
            DisplayName = "Nimbu Mirchi (Lemon & Chilis)",
            OriginCulture = "South Asian / Indian",
            Meaning = "Hung at entrances to absorb discord and appease Alakshmi.",
            Width = 56,
            Height = 72,
            AttachmentOffsetY = -35,
            AccentColorHex = "#EAB308"
        });

        _charms.Add(new Charm
        {
            Type = CharmType.Daruma,
            DisplayName = "Daruma Doll",
            OriginCulture = "Japanese",
            Meaning = "Perseverance, goal achievement, and good fortune.",
            Width = 60,
            Height = 62,
            AttachmentOffsetY = -29,
            AccentColorHex = "#DC2626"
        });

        _charms.Add(new Charm
        {
            Type = CharmType.GoldenAcorn,
            DisplayName = "Golden Oak Acorn",
            OriginCulture = "Norse / European",
            Meaning = "Spiritual growth, longevity, and thunder protection.",
            Width = 54,
            Height = 64,
            AttachmentOffsetY = -30,
            AccentColorHex = "#B45309"
        });
    }

    public Charm GetCharmById(string id)
    {
        return _charms.FirstOrDefault(c => c.Id.Equals(id, System.StringComparison.OrdinalIgnoreCase)) 
               ?? _charms[0];
    }
}
