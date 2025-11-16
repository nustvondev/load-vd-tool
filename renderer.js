let videoElement;

const TRANSFORM_STEP = 0.05;
const MIN_SCALE = 0.2;
const MAX_SCALE = 5;

let zoom = 1;
let flipH = false;
let flipV = false;

const applyTransform = () => {
  if (!videoElement) return;
  const scaleX = (flipH ? -1 : 1) * zoom;
  const scaleY = (flipV ? -1 : 1) * zoom;
  videoElement.style.transform = `scale(${scaleX}, ${scaleY})`;
};

const setVideoSource = (fileUrl) => {
  if (!fileUrl || !videoElement) {
    return;
  }

  videoElement.src = fileUrl;
  videoElement.load();
  const playPromise = videoElement.play();
  if (playPromise?.catch) {
    playPromise.catch((err) => {
      console.error('Lỗi phát video:', err);
    });
  }
};

const handleKeyPress = (event) => {
  const key = event.key.toLowerCase();

  switch (key) {
    case 'arrowup':
      event.preventDefault();
      zoom = Math.min(MAX_SCALE, zoom + TRANSFORM_STEP);
      applyTransform();
      break;
    case 'arrowdown':
      event.preventDefault();
      zoom = Math.max(MIN_SCALE, zoom - TRANSFORM_STEP);
      applyTransform();
      break;
    case 'h':
      flipH = !flipH;
      applyTransform();
      break;
    case 'v':
      flipV = !flipV;
      applyTransform();
      break;
    case 'r':
      zoom = 1;
      flipH = false;
      flipV = false;
      applyTransform();
      break;
    case 'f':
      window.videoAPI.toggleFullScreen();
      break;
    case 'o':
      window.videoAPI.selectVideo().then(setVideoSource);
      break;
    default:
      break;
  }
};

window.addEventListener('DOMContentLoaded', () => {
  videoElement = document.getElementById('player');
  
  if (!videoElement) {
    console.error('Không tìm thấy video element!');
    return;
  }

  if (!window.videoAPI) {
    console.error('VideoAPI chưa sẵn sàng!');
    return;
  }

  window.videoAPI.onLoadVideo(setVideoSource);
  window.videoAPI.notifyReady();
  applyTransform();
  window.addEventListener('keydown', handleKeyPress);

  // Thêm event listener để đảm bảo video phát khi load xong
  videoElement.addEventListener('loadeddata', () => {
    videoElement.play().catch((err) => {
      console.error('Lỗi tự động phát:', err);
    });
  });
});

