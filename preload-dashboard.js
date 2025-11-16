const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dashboardAPI', {
  selectVideo: () => ipcRenderer.invoke('open-video-dialog'),
  selectIcon: () => ipcRenderer.invoke('open-icon-dialog'),
  openVideoWindow: (fileUrl) => ipcRenderer.send('open-video-window', fileUrl),
  sendVideoCommand: (data) => ipcRenderer.send('send-video-command', data),
  onVideoWindowClosed: (callback) => {
    ipcRenderer.on('video-window-closed', () => {
      callback();
    });
  }
});

