const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('videoAPI', {
  selectVideo: () => ipcRenderer.invoke('open-video-dialog'),
  toggleFullScreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  onLoadVideo: (callback) => {
    ipcRenderer.on('load-video', (_event, fileUrl) => {
      callback(fileUrl);
    });
  },
  notifyReady: () => ipcRenderer.send('renderer-ready')
});

