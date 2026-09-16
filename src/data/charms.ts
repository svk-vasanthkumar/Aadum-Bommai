import { CharmInfo, CharmId } from '../types';

export const CHARMS: CharmInfo[] = [
  {
    id: 'evil-eye',
    name: 'Nazar Evil Eye',
    culture: 'Mediterranean / Anatolian',
    symbolism: 'Protection & Deflection of Envy',
    tagline: 'Wards off malevolent glares and restores peace',
    description: 'The Nazar Boncuğu is an ancient talisman crafted with concentric circles of deep cobalt blue, turquoise, white, and obsidian. It deflects negative energy and guards against the evil eye.',
    accentColor: '#2563EB',
    secondaryColor: '#38BDF8',
    draw: (ctx, size) => {
      const r = size * 0.48;
      // Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      // Outer Deep Blue Disc
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = '#1D4ED8';
      ctx.fill();
      ctx.restore();

      // White Ring
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.76, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();

      // Cyan / Sky Blue Ring
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.52, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();

      // Center Pupil (Obsidian Black)
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.26, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();

      // Glass specular highlight
      ctx.beginPath();
      ctx.arc(-r * 0.22, -r * 0.24, r * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fill();
    }
  },
  {
    id: 'lucky-cat',
    name: 'Maneki-neko (Lucky Cat)',
    culture: 'Japanese',
    symbolism: 'Prosperity & Welcoming Fortune',
    tagline: 'Beckons wealth, good fortune, and joyful company',
    description: 'The iconic Japanese calico cat with its right paw beckoning fortune. Adorned with a golden koban coin (千両) and crimson collar with a golden jingle bell.',
    accentColor: '#F59E0B',
    secondaryColor: '#DC2626',
    draw: (ctx, size) => {
      const s = size * 0.9;
      // Cat Body & Head
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      // Main White Head/Torso
      ctx.beginPath();
      ctx.ellipse(0, 2, s * 0.38, s * 0.44, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#334155';
      ctx.stroke();
      ctx.restore();

      // Left Ear
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, -s * 0.15);
      ctx.lineTo(-s * 0.22, -s * 0.46);
      ctx.lineTo(-s * 0.05, -s * 0.32);
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Left Ear Inner Pink
      ctx.beginPath();
      ctx.moveTo(-s * 0.30, -s * 0.18);
      ctx.lineTo(-s * 0.22, -s * 0.40);
      ctx.lineTo(-s * 0.10, -s * 0.30);
      ctx.closePath();
      ctx.fillStyle = '#FDA4AF';
      ctx.fill();

      // Right Ear
      ctx.beginPath();
      ctx.moveTo(s * 0.05, -s * 0.32);
      ctx.lineTo(s * 0.22, -s * 0.46);
      ctx.lineTo(s * 0.35, -s * 0.15);
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Right Ear Inner Pink
      ctx.beginPath();
      ctx.moveTo(s * 0.10, -s * 0.30);
      ctx.lineTo(s * 0.22, -s * 0.40);
      ctx.lineTo(s * 0.30, -s * 0.18);
      ctx.closePath();
      ctx.fillStyle = '#FDA4AF';
      ctx.fill();

      // Calico Patch on Head
      ctx.beginPath();
      ctx.arc(s * 0.15, -s * 0.22, s * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      // Closed Smiling Eyes (Arc)
      ctx.beginPath();
      ctx.arc(-s * 0.16, -s * 0.06, s * 0.08, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(s * 0.16, -s * 0.06, s * 0.08, Math.PI * 1.1, Math.PI * 1.9);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0F172A';
      ctx.stroke();

      // Whiskers
      ctx.beginPath();
      ctx.moveTo(-s * 0.22, 0);
      ctx.lineTo(-s * 0.36, -s * 0.04);
      ctx.moveTo(-s * 0.22, s * 0.06);
      ctx.lineTo(-s * 0.36, s * 0.08);

      ctx.moveTo(s * 0.22, 0);
      ctx.lineTo(s * 0.36, -s * 0.04);
      ctx.moveTo(s * 0.22, s * 0.06);
      ctx.lineTo(s * 0.36, s * 0.08);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#64748B';
      ctx.stroke();

      // Red Collar
      ctx.beginPath();
      ctx.roundRect(-s * 0.30, s * 0.16, s * 0.60, s * 0.10, 4);
      ctx.fillStyle = '#DC2626';
      ctx.fill();

      // Golden Bell
      ctx.beginPath();
      ctx.arc(0, s * 0.22, s * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = '#FBBF24';
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Raised Paws (Beckoning Right Paw)
      ctx.beginPath();
      ctx.ellipse(s * 0.28, -s * 0.06, s * 0.10, s * 0.14, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },
  {
    id: 'four-leaf-clover',
    name: 'Four Leaf Clover',
    culture: 'Celtic / Irish',
    symbolism: 'Faith, Hope, Love & Luck',
    tagline: '1 in 10,000 blessing for everyday serendipity',
    description: 'Each leaf holds a sacred meaning: the first for faith, the second for hope, the third for love, and the rare fourth for radiant good fortune.',
    accentColor: '#10B981',
    secondaryColor: '#059669',
    draw: (ctx, size) => {
      const s = size * 0.44;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      const drawHeartLeaf = (angle: number) => {
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.4, -s * 0.7, -s * 1.0, 0, -s * 0.7);
        ctx.bezierCurveTo(s * 0.7, -s * 1.0, s * 0.5, -s * 0.4, 0, 0);
        ctx.fillStyle = '#10B981';
        ctx.fill();
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner Leaf Vein
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -s * 0.65);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      };

      // 4 Petals at 90 deg increments
      drawHeartLeaf(0);
      drawHeartLeaf(Math.PI * 0.5);
      drawHeartLeaf(Math.PI);
      drawHeartLeaf(Math.PI * 1.5);

      // Center Knot
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = '#065F46';
      ctx.fill();

      // Stem dangling at bottom
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(s * 0.4, s * 0.8, s * 0.2, s * 1.2);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'lucky-coin',
    name: 'Feng Shui Lucky Coin',
    culture: 'East Asian / Taoist',
    symbolism: 'Heaven, Earth & Prosperity',
    tagline: 'Circular heaven enclosing square earth for financial harmony',
    description: 'Round on the outside to represent Heaven, with a square cutout at the center representing Earth. Tied with lucky crimson knotting.',
    accentColor: '#EAB308',
    secondaryColor: '#CA8A04',
    draw: (ctx, size) => {
      const r = size * 0.46;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      // Outer Bronze/Gold Coin
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = '#EAB308';
      ctx.fill();
      ctx.strokeStyle = '#A16207';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner Raised Ridge Ring
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center Square Cutout
      const sq = r * 0.42;
      ctx.beginPath();
      ctx.rect(-sq / 2, -sq / 2, sq, sq);
      ctx.fillStyle = '#0F172A'; // Transparent view through to background
      ctx.fill();
      ctx.strokeStyle = '#854D0E';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 4 Four Cardinal Character marks (stylized seals)
      ctx.fillStyle = '#713F12';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('康', 0, -r * 0.62);
      ctx.fillText('乾', 0, r * 0.62);
      ctx.fillText('隆', -r * 0.62, 0);
      ctx.fillText('寶', r * 0.62, 0);

      // Specular sheen
      ctx.beginPath();
      ctx.arc(-r * 0.3, -r * 0.3, r * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'hamsa',
    name: 'Hamsa Hand of Miriam',
    culture: 'Middle Eastern',
    symbolism: 'Divine Protection & Strength',
    tagline: 'An open right hand recognized as a sign of defense throughout history',
    description: 'The palm-shaped amulet popular throughout the Mediterranean. Features an embedded turquoise protective eye at its center with intricate filigree.',
    accentColor: '#0EA5E9',
    secondaryColor: '#6366F1',
    draw: (ctx, size) => {
      const s = size * 0.85;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      // Hand Outline
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.48); // Middle finger tip
      // Middle finger to right index
      ctx.bezierCurveTo(s * 0.14, -s * 0.48, s * 0.14, -s * 0.35, s * 0.22, -s * 0.32);
      // Right index to right thumb
      ctx.bezierCurveTo(s * 0.30, -s * 0.32, s * 0.34, -s * 0.15, s * 0.44, -s * 0.05);
      // Outer right thumb to base
      ctx.bezierCurveTo(s * 0.46, s * 0.15, s * 0.32, s * 0.25, s * 0.25, s * 0.42);
      // Bottom wrist arc
      ctx.bezierCurveTo(s * 0.15, s * 0.48, -s * 0.15, s * 0.48, -s * 0.25, s * 0.42);
      // Left thumb up
      ctx.bezierCurveTo(-s * 0.32, s * 0.25, -s * 0.46, s * 0.15, -s * 0.44, -s * 0.05);
      // Left thumb to left index
      ctx.bezierCurveTo(-s * 0.34, -s * 0.15, -s * 0.30, -s * 0.32, -s * 0.22, -s * 0.32);
      // Left index back to middle finger
      ctx.bezierCurveTo(-s * 0.14, -s * 0.35, -s * 0.14, -s * 0.48, 0, -s * 0.48);
      ctx.closePath();

      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Filigree engravings on fingers
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.42);
      ctx.lineTo(0, -s * 0.16);
      ctx.moveTo(-s * 0.15, -s * 0.28);
      ctx.lineTo(-s * 0.15, -s * 0.12);
      ctx.moveTo(s * 0.15, -s * 0.28);
      ctx.lineTo(s * 0.15, -s * 0.12);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center Eye in Palm
      ctx.beginPath();
      ctx.ellipse(0, s * 0.08, s * 0.16, s * 0.11, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0284C7';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, s * 0.08, s * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, s * 0.08, s * 0.035, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'nimbu-mirchi',
    name: 'Nimbu Mirchi (Lemon & Chilis)',
    culture: 'South Asian / Indian',
    symbolism: 'Absorbs Discord & Protects Dwellings',
    tagline: 'Hung at doorways, vehicles, and shops across the Indian subcontinent',
    description: 'Consists of a ripe yellow lemon strung with 7 slender fiery green chilis using traditional black spun thread. It appeases Alakshmi and cleanses the domestic space.',
    accentColor: '#EAB308',
    secondaryColor: '#16A34A',
    draw: (ctx, size) => {
      const s = size * 0.9;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 3;

      // Black vertical string tying them together
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.48);
      ctx.lineTo(0, s * 0.48);
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Top Lemon
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.22, s * 0.26, s * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FACC15'; // Vibrant yellow
      ctx.fill();
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lemon pores & highlight
      ctx.beginPath();
      ctx.arc(-s * 0.08, -s * 0.26, s * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      // Cluster of 7 hanging green chilis
      const chiliOffsets = [-0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18];
      chiliOffsets.forEach((ox, i) => {
        const chiliY = s * 0.05 + Math.abs(ox) * s * 0.15;
        const curve = (i % 2 === 0 ? 1 : -1) * (s * 0.08);

        ctx.beginPath();
        ctx.moveTo(ox * s, chiliY);
        ctx.quadraticCurveTo(ox * s + curve, chiliY + s * 0.22, ox * s * 0.5, chiliY + s * 0.38);
        ctx.strokeStyle = i === 3 ? '#15803D' : '#16A34A';
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Dark stem cap
        ctx.beginPath();
        ctx.arc(ox * s, chiliY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#14532D';
        ctx.fill();
      });

      // Bottom hanging tassel / knot
      ctx.beginPath();
      ctx.arc(0, s * 0.44, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();

      ctx.restore();
    }
  },
  {
    id: 'daruma',
    name: 'Daruma Doll',
    culture: 'Japanese',
    symbolism: 'Perseverance & Goal Fulfillment',
    tagline: 'Fall down seven times, stand up eight (七転び八起き)',
    description: 'Hollow, round Japanese traditional doll modeled after Bodhidharma. Its weighted spherical base ensures it always rights itself when tipped, epitomizing unshakeable resilience.',
    accentColor: '#DC2626',
    secondaryColor: '#B91C1C',
    draw: (ctx, size) => {
      const s = size * 0.88;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
      ctx.shadowBlur = 7;
      ctx.shadowOffsetY = 4;

      // Crimson Round Body
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2);
      ctx.fillStyle = '#DC2626';
      ctx.fill();
      ctx.strokeStyle = '#991B1B';
      ctx.lineWidth = 3;
      ctx.stroke();

      // White Heart/Oval Face Area
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.08, s * 0.26, s * 0.24, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF2F2';
      ctx.fill();
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Crane Eyebrows (Traditional brush strokes)
      ctx.beginPath();
      ctx.moveTo(-s * 0.18, -s * 0.22);
      ctx.quadraticCurveTo(-s * 0.10, -s * 0.26, -s * 0.03, -s * 0.20);
      ctx.moveTo(s * 0.18, -s * 0.22);
      ctx.quadraticCurveTo(s * 0.10, -s * 0.26, s * 0.03, -s * 0.20);
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Both Eyes Drawn in (Completed goal achievement)
      ctx.beginPath();
      ctx.arc(-s * 0.11, -s * 0.12, s * 0.055, 0, Math.PI * 2);
      ctx.arc(s * 0.11, -s * 0.12, s * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();

      // Eye glimmer
      ctx.beginPath();
      ctx.arc(-s * 0.12, -s * 0.14, 2, 0, Math.PI * 2);
      ctx.arc(s * 0.10, -s * 0.14, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Turtle Mustache / Beard
      ctx.beginPath();
      ctx.moveTo(-s * 0.14, s * 0.02);
      ctx.quadraticCurveTo(0, s * 0.08, s * 0.14, s * 0.02);
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Gold Kanji / Auspicious inscription (福 = Fortune)
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('福', 0, s * 0.24);

      ctx.restore();
    }
  },
  {
    id: 'golden-acorn',
    name: 'Golden Oak Acorn',
    culture: 'Norse / Celtic',
    symbolism: 'Longevity, Rebirth & Thunder Shield',
    tagline: 'From tiny acorns do mighty oak kingdoms grow',
    description: 'Associated with Thor and sacred grove druids. Carried as an amulet to preserve youth, bring good fortune during storms, and foster patience.',
    accentColor: '#D97706',
    secondaryColor: '#78350F',
    draw: (ctx, size) => {
      const s = size * 0.88;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      // Lower Nut (Golden Amber)
      ctx.beginPath();
      ctx.moveTo(-s * 0.28, -s * 0.05);
      ctx.bezierCurveTo(-s * 0.32, s * 0.25, 0, s * 0.48, 0, s * 0.48);
      ctx.bezierCurveTo(0, s * 0.48, s * 0.32, s * 0.25, s * 0.28, -s * 0.05);
      ctx.closePath();
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Upper Cupule Cap (Woodland Bark)
      ctx.beginPath();
      ctx.roundRect(-s * 0.32, -s * 0.32, s * 0.64, s * 0.28, [12, 12, 4, 4]);
      ctx.fillStyle = '#78350F';
      ctx.fill();
      ctx.strokeStyle = '#451A03';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cross-hatch texture on cap
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 1.2;
      for (let i = -s * 0.24; i <= s * 0.24; i += s * 0.12) {
        ctx.beginPath();
        ctx.moveTo(i, -s * 0.30);
        ctx.lineTo(i + s * 0.08, -s * 0.08);
        ctx.stroke();
      }

      // Little stem stalk on top
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.30);
      ctx.quadraticCurveTo(-s * 0.08, -s * 0.42, -s * 0.04, -s * 0.46);
      ctx.strokeStyle = '#451A03';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Nut Gleam
      ctx.beginPath();
      ctx.ellipse(-s * 0.10, s * 0.15, s * 0.06, s * 0.14, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      ctx.restore();
    }
  }
];

export function getCharmById(id: CharmId): CharmInfo {
  return CHARMS.find(c => c.id === id) || CHARMS[0];
}
