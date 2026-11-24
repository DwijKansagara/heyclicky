const statusBadge = document.getElementById('statusBadge');
const statusDesc = document.getElementById('statusDesc');
const btnStop = document.getElementById('btnStop');

function updateUI() {
  chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (res) => {
    if (!res) return;
    if (res.isConnected) {
      if (statusBadge) {
        statusBadge.textContent = 'CONNECTED';
        statusBadge.className = 'status-badge status-connected';
      }
      if (statusDesc) {
        statusDesc.textContent = 'Bridge active with HeyClicky Windows app. Ready for screen & page tasks.';
      }
    } else {
      if (statusBadge) {
        statusBadge.textContent = 'STANDBY';
        statusBadge.className = 'status-badge status-disconnected';
      }
      if (statusDesc) {
        statusDesc.textContent = 'Launch HeyClicky desktop app on Windows to connect.';
      }
    }

    if (btnStop) {
      btnStop.style.display = res.hasActiveTasks ? 'block' : 'none';
    }
  });
}

btnStop?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'STOP_TASKS' }, () => {
    updateUI();
  });
});

updateUI();
setInterval(updateUI, 2000);
