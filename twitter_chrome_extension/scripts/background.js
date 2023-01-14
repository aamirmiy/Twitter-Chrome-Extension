// Listen for messages from the index script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === "POST") {
        // Prepare the POST request
        fetch(request.url, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(request.data),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(data => sendResponse(data))
          .catch(error => console.error(error));
      }
      return true;
    });