// Listen for a click on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentUrl = tabs[0].url;
    
        // send a message to content.js to get the text content of the page
        chrome.runtime.sendMessage({action: "get-text-msg"}, function(response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
    
          // extract the text content from the response and include it in the API request
          console.log(response);
          var requestData = {
            text: response.text || ""
          };
    
          var queryString = Object.keys(requestData).map(key => key + '=' + encodeURIComponent(requestData[key])).join('&');
          var requestUrl = "https://z5ufods3de.execute-api.ap-south-1.amazonaws.com/newstage/text-summary?" + queryString;
    
          // Remove the body parameter from the fetch call
          fetch(requestUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(data => {
            if (data.summary) {
              var summary = data.summary;
              var summaryLink = encodeURI("<a href='" + currentUrl + "' target='_blank'>Original Link</a>");
              var shareText = "Link: " + currentUrl + "\nSummary: " + summary;
              var shareLink = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText);
              document.getElementById("summary").innerHTML = summary;
              document.getElementById("link").innerHTML = summaryLink;
              document.getElementById("share").href = shareLink;
            } else {
              document.getElementById("summary").innerHTML = "Sorry, no summary available.";
            }
          })
          .catch(error => {
            document.getElementById("summary").innerHTML = "Sorry, an error occurred.";
          });
        });
      });
  });
  
  // Listen for messages from content.js
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "open_new_tab") {
      chrome.tabs.create({"url": request.url});
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //var currentUrl = tabs[0].url;
    
        // send a message to content.js to get the text content of the page
        chrome.runtime.sendMessage({action: "get-text-msg"}, function(response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
    
          // extract the text content from the response and include it in the API request
          console.log(response);
          var requestData = {
            text: response.text || ""
          };
    
          var queryString = Object.keys(requestData).map(key => key + '=' + encodeURIComponent(requestData[key])).join('&');
          var requestUrl = "https://z5ufods3de.execute-api.ap-south-1.amazonaws.com/newstage/text-summary?" + queryString;
    
          // Remove the body parameter from the fetch call
          fetch(requestUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(data => {
            if (data.summary) {
              var summary = data.summary;
              var summaryLink = encodeURI("<a href='" + "currentUrl" + "' target='_blank'>Original Link</a>");
              var shareText = "Link: " + "currentUrl" + "\nSummary: " + summary;
              var shareLink = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText);
              document.getElementById("summary").innerHTML = summary;
              document.getElementById("link").innerHTML = summaryLink;
              document.getElementById("share").href = shareLink;
            } else {
              document.getElementById("summary").innerHTML = "Sorry, no summary available.";
            }
          })
          .catch(error => {
            document.getElementById("summary").innerHTML = "Sorry, an error occurred.";
          });
        });
      });
  });
  
  // Handle errors
//   chrome.runtime.lastError.addListener(function(error) {
//     console.error(error);
//   });