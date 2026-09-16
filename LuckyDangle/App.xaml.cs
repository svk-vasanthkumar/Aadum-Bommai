using System;
using System.Threading;
using System.Windows;
using LuckyDangle.Services;

namespace LuckyDangle;

public partial class App : Application
{
    private const string AppMutexName = "LuckyDangle_SingleInstance_Mutex_98a72b";
    private Mutex? _appMutex;

    private void OnApplicationStartup(object sender, StartupEventArgs e)
    {
        // Ensure single running instance
        _appMutex = new Mutex(true, AppMutexName, out bool isNewInstance);
        if (!isNewInstance)
        {
            MessageBox.Show(
                "Lucky Dangle is already running in your system tray.", 
                "Lucky Dangle", 
                MessageBoxButton.OK, 
                MessageBoxImage.Information);
            Shutdown();
            return;
        }

        // Catch and log any unhandled exceptions to prevent silent crashing
        AppDomain.CurrentDomain.UnhandledException += (s, args) =>
        {
            System.Diagnostics.Debug.WriteLine($"Unhandled exception: {args.ExceptionObject}");
        };

        DispatcherUnhandledException += (s, args) =>
        {
            System.Diagnostics.Debug.WriteLine($"Dispatcher unhandled exception: {args.Exception.Message}");
            args.Handled = true; // Prevent crash, keep applet running
        };

        // Initialize core services
        var charmService = new CharmService();
        var settingsService = new SettingsService();

        var mainWindow = new MainWindow(charmService, settingsService);
        mainWindow.Show();
    }

    protected override void OnExit(ExitEventArgs e)
    {
        _appMutex?.ReleaseMutex();
        _appMutex?.Dispose();
        base.OnExit(e);
    }
}
