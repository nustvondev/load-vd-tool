let videoElement;
let zoom = 1;
let flipH = false;
let flipV = false;
let deviceHeight = 1080;

const applyTransform = () => {
  if (!videoElement) return;
  const scaleX = (flipH ? -1 : 1) * zoom;
  const scaleY = (flipV ? -1 : 1) * zoom;
  videoElement.style.transform = `scale(${scaleX}, ${scaleY})`;
};

const setVideoSource = (url) => {
  if (!url || !videoElement) {
    return;
  }

  videoElement.src = url;
  videoElement.load();
  const playPromise = videoElement.play();
  if (playPromise?.catch) {
    playPromise.catch((err) => {
      console.error('Lỗi phát video:', err);
    });
  }
};

// Listen for commands from dashboard
window.videoAPI.onCommand((data) => {
  const { command, ...params } = data;

  switch (command) {
    case 'load-video':
      if (params.url) {
        setVideoSource(params.url);
      }
      break;

    case 'transform':
      if (params.zoom !== undefined) zoom = params.zoom;
      if (params.flipH !== undefined) flipH = params.flipH;
      if (params.flipV !== undefined) flipV = params.flipV;
      applyTransform();
      break;

    case 'set-loop':
      if (videoElement && params.loop !== undefined) {
        videoElement.loop = params.loop;
      }
      break;

    case 'show-icon':
      if (params.url) {
        showIconWithEffect(params.url);
      }
      break;

    default:
      break;
  }
});

// Show icon with beautiful effects
const showIconWithEffect = (iconUrl) => {
  const overlay = document.getElementById('icon-overlay');
  if (!overlay) return;

  // Create icon element
  const icon = document.createElement('img');
  icon.src = iconUrl;
  icon.className = 'icon-element';
  
  // Random position avoiding center (30-70% area)
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const avoidWidth = windowWidth * 0.4; // 40% width to avoid
  const avoidHeight = windowHeight * 0.4; // 40% height to avoid
  
  let x, y;
  let attempts = 0;
  do {
    x = Math.random() * (windowWidth - 150);
    y = Math.random() * (windowHeight - 150);
    attempts++;
  } while (
    attempts < 50 &&
    x > centerX - avoidWidth / 2 &&
    x < centerX + avoidWidth / 2 &&
    y > centerY - avoidHeight / 2 &&
    y < centerY + avoidHeight / 2
  );
  
  icon.style.left = x + 'px';
  icon.style.top = y + 'px';
  
  // Random size
  const size = 80 + Math.random() * 70; // 80-150px
  icon.style.width = size + 'px';
  icon.style.height = 'auto';
  
  // Random appear effect
  const appearEffects = [
    'appear-rotate', 'appear-zoom', 'appear-fade', 
    'appear-slide-down', 'appear-slide-up', 'appear-slide-left', 'appear-slide-right',
    'appear-bounce', 'appear-elastic', 'appear-flip', 
    'appear-spin', 'appear-blur'
  ];
  const randomAppear = appearEffects[Math.floor(Math.random() * appearEffects.length)];
  icon.style.animation = `${randomAppear} 1.5s ease-out forwards`;
  
  // Random effect - nhiều hiệu ứng đẹp
  const effects = [
    'bounce', 'pulse', 'rotate', 'fade', 
    'swing', 'shake', 'float', 'glow', 
    'zoom', 'slide', 'elastic', 'wobble', 
    'flip', 'sparkle', 'spin', 'heartbeat', 
    'wave', 'bounce-rotate'
  ];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  
  // Add to overlay
  overlay.appendChild(icon);
  
  // After appear animation, add continuous effect
  setTimeout(() => {
    icon.classList.add(randomEffect);
  }, 1500);
  
  // Random disappear effect after 5 seconds
  setTimeout(() => {
    if (icon.parentNode) {
      const disappearEffects = [
        'disappear-fade', 'disappear-zoom', 'disappear-rotate',
        'disappear-slide-up', 'disappear-slide-down', 'disappear-slide-left', 'disappear-slide-right',
        'disappear-bounce', 'disappear-spin', 'disappear-flip',
        'disappear-blur', 'disappear-shrink'
      ];
      const randomDisappear = disappearEffects[Math.floor(Math.random() * disappearEffects.length)];
      
      // Remove continuous effect and apply disappear
      icon.classList.remove(randomEffect);
      icon.style.animation = `${randomDisappear} 0.8s ease-out forwards`;
      
      setTimeout(() => {
        if (icon.parentNode) {
          icon.parentNode.removeChild(icon);
        }
      }, 800);
    }
  }, 5000);
};

// Resize window to fit video
const resizeToVideo = () => {
  if (!videoElement) return;
  
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  
  if (videoWidth > 0 && videoHeight > 0) {
    // Giữ chất lượng: không upscale quá kích thước gốc của video
    const maxAllowedHeight = Math.min(deviceHeight > 0 ? deviceHeight : 1080, videoHeight);
    const targetHeight = maxAllowedHeight;
    const scaledWidth = Math.round((videoWidth / videoHeight) * targetHeight);
    window.videoAPI.resizeWindow(scaledWidth, targetHeight);
  }
};

// Keep video playing when page visibility changes
const handleVisibilityChange = () => {
  if (!videoElement) return;
  
  if (document.hidden) {
    // Page is hidden, ensure video continues playing
    if (videoElement.paused) {
      videoElement.play().catch(err => {
        console.error('Lỗi phát video khi page hidden:', err);
      });
    }
  } else {
    // Page is visible, ensure video is playing
    if (videoElement.paused) {
      videoElement.play().catch(err => {
        console.error('Lỗi phát video khi page visible:', err);
      });
    }
  }
};

// Handle window focus/blur events
const handleWindowFocus = () => {
  if (!videoElement) return;
  if (videoElement.paused) {
    videoElement.play().catch(err => {
      console.error('Lỗi phát video khi window focus:', err);
    });
  }
};

const handleWindowBlur = () => {
  if (!videoElement) return;
  // Keep video playing even when window loses focus
  if (videoElement.paused) {
    videoElement.play().catch(err => {
      console.error('Lỗi phát video khi window blur:', err);
    });
  }
};

// Handle video pause events (may be triggered by browser)
const handleVideoPause = () => {
  if (!videoElement) return;
  
  // Don't allow automatic pausing - keep playing
  // Only pause if user explicitly pauses or video ends
  const wasPlaying = !videoElement.paused || videoElement.readyState >= videoElement.HAVE_FUTURE_DATA;
  
  // If video was playing and got paused automatically, resume it
  setTimeout(() => {
    if (videoElement.paused && videoElement.readyState >= videoElement.HAVE_CURRENT_DATA) {
      // Only resume if video is not at the end and should be looping
      if (!videoElement.ended) {
        videoElement.play().catch(err => {
          // Ignore errors when trying to auto-resume
        });
      }
    }
  }, 100);
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

  // Prevent automatic pausing when page is hidden
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Handle window focus/blur
  window.addEventListener('focus', handleWindowFocus);
  window.addEventListener('blur', handleWindowBlur);
  
  // Monitor video pause events
  videoElement.addEventListener('pause', handleVideoPause);

  // Listen for video metadata loaded to resize window
  videoElement.addEventListener('loadedmetadata', () => {
    resizeToVideo();
  });

  // Also resize when video source changes
  videoElement.addEventListener('loadeddata', () => {
    resizeToVideo();
  });

  // Ensure video plays even when loaded
  videoElement.addEventListener('canplay', () => {
    if (videoElement.paused) {
      videoElement.play().catch(err => {
        console.error('Lỗi phát video:', err);
      });
    }
  });

  // Notify ready
  window.videoAPI.notifyReady();
  applyTransform();

  // Lấy chiều cao thiết bị để resize theo màn hình
  if (typeof window.videoAPI.getDeviceHeight === 'function') {
    window.videoAPI.getDeviceHeight()
      .then((h) => {
        if (Number.isFinite(h) && h > 0) {
          deviceHeight = h;
          resizeToVideo();
        }
      })
      .catch(() => {});
  }
});

