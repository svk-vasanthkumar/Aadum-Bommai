using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using LuckyDangle.Interaction;
using LuckyDangle.Models;
using LuckyDangle.Physics;
using LuckyDangle.Rendering;
using LuckyDangle.Services;
using LuckyDangle.UI;

namespace LuckyDangle;

public partial class MainWindow : Window
{
    // Win32 constants for click-through support
    private const int WM_NCHITTEST = 0x0084;
    private const int HTTRANSPARENT = -1;

    private readonly Rope _rope;
    private readonly PhysicsService _physicsService;
    private readonly RopeRenderer _ropeRenderer;
    private readonly CharmInteraction _interaction;
    private readonly CharmService _charmService;
    private readonly SettingsService _settingsService;
    private readonly TrayService _trayService;

    private readonly DrawingVisual _ropeVisual = new();
    private SettingsWindow? _settingsWindow;

    public MainWindow(CharmService charmService, SettingsService settingsService)
    {
        InitializeComponent();

        _charmService = charmService;
        _settingsService = settingsService;

        // Anchor at horizontal center of 340px window, top edge
        double anchorX = 170.0;
        double anchorY = 0.0;
        double ropeLength = _settingsService.CurrentSettings.RopeLength;

        _rope = new Rope(anchorX, anchorY, ropeLength, PhysicsConstants.DefaultSegmentCount)
        {
            Gravity = _settingsService.CurrentSettings.Gravity,
            Damping = _settingsService.CurrentSettings.Damping,
            WindIntensity = _settingsService.CurrentSettings.Wind,
            EnableIdleMovement = _settingsService.CurrentSettings.EnableIdleMovement
        };

        _ropeRenderer = new RopeRenderer();
        _interaction = new CharmInteraction(_rope);
        _physicsService = new PhysicsService(_rope);

        // Host DrawingVisual inside RopeCanvas
        var visualHost = new VisualHost();
        visualHost.AddVisual(_ropeVisual);
        RopeCanvas.Children.Add(visualHost);

        // Hook physics tick to UI frame render
        _physicsService.OnPhysicsStep += OnPhysicsTick;

        // Initialize Tray Service
        _trayService = new TrayService(
            _charmService,
            _settingsService,
            openSettingsAction: OpenSettingsDialog,
            togglePauseAction: ToggleSimulationPause,
            exitAction: () => Application.Current.Shutdown(),
            switchCharmAction: SwitchCharm,
            switchPositionAction: SwitchScreenPosition
        );

        _settingsService.SettingsChanged += OnSettingsChanged;

        Loaded += OnWindowLoaded;
        Closing += OnWindowClosing;
    }

    private void OnWindowLoaded(object sender, RoutedEventArgs e)
    {
        PositionWindow();
        ApplyCharmVisual(_settingsService.CurrentSettings.Charm);

        // Win32 Message Hook for selective click-through
        var hwnd = new WindowInteropHelper(this).Handle;
        var source = HwndSource.FromHwnd(hwnd);
        source?.AddHook(WndProc);

        _physicsService.Start();
    }

    /// <summary>
    /// Win32 window procedure hook.
    /// Intercepts WM_NCHITTEST: if the cursor is outside the charm, return HTTRANSPARENT (-1)
    /// so the click passes seamlessly through to underlying desktop windows!
    /// </summary>
    private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
    {
        if (msg == WM_NCHITTEST)
        {
            // If dragging, we always want the hit test
            if (_interaction.IsDragging)
            {
                handled = false;
                return IntPtr.Zero;
            }

            // Extract screen coordinates of cursor
            int screenX = unchecked((short)(long)lParam);
            int screenY = unchecked((short)((long)lParam >> 16));
            var cursorScreenPoint = new Point(screenX, screenY);

            // Convert to window relative coordinates
            var windowPoint = PointFromScreen(cursorScreenPoint);

            // Check if cursor is over CharmContainer bounding box
            var charmPos = new Point(CharmTranslate.X, CharmTranslate.Y);
            var charmRect = new Rect(charmPos.X, charmPos.Y, CharmContainer.ActualWidth, CharmContainer.ActualHeight);

            // Expand hit area slightly (8px) for comfortable interaction
            charmRect.Inflate(8, 8);

            if (!charmRect.Contains(windowPoint))
            {
                // Cursor is outside charm -> Pass through to Windows desktop / apps beneath
                handled = true;
                return new IntPtr(HTTRANSPARENT);
            }
        }

        return IntPtr.Zero;
    }

    private void OnPhysicsTick()
    {
        // 1. Redraw rope with DrawingVisual
        using (var dc = _ropeVisual.RenderOpen())
        {
            _ropeRenderer.Render(dc, _rope.Points);
        }

        // 2. Position and rotate the charm at the end of the rope
        var bottomPoint = _rope.CharmAttachmentPoint;
        double charmWidth = CharmContainer.ActualWidth > 0 ? CharmContainer.ActualWidth : 70;
        
        // Center charm horizontally over bottom rope point
        CharmTranslate.X = bottomPoint.X - (charmWidth / 2.0);
        CharmTranslate.Y = bottomPoint.Y;

        // Tilt charm according to pendulum angle
        CharmRotate.Angle = _rope.GetCharmAngle();
    }

    private void OnCharmMouseDown(object sender, MouseButtonEventArgs e)
    {
        if (e.LeftButton == MouseButtonState.Pressed)
        {
            CharmContainer.CaptureMouse();
            var windowPos = e.GetPosition(this);
            _interaction.OnMouseDown(windowPos);
        }
    }

    private void OnCharmMouseMove(object sender, MouseEventArgs e)
    {
        if (CharmContainer.IsMouseCaptured)
        {
            var windowPos = e.GetPosition(this);
            _interaction.OnMouseMove(windowPos);
        }
    }

    private void OnCharmMouseUp(object sender, MouseButtonEventArgs e)
    {
        if (CharmContainer.IsMouseCaptured)
        {
            var windowPos = e.GetPosition(this);
            _interaction.OnMouseUp(windowPos);
            CharmContainer.ReleaseMouseCapture();
        }
    }

    public void PositionWindow()
    {
        var workArea = SystemParameters.WorkArea;
        var settings = _settingsService.CurrentSettings;

        switch (settings.Position)
        {
            case ScreenPosition.TopLeft:
                Left = workArea.Left + 40;
                Top = workArea.Top;
                break;
            case ScreenPosition.TopRight:
                Left = workArea.Right - Width - 40;
                Top = workArea.Top;
                break;
            case ScreenPosition.TopCenter:
            default:
                Left = workArea.Left + (workArea.Width - Width) / 2.0;
                Top = workArea.Top;
                break;
        }
    }

    public void SwitchCharm(string charmId)
    {
        var settings = _settingsService.CurrentSettings;
        settings.Charm = charmId;
        _settingsService.SaveSettings(settings);
    }

    public void SwitchScreenPosition(ScreenPosition pos)
    {
        var settings = _settingsService.CurrentSettings;
        settings.Position = pos;
        _settingsService.SaveSettings(settings);
        PositionWindow();
    }

    private void ApplyCharmVisual(string charmId)
    {
        var charm = _charmService.GetCharmById(charmId);
        
        // Set vector geometry and colors according to charm type
        var geometry = CreateCharmGeometry(charm.Type);
        CharmPath.Data = geometry;
        CharmPath.Fill = new BrushConverter().ConvertFromString(charm.AccentColorHex) as Brush;
    }

    private Geometry CreateCharmGeometry(CharmType type)
    {
        // Crisp vector geometry definitions for each charm
        string pathData = type switch
        {
            CharmType.EvilEye => "M 28,6 C 14,6 4,16 4,28 C 4,40 14,50 28,50 C 42,50 52,40 52,28 C 52,16 42,6 28,6 Z M 28,14 C 36,14 42,20 42,28 C 42,36 36,42 28,42 C 20,42 14,36 14,28 C 14,20 20,14 28,14 Z M 28,21 C 32,21 35,24 35,28 C 35,32 32,35 28,35 C 24,35 21,32 21,28 C 21,24 24,21 28,21 Z",
            CharmType.FourLeafClover => "M 28,28 C 28,18 20,10 12,18 C 4,26 18,28 28,28 Z M 28,28 C 28,18 36,10 44,18 C 52,26 38,28 28,28 Z M 28,28 C 28,38 20,46 12,38 C 4,30 18,28 28,28 Z M 28,28 C 28,38 36,46 44,38 C 52,30 38,28 28,28 Z",
            CharmType.LuckyCat => "M 16,10 L 22,20 L 34,20 L 40,10 L 44,22 C 48,28 48,36 44,42 C 38,48 18,48 12,42 C 8,36 8,28 12,22 Z M 20,28 A 2,2 0 1 0 24,28 A 2,2 0 1 0 20,28 Z M 32,28 A 2,2 0 1 0 36,28 A 2,2 0 1 0 32,28 Z",
            CharmType.LuckyCoin => "M 28,6 C 16,6 6,16 6,28 C 6,40 16,50 28,50 C 40,50 50,40 50,28 C 50,16 40,6 28,6 Z M 22,22 L 34,22 L 34,34 L 22,34 Z",
            CharmType.Hamsa => "M 28,8 C 23,8 20,14 20,24 L 14,26 C 11,28 11,34 14,37 L 22,46 C 26,50 30,50 34,46 L 42,37 C 45,34 45,28 42,26 L 36,24 C 36,14 33,8 28,8 Z",
            _ => "M 28,8 C 17,8 8,17 8,28 C 8,39 17,48 28,48 C 39,48 48,39 48,28 C 48,17 39,8 28,8 Z"
        };
        return Geometry.Parse(pathData);
    }

    private void OnSettingsChanged(AppSettings newSettings)
    {
        _rope.ResizeRope(newSettings.RopeLength);
        _rope.Gravity = newSettings.Gravity;
        _rope.Damping = newSettings.Damping;
        _rope.WindIntensity = newSettings.Wind;
        _rope.EnableIdleMovement = newSettings.EnableIdleMovement;
        ApplyCharmVisual(newSettings.Charm);
        PositionWindow();
    }

    private void OpenSettingsDialog()
    {
        if (_settingsWindow == null || !_settingsWindow.IsLoaded)
        {
            _settingsWindow = new SettingsWindow(_charmService, _settingsService);
            _settingsWindow.Show();
        }
        else
        {
            _settingsWindow.Activate();
        }
    }

    private void ToggleSimulationPause()
    {
        _physicsService.TogglePause();
        _trayService.UpdatePauseText(!_physicsService.IsRunning);
    }

    private void OnWindowClosing(object? sender, System.ComponentModel.CancelEventArgs e)
    {
        _physicsService.Dispose();
        _trayService.Dispose();
    }
}

/// <summary>
/// Lightweight VisualHost element used to host WPF DrawingVisual elements cleanly.
/// </summary>
public class VisualHost : FrameworkElement
{
    private readonly VisualCollection _children;

    public VisualHost()
    {
        _children = new VisualCollection(this);
    }

    public void AddVisual(Visual visual)
    {
        _children.Add(visual);
    }

    protected override int VisualChildrenCount => _children.Count;

    protected override Visual GetVisualChild(int index)
    {
        if (index < 0 || index >= _children.Count)
            throw new ArgumentOutOfRangeException(nameof(index));
        return _children[index];
    }
}
