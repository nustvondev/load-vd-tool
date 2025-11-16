let currentVideoUrl = null;
let currentIconUrl = null;
let zoom = 1;
let flipH = false;
let flipV = false;
let loop = true;
let hasVideoWindow = false;
let isLocked = false;

const TRANSFORM_STEP = 0.05;
const MIN_SCALE = 0.2;
const MAX_SCALE = 5;

// Elements
const btnSelectVideo = document.getElementById('btn-select-video');
const btnSelectIcon = document.getElementById('btn-select-icon');
const btnActivateIcon = document.getElementById('btn-activate-icon');
const btnFlipHorizontal = document.getElementById('btn-flip-horizontal');
const btnFlipVertical = document.getElementById('btn-flip-vertical');
const btnReset = document.getElementById('btn-reset');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnLock = document.getElementById('btn-lock');
const zoomValue = document.getElementById('zoom-value');
const chkLoop = document.getElementById('chk-loop');
const videoInfo = document.getElementById('video-info');
const iconInfo = document.getElementById('icon-info');

// Update zoom display
const updateZoomDisplay = () => {
  zoomValue.textContent = Math.round(zoom * 100) + '%';
};

// Send command to video window via main process
const sendVideoCommand = (command, data = {}) => {
  if (hasVideoWindow && !isLocked) {
    window.dashboardAPI.sendVideoCommand({ command, ...data });
  }
};

// Update UI lock state
const updateLockState = () => {
  const controls = [
    btnFlipHorizontal, btnFlipVertical, btnReset,
    btnZoomIn, btnZoomOut, chkLoop
  ];
  
  controls.forEach(control => {
    control.disabled = isLocked;
    if (control.style) {
      control.style.opacity = isLocked ? '0.5' : '1';
      control.style.cursor = isLocked ? 'not-allowed' : 'pointer';
    }
  });
  
  btnLock.textContent = isLocked ? '🔒 Mở Khóa' : '🔓 Khóa Cài đặt';
  btnLock.classList.toggle('locked', isLocked);
};

// Select video
btnSelectVideo.addEventListener('click', async () => {
  const fileUrl = await window.dashboardAPI.selectVideo();
  if (fileUrl) {
    currentVideoUrl = fileUrl;
    const fileName = fileUrl.split('/').pop().split('\\').pop();
    videoInfo.textContent = `Video đã chọn: ${fileName}`;
    
    // Open or update video window
    if (hasVideoWindow) {
      sendVideoCommand('load-video', { url: fileUrl });
    } else {
      window.dashboardAPI.openVideoWindow(fileUrl);
      hasVideoWindow = true;
    }
  }
});

// Flip horizontal
btnFlipHorizontal.addEventListener('click', () => {
  flipH = !flipH;
  sendVideoCommand('transform', { zoom, flipH, flipV });
  btnFlipHorizontal.style.background = flipH ? '#2d3748' : '#48bb78';
});

// Flip vertical
btnFlipVertical.addEventListener('click', () => {
  flipV = !flipV;
  sendVideoCommand('transform', { zoom, flipH, flipV });
  btnFlipVertical.style.background = flipV ? '#2d3748' : '#48bb78';
});

// Reset
btnReset.addEventListener('click', () => {
  zoom = 1;
  flipH = false;
  flipV = false;
  updateZoomDisplay();
  sendVideoCommand('transform', { zoom, flipH, flipV });
  btnFlipHorizontal.style.background = '#48bb78';
  btnFlipVertical.style.background = '#48bb78';
});

// Zoom in
btnZoomIn.addEventListener('click', () => {
  zoom = Math.min(MAX_SCALE, zoom + TRANSFORM_STEP);
  updateZoomDisplay();
  sendVideoCommand('transform', { zoom, flipH, flipV });
});

// Zoom out
btnZoomOut.addEventListener('click', () => {
  zoom = Math.max(MIN_SCALE, zoom - TRANSFORM_STEP);
  updateZoomDisplay();
  sendVideoCommand('transform', { zoom, flipH, flipV });
});

// Loop toggle
chkLoop.addEventListener('change', (e) => {
  loop = e.target.checked;
  sendVideoCommand('set-loop', { loop });
});

// Select icon
btnSelectIcon.addEventListener('click', async () => {
  const fileUrl = await window.dashboardAPI.selectIcon();
  if (fileUrl) {
    currentIconUrl = fileUrl;
    const fileName = fileUrl.split('/').pop().split('\\').pop();
    iconInfo.textContent = `Icon đã chọn: ${fileName}`;
    btnActivateIcon.disabled = false;
  }
});

// Activate icon
btnActivateIcon.addEventListener('click', () => {
  if (currentIconUrl && hasVideoWindow) {
    sendVideoCommand('show-icon', { url: currentIconUrl });
  }
});

// Lock/Unlock
btnLock.addEventListener('click', () => {
  isLocked = !isLocked;
  updateLockState();
});

// Listen for video window closed
window.dashboardAPI.onVideoWindowClosed(() => {
  hasVideoWindow = false;
});

// Initialize
updateZoomDisplay();
updateLockState();

