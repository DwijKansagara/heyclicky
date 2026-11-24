/**
 * HeyClicky Companion Extension - Background Service Worker
 * Manages isolated task tab groups and secure WebSocket bridge with Desktop app
 */

const WS_PORT = 49152;
let socket: WebSocket | null = null;
let isConnected = false;
let activeTaskGroupId: number | null = null;

function connectToDesktopApp() {
  try {
    socket = new WebSocket(`ws://127.0.0.1:${WS_PORT}/extension`);

    socket.onopen = () => {
      isConnected = true;
      console.log('[HeyClicky Extension] Connected to Windows desktop app');
      chrome.action.setBadgeText({ text: 'ON' });
      chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    };

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        handleDesktopMessage(message);
      } catch (err) {
        console.error('[HeyClicky Extension] Failed to parse desktop message', err);
      }
    };

    socket.onclose = () => {
      isConnected = false;
      chrome.action.setBadgeText({ text: 'OFF' });
      chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
      // Retry connection every 4 seconds
      setTimeout(connectToDesktopApp, 4000);
    };

    socket.onerror = () => {
      socket?.close();
    };
  } catch (err) {
    setTimeout(connectToDesktopApp, 4000);
  }
}

connectToDesktopApp();

async function handleDesktopMessage(message: any) {
  switch (message.action) {
    case 'CREATE_TASK_TAB':
      await createIsolatedTaskTab(message.url);
      break;
    case 'EXTRACT_PAGE_CONTENT':
      await extractActiveTabContent(message.requestId);
      break;
    case 'STOP_ALL_TASKS':
      await stopAllTaskTabs();
      break;
    default:
      console.log('[HeyClicky Extension] Unknown action:', message.action);
  }
}

/**
 * Creates an isolated tab in a dedicated "HeyClicky Tasks" tab group
 */
async function createIsolatedTaskTab(url: string) {
  const tab = await chrome.tabs.create({ url, active: false });
  if (!tab.id) return;

  if (activeTaskGroupId === null) {
    activeTaskGroupId = await chrome.tabs.group({ tabIds: [tab.id] });
    await chrome.tabGroups.update(activeTaskGroupId, {
      title: 'HeyClicky Tasks',
      color: 'orange',
      collapsed: false,
    });
  } else {
    try {
      await chrome.tabs.group({ tabIds: [tab.id], groupId: activeTaskGroupId });
    } catch {
      // Group was closed by user, recreate it
      activeTaskGroupId = await chrome.tabs.group({ tabIds: [tab.id] });
      await chrome.tabGroups.update(activeTaskGroupId, {
        title: 'HeyClicky Tasks',
        color: 'orange',
      });
    }
  }
}

/**
 * Extracts sanitized readable content from current tab for whole-document context
 */
async function extractActiveTabContent(requestId: string) {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab || !activeTab.id || activeTab.incognito) {
    sendToDesktop({
      type: 'PAGE_CONTENT_RESULT',
      requestId,
      error: 'Cannot extract from incognito or empty tab',
    });
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(activeTab.id, { action: 'GET_SANITIZED_DOM' });
    sendToDesktop({
      type: 'PAGE_CONTENT_RESULT',
      requestId,
      data: response,
    });
  } catch (err: any) {
    sendToDesktop({
      type: 'PAGE_CONTENT_RESULT',
      requestId,
      error: err.message || 'Content script unavailable',
    });
  }
}

async function stopAllTaskTabs() {
  if (activeTaskGroupId !== null) {
    try {
      const tabs = await chrome.tabs.query({ groupId: activeTaskGroupId });
      for (const t of tabs) {
        if (t.id) await chrome.tabs.remove(t.id);
      }
      activeTaskGroupId = null;
    } catch {
      activeTaskGroupId = null;
    }
  }
  sendToDesktop({ type: 'TASKS_STOPPED' });
}

function sendToDesktop(payload: any) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

// Listen for popup messages
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'GET_STATUS') {
    sendResponse({ isConnected, hasActiveTasks: activeTaskGroupId !== null });
  } else if (msg.action === 'STOP_TASKS') {
    stopAllTaskTabs().then(() => sendResponse({ success: true }));
    return true;
  }
});
