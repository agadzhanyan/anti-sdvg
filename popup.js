document.getElementById('playButton').addEventListener('click', function() {
  const videoSelect = document.getElementById('videoSelect');
  const selectedVideo = videoSelect.value;
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'playVideo',
      video: selectedVideo
    });
  });
}); 