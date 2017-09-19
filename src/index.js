'use strict';
const electron = require('electron');
const dialog = electron.dialog;
const Menu = electron.Menu;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const systemPreferences = electron.systemPreferences;
var path = require('path');


var mainWindow = null;
var _exec;

var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

if (shouldQuit) {
    app.quit();
    return;
}

if (process.platform.toLocaleLowerCase() === 'darwin') {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);
}
app.on('ready', function () {

    mainWindow = new BrowserWindow({
        title: app.getName(),
        width: 1024,
        height: 768,
        backgroundColor: '#080d19',
        webPreferences: {
            nodeIntegration: false
        },
        toolbar: false,
        show: false,
        icon: path.join(__dirname, 'favicon.ico')
    });

    mainWindow.openDevTools();
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(true);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.maximize();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
        app.exit(0);
    });

    if (process.platform.toLocaleLowerCase() === 'darwin') {
        Menu.setApplicationMenu(Menu.buildFromTemplate([{
            label: app.getName(),
            submenu: [
                {
                    role: 'undo'
                }, {
                    role: 'redo'
                }, {
                    role: 'cut'
                }, {
                    role: 'copy'
                }, {
                    role: 'paste'
                }, {
                    role: 'delete'
                }, {
                    role: 'selectall'
                }
            ]
        }]));
    }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
