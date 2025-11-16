const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('videoAPI', {
  onCommand: (callback) => {
    ipcRenderer.on('video-command', (_event, data) => {
      callback(data);
    });
  },
  resizeWindow: (width, height) => {
    ipcRenderer.send('resize-video-window', { width, height });
  },
  notifyReady: () => ipcRenderer.send('video-window-ready')
});

