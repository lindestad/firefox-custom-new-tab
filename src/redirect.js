document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("newTabURL", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving newTabURL:", chrome.runtime.lastError);
        return;
      }
  
      const url = data.newTabURL || "https://www.example.com"; // Default URL if none is set
  
      if (url && url.startsWith("http")) {
        // Redirect to the new URL
        window.location.href = url;
  
        // Use a small delay to ensure the page has redirected before clearing the URL
        setTimeout(() => {
          // Use history.pushState to clear the URL bar
          history.pushState(null, "", "/");
        }, 500); // Adjust delay if necessary
      } else {
        console.error("Invalid URL:", url);
      }
    });
  });
  