function updatePopup() {
  chrome.storage.local.get(['timeData'], (result) => {
    const timeList = document.getElementById('timeList');
    timeList.innerHTML = '';
    
    if (result.timeData) {
      Object.entries(result.timeData).forEach(([domain, data]) => {
        const div = document.createElement('span');
        div.className = 'site-time';
        
        const time = formatTime(data.totalSeconds);
        // let url='';
        let url = `https://${domain}/favicon.ico`;
        div.innerHTML = `
          <img src="${url}" class="logo">
          <span class="domain">${domain}</span>
          <span class="time">${time}</span>
        `;
        
        timeList.appendChild(div);
      });
    } else {
      timeList.innerHTML = '<center><p>No websites tracked yet</p></center>';
    }
  });
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function clearData() {
  if (confirm('Are you sure you want to clear all tracking data?')) {
    chrome.storage.local.clear(() => {
      chrome.runtime.sendMessage({ action: 'clearData' });
      updatePopup();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updatePopup();
  document.getElementById('clearData').addEventListener('click', clearData);
});

setInterval(updatePopup, 1000);