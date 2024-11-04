chrome.runtime.onInstalled.addListener(() => {
    // Set default URL if none is set
    chrome.storage.sync.get({ newTabURL: "https://www.example.com" }, (items) => {
      chrome.storage.sync.set({ newTabURL: items.newTabURL });
    });
  });
  
  chrome.tabs.onCreated.addListener((tab) => {
    chrome.storage.sync.get("newTabURL", (data) => {
      chrome.tabs.update(tab.id, { url: data.newTabURL });
    });
  });
  
  chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.startsWith("http")) {
      chrome.tabs.executeScript(details.tabId, {
        code: "window.history.pushState({}, '', '/');"
      });
    }
  }, { url: [{ hostSuffix: "" }] });
  