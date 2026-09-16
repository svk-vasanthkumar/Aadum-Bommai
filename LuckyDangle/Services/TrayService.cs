using System;
using System.Drawing;
using System.Windows.Forms;
using LuckyDangle.Models;

namespace LuckyDangle.Services;

/// <summary>
/// Manages the Windows System Tray icon, system notifications, and context menu actions.
/// </summary>
public class TrayService : IDisposable
{
    private readonly NotifyIcon _notifyIcon;
    private readonly CharmService _charmService;
    private readonly SettingsService _settingsService;
    private readonly Action _openSettingsAction;
    private readonly Action _togglePauseAction;
    private readonly Action _exitAction;
    private readonly Action<string> _switchCharmAction;
    private readonly Action<ScreenPosition> _switchPositionAction;

    private ToolStripMenuItem? _pauseResumeMenuItem;
    private ToolStripMenuItem? _startupMenuItem;

    public TrayService(
        CharmService charmService,
        SettingsService settingsService,
        Action openSettingsAction,
        Action togglePauseAction,
        Action exitAction,
        Action<string> switchCharmAction,
        Action<ScreenPosition> switchPositionAction)
    {
        _charmService = charmService;
        _settingsService = settingsService;
        _openSettingsAction = openSettingsAction;
        _togglePauseAction = togglePauseAction;
        _exitAction = exitAction;
        _switchCharmAction = switchCharmAction;
        _switchPositionAction = switchPositionAction;

        _notifyIcon = new NotifyIcon
        {
            Text = "Lucky Dangle — Desktop Companion",
            Icon = SystemIcons.Application,
            Visible = true
        };

        BuildContextMenu();

        _notifyIcon.DoubleClick += (s, e) => _openSettingsAction();
    }

    private void BuildContextMenu()
    {
        var contextMenu = new ContextMenuStrip();

        // Title Header
        var titleItem = new ToolStripMenuItem("Lucky Dangle 🍀") { Enabled = false };
        contextMenu.Items.Add(titleItem);
        contextMenu.Items.Add(new ToolStripSeparator());

        // Charm Submenu
        var charmMenu = new ToolStripMenuItem("Choose Charm");
        foreach (var charm in _charmService.AvailableCharms)
        {
            var item = new ToolStripMenuItem(charm.DisplayName, null, (s, e) => _switchCharmAction(charm.Id))
            {
                Checked = _settingsService.CurrentSettings.Charm == charm.Id
            };
            charmMenu.DropDownItems.Add(item);
        }
        contextMenu.Items.Add(charmMenu);

        // Position Submenu
        var posMenu = new ToolStripMenuItem("Screen Position");
        posMenu.DropDownItems.Add(new ToolStripMenuItem("Top Center", null, (s, e) => _switchPositionAction(ScreenPosition.TopCenter)));
        posMenu.DropDownItems.Add(new ToolStripMenuItem("Top Left", null, (s, e) => _switchPositionAction(ScreenPosition.TopLeft)));
        posMenu.DropDownItems.Add(new ToolStripMenuItem("Top Right", null, (s, e) => _switchPositionAction(ScreenPosition.TopRight)));
        contextMenu.Items.Add(posMenu);

        contextMenu.Items.Add(new ToolStripSeparator());

        // Pause / Resume
        _pauseResumeMenuItem = new ToolStripMenuItem("Pause Simulation", null, (s, e) => _togglePauseAction());
        contextMenu.Items.Add(_pauseResumeMenuItem);

        // Launch at startup
        _startupMenuItem = new ToolStripMenuItem("Launch at Windows Startup", null, (s, e) =>
        {
            var current = _settingsService.CurrentSettings;
            current.StartWithWindows = !current.StartWithWindows;
            _settingsService.SaveSettings(current);
            UpdateMenuCheckedStates();
        })
        {
            Checked = _settingsService.CurrentSettings.StartWithWindows
        };
        contextMenu.Items.Add(_startupMenuItem);

        // Settings Dialog
        contextMenu.Items.Add(new ToolStripMenuItem("Settings...", null, (s, e) => _openSettingsAction()));

        // About Dialog
        contextMenu.Items.Add(new ToolStripMenuItem("About Lucky Dangle", null, (s, e) =>
        {
            System.Windows.MessageBox.Show(
                "Lucky Dangle v1.0.0\n\nA lightweight desktop companion hanging lucky charms from your screen.\nCreated with C#, WPF, and Verlet Integration physics.",
                "About Lucky Dangle",
                System.Windows.MessageBoxButton.OK,
                System.Windows.MessageBoxImage.Information);
        }));

        contextMenu.Items.Add(new ToolStripSeparator());

        // Exit
        contextMenu.Items.Add(new ToolStripMenuItem("Exit", null, (s, e) => _exitAction()));

        _notifyIcon.ContextMenuStrip = contextMenu;
    }

    public void UpdatePauseText(bool isPaused)
    {
        if (_pauseResumeMenuItem != null)
        {
            _pauseResumeMenuItem.Text = isPaused ? "Resume Simulation" : "Pause Simulation";
        }
    }

    public void UpdateMenuCheckedStates()
    {
        if (_startupMenuItem != null)
        {
            _startupMenuItem.Checked = _settingsService.CurrentSettings.StartWithWindows;
        }
    }

    public void Dispose()
    {
        _notifyIcon.Visible = false;
        _notifyIcon.Dispose();
    }
}
