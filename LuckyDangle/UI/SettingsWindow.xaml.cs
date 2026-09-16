using System;
using System.Windows;
using System.Windows.Controls;
using LuckyDangle.Models;
using LuckyDangle.Services;

namespace LuckyDangle.UI;

public partial class SettingsWindow : Window
{
    private readonly CharmService _charmService;
    private readonly SettingsService _settingsService;

    public SettingsWindow(CharmService charmService, SettingsService settingsService)
    {
        InitializeComponent();

        _charmService = charmService;
        _settingsService = settingsService;

        PopulateControls();
        HookEvents();
    }

    private void PopulateControls()
    {
        CharmComboBox.ItemsSource = _charmService.AvailableCharms;
        CharmComboBox.SelectedValue = _settingsService.CurrentSettings.Charm;

        PositionComboBox.ItemsSource = Enum.GetValues(typeof(ScreenPosition));
        PositionComboBox.SelectedItem = _settingsService.CurrentSettings.Position;

        var s = _settingsService.CurrentSettings;
        RopeLengthSlider.Value = s.RopeLength;
        RopeLengthVal.Text = $"{s.RopeLength:0} px";

        GravitySlider.Value = s.Gravity;
        GravityVal.Text = $"{s.Gravity:0.00}";

        DampingSlider.Value = s.Damping;
        DampingVal.Text = $"{s.Damping:0.000}";

        WindSlider.Value = s.Wind;
        WindVal.Text = $"{s.Wind:0.00}";

        IdleMovementCheck.IsChecked = s.EnableIdleMovement;
        StartupCheck.IsChecked = s.StartWithWindows;

        UpdateCharmMeaning(s.Charm);
    }

    private void HookEvents()
    {
        CharmComboBox.SelectionChanged += (s, e) =>
        {
            if (CharmComboBox.SelectedValue is string charmId)
            {
                UpdateCharmMeaning(charmId);
            }
        };

        RopeLengthSlider.ValueChanged += (s, e) => RopeLengthVal.Text = $"{e.NewValue:0} px";
        GravitySlider.ValueChanged += (s, e) => GravityVal.Text = $"{e.NewValue:0.00}";
        DampingSlider.ValueChanged += (s, e) => DampingVal.Text = $"{e.NewValue:0.000}";
        WindSlider.ValueChanged += (s, e) => WindVal.Text = $"{e.NewValue:0.00}";
    }

    private void UpdateCharmMeaning(string charmId)
    {
        var charm = _charmService.GetCharmById(charmId);
        CharmMeaningText.Text = $"[{charm.OriginCulture}] {charm.Meaning}";
    }

    private void OnResetDefaultsClick(object sender, RoutedEventArgs e)
    {
        var d = new AppSettings();
        RopeLengthSlider.Value = d.RopeLength;
        GravitySlider.Value = d.Gravity;
        DampingSlider.Value = d.Damping;
        WindSlider.Value = d.Wind;
        IdleMovementCheck.IsChecked = d.EnableIdleMovement;
        PositionComboBox.SelectedItem = d.Position;
        StartupCheck.IsChecked = d.StartWithWindows;
        CharmComboBox.SelectedValue = d.Charm;
    }

    private void OnSaveClick(object sender, RoutedEventArgs e)
    {
        var s = _settingsService.CurrentSettings;
        s.Charm = CharmComboBox.SelectedValue?.ToString() ?? "EvilEye";
        s.RopeLength = RopeLengthSlider.Value;
        s.Gravity = GravitySlider.Value;
        s.Damping = DampingSlider.Value;
        s.Wind = WindSlider.Value;
        s.EnableIdleMovement = IdleMovementCheck.IsChecked == true;
        s.Position = (ScreenPosition)(PositionComboBox.SelectedItem ?? ScreenPosition.TopCenter);
        s.StartWithWindows = StartupCheck.IsChecked == true;

        _settingsService.SaveSettings(s);
        Close();
    }
}
