using System;
using System.IO;
using System.Text.Json;
using LuckyDangle.Models;
using Microsoft.Win32;

namespace LuckyDangle.Services;

/// <summary>
/// Handles atomic, corruption-resistant reading and writing of configuration settings.
/// Also provides Windows Startup registry integration without external dependencies.
/// </summary>
public class SettingsService
{
    private const string AppName = "LuckyDangle";
    private const string SettingsFileName = "settings.json";
    private const string StartupRegistryKey = @"Software\Microsoft\Windows\CurrentVersion\Run";

    private readonly string _settingsFolder;
    private readonly string _settingsFilePath;

    public AppSettings CurrentSettings { get; private set; }

    public event Action<AppSettings>? SettingsChanged;

    public SettingsService()
    {
        _settingsFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            AppName
        );
        _settingsFilePath = Path.Combine(_settingsFolder, SettingsFileName);

        CurrentSettings = LoadSettings();
    }

    public AppSettings LoadSettings()
    {
        try
        {
            if (File.Exists(_settingsFilePath))
            {
                string json = File.ReadAllText(_settingsFilePath);
                var settings = JsonSerializer.Deserialize<AppSettings>(json);
                if (settings != null)
                {
                    settings.ClampValues();
                    return settings;
                }
            }
        }
        catch (Exception)
        {
            // Fallback gracefully on corrupted file
        }

        var defaultSettings = new AppSettings();
        defaultSettings.ClampValues();
        return defaultSettings;
    }

    public void SaveSettings(AppSettings settings)
    {
        settings.ClampValues();
        CurrentSettings = settings;

        try
        {
            Directory.CreateDirectory(_settingsFolder);
            string json = JsonSerializer.Serialize(settings, new JsonSerializerOptions { WriteIndented = true });

            // Safe atomic write using temporary file
            string tempFile = _settingsFilePath + ".tmp";
            File.WriteAllText(tempFile, json);
            File.Move(tempFile, _settingsFilePath, overwrite: true);

            // Apply startup registry setting if needed
            SetStartup(settings.StartWithWindows);

            SettingsChanged?.Invoke(CurrentSettings);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to save settings: {ex.Message}");
        }
    }

    public void SetStartup(bool enable)
    {
        try
        {
            using var key = Registry.CurrentUser.OpenSubKey(StartupRegistryKey, writable: true);
            if (key == null) return;

            string? exePath = Environment.ProcessPath;
            if (string.IsNullOrEmpty(exePath)) return;

            if (enable)
            {
                key.SetValue(AppName, $"\"{exePath}\"");
            }
            else
            {
                if (key.GetValue(AppName) != null)
                {
                    key.DeleteValue(AppName, throwOnMissingValue: false);
                }
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error modifying startup registry: {ex.Message}");
        }
    }
}
