let videoContainer = null;
let dragHandle = null;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

const videoUrls = {
  carpet: chrome.runtime.getURL('videos/carpet.mp4'),
  subway: chrome.runtime.getURL('videos/subway.mp4'),
  slimes1: chrome.runtime.getURL('videos/slimes1.mp4'),
};

function createVideoPlayer(videoType) {
  if (videoContainer) {
    document.body.removeChild(videoContainer);
  }

  videoContainer = document.createElement('div');
  videoContainer.className = 'anti-sdvg-video-container';
  videoContainer.style.left = '50px';
  videoContainer.style.top = '50px';

  // Create drag handle
  dragHandle = document.createElement('div');
  dragHandle.className = 'anti-sdvg-drag-handle';

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'anti-sdvg-close-button';
  closeButton.innerHTML = '×';
  closeButton.onclick = function () {
    document.body.removeChild(videoContainer);
    videoContainer = null;
  };
  dragHandle.appendChild(closeButton);

  const video = document.createElement('video');
  video.src = videoUrls[videoType];
  video.controls = true;
  video.autoplay = true;
  video.loop = true;

  videoContainer.appendChild(dragHandle);
  videoContainer.appendChild(video);
  document.body.appendChild(videoContainer);

  // Add drag functionality
  dragHandle.addEventListener('mousedown', dragStart, false);
  document.addEventListener('mousemove', drag, false);
  document.addEventListener('mouseup', dragEnd, false);
}

function dragStart(e) {
  if (e.button === 0) { // Only left mouse button
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    isDragging = true;

    // Prevent text selection during drag
    e.preventDefault();
  }
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();

    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, videoContainer);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.left = xPos + 'px';
  el.style.top = yPos + 'px';
}

function dragEnd(e) {
  isDragging = false;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'playVideo') {
    createVideoPlayer(request.video);
  }
}); 