const timeTracker = {};

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function sendNotification(domain) {
  window.alert(`You have been using ${domain} for more than an hour`);
}

function resetTimeTracker() {
  Object.keys(timeTracker).forEach(key => delete timeTracker[key]);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'clearData') {
    resetTimeTracker();
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  const url = new URL(tab.url);
  const domain = url.hostname;
  
  if (!timeTracker[domain]) {
    timeTracker[domain] = {
      startTime: Date.now(),
      totalSeconds: 0,
      notified: false
    };
  }
});

setInterval(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;
      
      if (timeTracker[domain]) {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - timeTracker[domain].startTime) / 1000);
        timeTracker[domain].totalSeconds = elapsedSeconds;
        
        if (elapsedSeconds >= 3600 && !timeTracker[domain].notified) {
          sendNotification(domain);
          timeTracker[domain].notified = true;
        }
        
        chrome.storage.local.set({ timeData: timeTracker });
      }
    }
  });
}, 1000);