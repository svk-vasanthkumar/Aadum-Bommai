import { PhysicsParams, PhysicsTelemetry } from '../types';

export interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  isPinned: boolean;
}

export class VerletRopeSimulation {
  public points: Point[] = [];
  public anchorX: number;
  public anchorY: number;
  public params: PhysicsParams;

  private segmentLength: number = 20;
  private timeAccumulator: number = 0;
  public isDragging: boolean = false;
  private recentMouseSamples: { x: number; y: number; time: number }[] = [];
  
  // Telemetry
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private fpsCurrent: number = 60;
  private fpsTimer: number = performance.now();

  constructor(anchorX: number, anchorY: number, params: PhysicsParams) {
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.params = { ...params };
    this.initializeRope();
  }

  public initializeRope(): void {
    this.points = [];
    const count = Math.max(4, this.params.segments);
    this.segmentLength = this.params.ropeLength / count;

    for (let i = 0; i <= count; i++) {
      const y = this.anchorY + i * this.segmentLength;
      this.points.push({
        x: this.anchorX,
        y,
        oldX: this.anchorX,
        oldY: y,
        isPinned: i === 0
      });
    }
  }

  public updateConfig(newParams: Partial<PhysicsParams>): void {
    const oldLength = this.params.ropeLength;
    const oldSegments = this.params.segments;
    this.params = { ...this.params, ...newParams };

    if (newParams.segments && newParams.segments !== oldSegments) {
      this.initializeRope();
    } else if (newParams.ropeLength && newParams.ropeLength !== oldLength) {
      const count = this.points.length - 1;
      this.segmentLength = this.params.ropeLength / Math.max(1, count);
    }
  }

  public setAnchor(x: number, y: number): void {
    this.anchorX = x;
    this.anchorY = y;
    if (this.points.length > 0) {
      this.points[0].x = x;
      this.points[0].y = y;
      this.points[0].oldX = x;
      this.points[0].oldY = y;
    }
  }

  public startDrag(x: number, y: number): void {
    this.isDragging = true;
    this.recentMouseSamples = [{ x, y, time: performance.now() }];
    const charmPoint = this.points[this.points.length - 1];
    charmPoint.x = x;
    charmPoint.y = y;
  }

  public updateDrag(x: number, y: number): void {
    if (!this.isDragging) return;
    const now = performance.now();
    this.recentMouseSamples.push({ x, y, time: now });

    // Keep only samples within last 100ms
    while (
      this.recentMouseSamples.length > 6 ||
      (this.recentMouseSamples.length > 2 && now - this.recentMouseSamples[0].time > 100)
    ) {
      this.recentMouseSamples.shift();
    }

    const charmPoint = this.points[this.points.length - 1];
    charmPoint.x = x;
    charmPoint.y = y;
  }

  public endDrag(x: number, y: number): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const now = performance.now();
    this.recentMouseSamples.push({ x, y, time: now });

    let vx = 0;
    let vy = 0;

    if (this.recentMouseSamples.length >= 2) {
      const oldest = this.recentMouseSamples[0];
      const newest = this.recentMouseSamples[this.recentMouseSamples.length - 1];
      const dt = (newest.time - oldest.time) / 1000;

      if (dt > 0.005) {
        // Compute release flick velocity clamped to safety limit
        const rawVx = (newest.x - oldest.x) / dt * 0.016;
        const rawVy = (newest.y - oldest.y) / dt * 0.016;
        const maxFlick = 36;
        vx = Math.max(-maxFlick, Math.min(maxFlick, rawVx));
        vy = Math.max(-maxFlick, Math.min(maxFlick, rawVy));
      }
    }

    this.recentMouseSamples = [];

    // Apply flick impulse directly to old positions
    const charmPoint = this.points[this.points.length - 1];
    charmPoint.oldX = charmPoint.x - vx;
    charmPoint.oldY = charmPoint.y - vy;
  }

  public step(dtSeconds: number = 0.016): void {
    this.timeAccumulator += dtSeconds;

    // Ambient natural wind
    let windForce = 0;
    if (this.params.idleMovement && !this.isDragging) {
      const t = this.timeAccumulator * 0.8;
      // Compound harmonic wave prevents simple repetitive sine motion
      windForce =
        (Math.sin(t * 1.3) * 0.5 + Math.sin(t * 2.7) * 0.3 + Math.cos(t * 0.7) * 0.2) *
        this.params.wind *
        12.0;
    }

    const count = this.points.length;

    // 1. Verlet Integration
    for (let i = 1; i < count; i++) {
      if (i === count - 1 && this.isDragging) {
        continue; // End pinned to cursor during drag
      }

      const p = this.points[i];
      const vx = (p.x - p.oldX) * this.params.damping;
      const vy = (p.y - p.oldY) * this.params.damping;

      p.oldX = p.x;
      p.oldY = p.y;

      const aerodynamicFactor = 1.0 + i / count;
      const ax = windForce * aerodynamicFactor;
      const ay = this.params.gravity * 24.0; // Gravity scale

      p.x += vx + ax * dtSeconds;
      p.y += vy + ay * dtSeconds;
    }

    // 2. Constraint Solving Iterations
    const iterations = 16;
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < count - 1; i++) {
        const p1 = this.points[i];
        const p2 = this.points[i + 1];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.0001) continue;

        const diff = (dist - this.segmentLength) / dist;

        if (p1.isPinned) {
          if (!(i + 1 === count - 1 && this.isDragging)) {
            p2.x -= dx * diff;
            p2.y -= dy * diff;
          }
        } else if (i + 1 === count - 1 && this.isDragging) {
          p1.x += dx * diff;
          p1.y += dy * diff;
        } else {
          p1.x += dx * 0.5 * diff;
          p1.y += dy * 0.5 * diff;
          p2.x -= dx * 0.5 * diff;
          p2.y -= dy * 0.5 * diff;
        }
      }
    }

    // Measure FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.fpsTimer >= 1000) {
      this.fpsCurrent = Math.round((this.frameCount * 1000) / (now - this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = now;
    }
  }

  public getCharmAngle(): number {
    if (this.points.length < 2) return 0;
    const pPrev = this.points[this.points.length - 2];
    const pEnd = this.points[this.points.length - 1];
    const dx = pEnd.x - pPrev.x;
    const dy = pEnd.y - pPrev.y;
    return Math.atan2(dx, dy); // 0 = straight down
  }

  public getTelemetry(): PhysicsTelemetry {
    const pEnd = this.points[this.points.length - 1];
    const vx = pEnd.x - pEnd.oldX;
    const vy = pEnd.y - pEnd.oldY;
    const speed = Math.sqrt(vx * vx + vy * vy) * 60; // px/sec
    const angleRad = this.getCharmAngle();
    const angleDeg = -angleRad * (180 / Math.PI);

    let state: PhysicsTelemetry['state'] = 'idle';
    if (this.isDragging) {
      state = 'dragging';
    } else if (speed > 120) {
      state = 'flicked';
    } else if (speed > 8) {
      state = 'swaying';
    }

    return {
      fps: this.fpsCurrent,
      speed: Math.round(speed),
      angleDeg: Math.round(angleDeg),
      tension: Math.min(100, Math.round(Math.abs(speed) * 0.8 + 20)),
      state
    };
  }

  public renderRope(ctx: CanvasRenderingContext2D): void {
    if (this.points.length < 2) return;

    ctx.save();

    // Subtle drop shadow for rope
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    // Red Silk Cord (Traditional auspicious twisted thread)
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    // Smooth Bezier Curve through rope points
    for (let i = 1; i < this.points.length - 1; i++) {
      const xc = (this.points[i].x + this.points[i + 1].x) / 2;
      const yc = (this.points[i].y + this.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
    }
    const lastP = this.points[this.points.length - 1];
    const secondLast = this.points[this.points.length - 2];
    ctx.quadraticCurveTo(secondLast.x, secondLast.y, lastP.x, lastP.y);

    ctx.strokeStyle = '#DC2626'; // Deep Crimson
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Golden Accent Thread Spiral overlay
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Top Anchor Bead / Screen Edge Mount
    ctx.beginPath();
    ctx.arc(this.points[0].x, this.points[0].y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bottom Gold Knot Ring before Charm
    ctx.beginPath();
    ctx.arc(lastP.x, lastP.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#D97706';
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}
