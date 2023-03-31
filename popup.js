const summaryBtn = document.getElementById('summary-btn');
const copyBtn = document.getElementById('copy-btn');
const closeBtn = document.getElementById('close-btn');
const summaryText = document.getElementById('summary-text');

summaryBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ['content.js']
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      setTimeout(() => {
        const port = chrome.tabs.connect(tab.id);
        port.postMessage({ action: "getText" });
        
        port.onMessage.addListener(async (response) => {
          const summary = await fetchSummaryFromAPI(response.text);
          summaryText.value = summary;
          summaryText.hidden = false;
          summaryBtn.hidden = true;
          copyBtn.hidden = false;
        });        
      }, 500);
    }
  );
});

copyBtn.addEventListener('click', () => {
  summaryText.select();
  document.execCommand('copy');
});

closeBtn.addEventListener('click', () => {
  window.close();
});

async function fetchSummaryFromAPI(text) {
  const API_URL = "https://z5ufods3de.execute-api.ap-south-1.amazonaws.com/newstage/text-summary";
  console.log("Sending request to API with text:", text);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Received response from API:", data);
    return data.summary;
  } else {
    console.error("Failed to fetch summary");
    throw new Error('Failed to fetch summary');
  }
}
