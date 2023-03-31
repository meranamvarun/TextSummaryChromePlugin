const getTextFromPage = () => {
    const getSelectedText = () => {
      const selectedText = window.getSelection().toString().trim();
      return selectedText.length > 0 ? selectedText : null;
    };
  
    const getTextInViewport = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (!node.parentElement) {
              return NodeFilter.FILTER_SKIP;
            }
            const clientRects = node.parentElement.getClientRects();
            if (clientRects.length === 0) {
              return NodeFilter.FILTER_SKIP;
            }
  
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
  
            for (const rect of clientRects) {
              if (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= windowHeight &&
                rect.right <= windowWidth
              ) {
                return NodeFilter.FILTER_ACCEPT;
              }
            }
  
            return NodeFilter.FILTER_SKIP;
          },
        },
        false
      );
  
      const textNodes = [];
      let currentNode;
  
      while ((currentNode = walker.nextNode())) {
        textNodes.push(currentNode);
      }
  
      return textNodes
        .map((node) => node.textContent.trim().replace(/\n|\t/g, ' '))
        .filter((text) => text.length > 0)
        .join(" ");
    };
  
    const selectedText = getSelectedText();
    return selectedText ? selectedText : getTextInViewport();
  };
  
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (msg) => {
      if (msg.action === "getText") {
        const text = getTextFromPage();
        port.postMessage({ text: text });
      }
    });
  });
  