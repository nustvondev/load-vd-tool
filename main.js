const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const VIDEO_FILTERS = [
  { name: 'Video Files', extensions: ['mp4', 'mov', 'mkv', 'avi', 'flv', 'webm'] },
  { name: 'All Files', extensions: ['*'] }
];

const ICON_FILTERS = [
  { name: 'Image Files', extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'] },
  { name: 'All Files', extensions: ['*'] }
];

let dashboardWindow = null;
let videoWindow = null;

const createDashboardWindow = () => {
  dashboardWindow = new BrowserWindow({
    width: 600,
    height: 700,
    minWidth: 500,
    minHeight: 600,
    resizable: true,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload-dashboard.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null);
  dashboardWindow.loadFile('dashboard.html');

  // Uncomment để mở DevTools cho dashboard
  // dashboardWindow.webContents.openDevTools();

  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
    // Close video window if dashboard is closed
    if (videoWindow && !videoWindow.isDestroyed()) {
      videoWindow.close();
    }
  });
};

const createVideoWindow = (fileUrl) => {
  // Close existing video window if any
  if (videoWindow && !videoWindow.isDestroyed()) {
    videoWindow.close();
  }

  videoWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    resizable: false,
    fullscreenable: false,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    frame: false,
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload-video.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null);
  
  // Prevent background throttling - keep video playing even when window loses focus
  videoWindow.webContents.setBackgroundThrottling(false);
  
  videoWindow.loadFile('video.html');

  // Send video URL after window is ready
  videoWindow.webContents.once('did-finish-load', () => {
    if (fileUrl) {
      videoWindow.webContents.send('video-command', {
        command: 'load-video',
        url: fileUrl
      });
    }
  });

  videoWindow.on('closed', () => {
    videoWindow = null;
    // Notify dashboard
    if (dashboardWindow && !dashboardWindow.isDestroyed()) {
      dashboardWindow.webContents.send('video-window-closed');
    }
  });
};

app.whenReady().then(() => {
  createDashboardWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createDashboardWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('open-video-dialog', async () => {
  const window = dashboardWindow || BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(window, {
    title: 'Chọn tệp video',
    properties: ['openFile'],
    filters: VIDEO_FILTERS
  });

  if (canceled || !filePaths?.length) {
    return null;
  }

  return pathToFileURL(filePaths[0]).href;
});

ipcMain.handle('open-icon-dialog', async () => {
  const window = dashboardWindow || BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(window, {
    title: 'Chọn icon',
    properties: ['openFile'],
    filters: ICON_FILTERS
  });

  if (canceled || !filePaths?.length) {
    return null;
  }

  return pathToFileURL(filePaths[0]).href;
});

ipcMain.on('open-video-window', (event, fileUrl) => {
  createVideoWindow(fileUrl);
});

ipcMain.on('send-video-command', (event, data) => {
  if (videoWindow && !videoWindow.isDestroyed()) {
    videoWindow.webContents.send('video-command', data);
  }
});

ipcMain.on('resize-video-window', (event, { width, height }) => {
  // Resize window: height fixed at 1080px, width scales with video aspect ratio
  if (videoWindow && !videoWindow.isDestroyed() && width > 0 && height > 0) {
    videoWindow.setSize(width, height, true);
    videoWindow.center();
  }
});

ipcMain.on('video-window-ready', () => {
  // Video window is ready
});
