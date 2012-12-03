/**
* Fetch the f7u12 subreddit CSS
*/
function fetchRageCSS(callback) {
  console.log("fetching f7u12 css");
  //This points to the f7u12 CSS file
  var cssLive = "http://www.reddit.com/r/metarage/stylesheet.css";

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      console.log("fetched f7u12 css " + xhr.status);
      if (xhr.status == 200) {
        console.log("fetching aa css");
        var othercss = "http://www.reddit.com/r/AdviceAnimals/stylesheet.css";
        var xhr2 = new XMLHttpRequest();
        xhr2.onreadystatechange = function(data) {
          if (xhr2.readyState == 4) {
            console.log("fetched aa css " + xhr2.status);
            if (xhr2.status == 200) {
            callback(xhr.responseText + "\n" + xhr2.responseText);
            } else {
            callback(null);
            }
          }
        }
        xhr2.open('GET', othercss, true);
        xhr2.send();
      } else {
        callback(null);
      }
    }
  }

  xhr.open('GET', cssLive, true);
  xhr.send();
};

/**
* Handles data sent via chrome.extension.sendRequest().
* @param request Object Data sent in the request.
* @param sender Object Origin of the request.
* @param callback Function The method to call when the request completes.
*/
function onMessage(request, sender, callback) {
  console.log("got request");
  if (request.action == 'fetchRageCSS') {
    fetchRageCSS(callback);
  }
  return true;
};

// Wire up the listener.
chrome.extension.onMessage.addListener(onMessage);
console.log("listening");
