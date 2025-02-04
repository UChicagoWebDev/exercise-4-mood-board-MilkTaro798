const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  clearResults();
  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const searchTerm = document.getElementById('searchInput').value;
  const queryURL = `${bing_api_endpoint}?q=${encodeURIComponent(searchTerm)}`;

  let request = new XMLHttpRequest();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  
  request.open("GET", queryURL, true);
  request.responseType = "json";
  request.onload = handleResponse;
  request.onerror = handleError;
  request.ontimeout = handleTimeout; 

  
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  // TODO: Send the request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function clearResults() {
  document.getElementById("resultsImageContainer").innerHTML = "";
}

function handleError() {
  console.error('Network Error');
}

function handleTimeout() {
  console.error('Request Timeout');
}

function handleResponse() {
  if (this.status === 200) {
    const response = this.response;
    if (response.value && response.value.length > 0) {
      const fragment = document.createDocumentFragment();
      response.value.forEach(imageResult => {
        fragment.appendChild(createImageElement(imageResult));
      });
      document.getElementById("resultsImageContainer").appendChild(fragment);
    }
  } else {
    console.error('Request failed', this.status);
  }
}

function createImageElement(imageResult) {
  let imgElem = document.createElement("img");
  imgElem.src = imageResult.thumbnailUrl;
  let divElem = document.createElement("div");
  divElem.className = "resultImage";
  divElem.appendChild(imgElem);
  imgElem.addEventListener("click", () => addToMoodBoard(imageResult.contentUrl));
  return divElem;
}

function addToMoodBoard(imageUrl) {
  let imgElem = document.createElement("img");
  imgElem.src = imageUrl;
  let divElem = document.createElement("div");
  divElem.className = "savedImage";
  divElem.appendChild(imgElem);
  document.getElementById("board").appendChild(divElem);
}

let suggestions = document.querySelectorAll(".suggestion");
suggestions.forEach(function(suggestion) {
  suggestion.onclick = function() {
    document.getElementById("searchInput").value = this.innerText;
    runSearch();
  };
});

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});