export type CharmId = 
  | 'evil-eye'
  | 'lucky-cat'
  | 'four-leaf-clover'
  | 'lucky-coin'
  | 'hamsa'
  | 'nimbu-mirchi'
  | 'daruma'
  | 'golden-acorn';

export interface CharmInfo {
  id: CharmId;
  name: string;
  culture: string;
  symbolism: string;
  tagline: string;
  description: string;
  accentColor: string;
  secondaryColor: string;
  draw: (ctx: CanvasRenderingContext2D, size: number, angle: number) => void;
}

export interface PhysicsParams {
  ropeLength: number;
  segments: number;
  gravity: number;
  damping: number;
  wind: number;
  idleMovement: boolean;
  anchorYOffset: number;
}

export interface PhysicsTelemetry {
  fps: number;
  speed: number;
  angleDeg: number;
  tension: number;
  state: 'idle' | 'swaying' | 'dragging' | 'flicked';
}
