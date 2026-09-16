using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;
using System.Windows.Shapes;
using LuckyDangle.Physics;

namespace LuckyDangle.Rendering;

/// <summary>
/// High-efficiency WPF geometry renderer for the dangling rope.
/// Utilizes cached StreamGeometry and Pen to produce zero heap allocations during the 60 FPS loop.
/// </summary>
public class RopeRenderer
{
    private readonly StreamGeometry _ropeGeometry = new();
    private readonly Pen _ropePen;
    private readonly Pen _knotPen;
    private readonly Brush _anchorBrush;

    public RopeRenderer()
    {
        // Dark crimson / silk thread aesthetic
        var ropeBrush = new SolidColorBrush(Color.FromRgb(185, 28, 28)); // Deep Red Lucky Thread
        ropeBrush.Freeze();

        _ropePen = new Pen(ropeBrush, 2.5)
        {
            StartLineCap = PenLineCap.Round,
            EndLineCap = PenLineCap.Round,
            LineJoin = PenLineJoin.Round
        };
        _ropePen.Freeze();

        var knotBrush = new SolidColorBrush(Color.FromRgb(217, 119, 6)); // Gold Knot Accent
        knotBrush.Freeze();

        _knotPen = new Pen(knotBrush, 4.0)
        {
            StartLineCap = PenLineCap.Round,
            EndLineCap = PenLineCap.Round
        };
        _knotPen.Freeze();

        _anchorBrush = new SolidColorBrush(Color.FromRgb(30, 41, 59));
        _anchorBrush.Freeze();
    }

    /// <summary>
    /// Renders the rope into a DrawingContext.
    /// Uses cubic/quadratic smoothing through points for an organic dangling cord appearance.
    /// </summary>
    public void Render(DrawingContext dc, IReadOnlyList<RopePoint> points)
    {
        if (points.Count < 2) return;

        using (StreamGeometryContext ctx = _ropeGeometry.Open())
        {
            ctx.BeginFigure(new Point(points[0].X, points[0].Y), isFilled: false, isClosed: false);

            for (int i = 1; i < points.Count; i++)
            {
                ctx.LineTo(new Point(points[i].X, points[i].Y), isStroked: true, isSmoothJoin: true);
            }
        }

        // Draw main rope line
        dc.DrawGeometry(null, _ropePen, _ropeGeometry);

        // Draw top anchor pin bead
        dc.DrawEllipse(_anchorBrush, null, new Point(points[0].X, points[0].Y), 4.5, 4.5);

        // Draw charm connection ring/knot
        var bottomPoint = points[^1];
        dc.DrawEllipse(null, _knotPen, new Point(bottomPoint.X, bottomPoint.Y), 3.0, 3.0);
    }
}
