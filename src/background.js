// Set a default URL upon installation if none is set
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get({ newTabURL: "https://www.example.com" }, (items) => {
      chrome.storage.sync.set({ newTabURL: items.newTabURL });
    });
  });
  
  // Track which tabs have been redirected to avoid repeated redirection
  let redirectedTabs = new Set();
  
  // Redirect new blank tabs to the saved URL only once per tab
  chrome.tabs.onCreated.addListener((tab) => {
    chrome.storage.sync.get("newTabURL", (data) => {
      const url = data.newTabURL || "https://www.example.com";
      if (tab.pendingUrl === "about:newtab" || tab.url === "about:newtab") {
        // Update tab to the saved URL and track it
        chrome.tabs.update(tab.id, { url: url }, () => {
          redirectedTabs.add(tab.id);
        });
      }
    });
  });
  
  // Clear the URL bar by switching to about:blank after the target URL loads with a delay
  chrome.webNavigation.onCompleted.addListener((details) => {
    // Check if the tab has been redirected and matches the intended URL
    chrome.storage.sync.get("newTabURL", (data) => {
      const targetUrl = data.newTabURL || "https://www.example.com";
      if (details.url === targetUrl && redirectedTabs.has(details.tabId)) {
        // Add a delay before switching to about:blank
        setTimeout(() => {
          chrome.tabs.update(details.tabId, { url: "about:blank" });
          redirectedTabs.delete(details.tabId); // Prevent further changes for this tab
        }, 1000); // Adjust the delay (in milliseconds) if necessary
      }
    });
  }, { url: [{ schemes: ["http", "https"] }] });
  
  // Cleanup tracking when a tab is closed
  chrome.tabs.onRemoved.addListener((tabId) => {
    redirectedTabs.delete(tabId);
  });
  