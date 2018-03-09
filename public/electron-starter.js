const electron = require('electron');
const { app, BrowserWindow, Tray, ipcMain, Menu, MenuItem, shell } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

// add menu for inspection
require('electron-context-menu')({
  prepend: (params, browserWindow) => [{
    label: 'Rainbow',
    // Only show it when right-clicking images
    visible: params.mediaType === 'image'
  }]
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 610,
    height: 413,
    nodeIntegration: false,
    contextIsolation: true,
    webPreferences: {
      webSecurity: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  let forceQuite = false;

  app.on('before-quit', () => forceQuite = true);

  mainWindow.on('close', function (e) {
    console.log('close it', forceQuite);
    if (forceQuite) {
      mainWindow = null;
      return;
    }
    else if (mainWindow) {
      console.log('should not be here');
      e.preventDefault();
      mainWindow.hide();
    }
  });

  const tray = new Tray(path.join(__dirname, './img-starter.png'));
  tray.on('click', (_, bounds) => {
    mainWindow.show()
  })
  const trayImagePath = app.getPath('userData') + '/tray.png';
  ipcMain.on('msg', function(event, params) {
    if (params.type === 'tray') {
      try {
        tray.setImage(trayImagePath);
      } catch(err) {console.error(err);}
    }
    if (params.type === 'updateVersion') {
      forceQuite = true;
      autoUpdater.quitAndInstall();
    }
    if (params.type === 'quite') {
      forceQuite = true;
    }
  });

  // menu
  Menu.setApplicationMenu(menu);

  // updater
  if (!isDev) {
    autoUpdater.checkForUpdates();
    setInterval(() => autoUpdater.checkForUpdates(), 1 * 60 * 60 * 1000); //check each hour
  }

  //dev tools
  if (isDev) mainWindow.webContents.openDevTools()
  else if (app.dock && app.dock.hide) app.dock.hide()
}

// single instance
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
  return;
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

// MENU
const template = [
{
  label: 'Edit',
  submenu: [
    {role: 'undo'},
    {role: 'redo'},
    {type: 'separator'},
    {role: 'cut'},
    {role: 'copy'},
    {role: 'paste'},
    {role: 'pasteandmatchstyle'},
    {role: 'delete'},
    {role: 'selectall'}
  ]
},
{
  label: 'View',
  submenu: [
    {role: 'reload'},
    {role: 'toggledevtools'},
    {type: 'separator'},
    {role: 'resetzoom'},
    {role: 'zoomin'},
    {role: 'zoomout'},
    {type: 'separator'},
    {role: 'togglefullscreen'}
  ]
},
{
  role: 'window',
  submenu: [
    {role: 'minimize'},
    {role: 'close'}
  ]
},
{
  role: 'help',
  submenu: [
    {
      label: 'Learn More',
      click () { require('electron').shell.openExternal('https://stockstalk.club?source=app') }
    }
  ]
}
]

if (process.platform === 'darwin') {
template.unshift({
  label: app.getName(),
  submenu: [
    {role: 'about'},
    {type: 'separator'},
    {role: 'services', submenu: []},
    {type: 'separator'},
    {role: 'hide'},
    {role: 'hideothers'},
    {role: 'unhide'},
    {type: 'separator'},
    {role: 'quit'}
  ]
})

// Edit menu
template[1].submenu.push(
  {type: 'separator'},
  {
    label: 'Speech',
    submenu: [
      {role: 'startspeaking'},
      {role: 'stopspeaking'}
    ]
  }
)

// Window menu
template[3].submenu = [
  {role: 'close'},
  {role: 'minimize'},
  {role: 'zoom'},
  {type: 'separator'},
  {role: 'front'}
]
}

const menu = Menu.buildFromTemplate(template)


// auto update
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  console.log('FML');
  console.log(ev, err);
  sendStatusToWindow(':( ' + err);
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('Download progress...');
})

autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install now');
  forceQuite = true;
  mainWindow.webContents.send('newVersion');
  // autoUpdater.quitAndInstall();
})

function sendStatusToWindow(text) {
  console.log(text);
  mainWindow.webContents.send('message', text);
}

