document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("newTabURL", (data) => {
      document.getElementById("newTabURL").value = data.newTabURL || "https://www.example.com";
    });
  
    document.getElementById("save").addEventListener("click", () => {
      const newTabURL = document.getElementById("newTabURL").value;
      chrome.storage.sync.set({ newTabURL }, () => {
        alert("New tab URL saved!");
      });
    });
  });
  