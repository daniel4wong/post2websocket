// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const messagesList = document.getElementById("messages");
const messagesForm = document.querySelector("form");
messagesForm.classList.add("disabled");

// a helper function that creates a list item for a given message
function appendNewMessage(message) {
  const newListItem = document.createElement("li");
  newListItem.innerHTML = message;
  messagesList.insertBefore(newListItem, messagesList.childNodes[0]);
}

// fetch the initial list of messages
fetch("/messages")
  .then(response => response.json()) // parse the JSON from the server
  .then(messages => {
    // remove the loading text
    messagesList.firstElementChild.remove();
  
    // iterate through every message and add it to our page
    messages.forEach((message) => {
      appendNewMessage("<span>server:</span> " + message);
    });
  });

  // listen for the form to be submitted and add a new message when it is
  messagesForm.addEventListener("submit", event => {
    // stop our form submission from refreshing the page
    event.preventDefault();

    let newMessage = messagesForm.elements.message.value;

    appendNewMessage("<span>local:</span> " + newMessage);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      messagesForm.reset();
      messagesForm.querySelector("input").focus();
    };
    xhr.open("POST", messagesForm.action);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ message: newMessage }));
  });

  (function() {
    var urlParams = new URLSearchParams(window.location.search);
    var myParam = urlParams.get("scan");   
    
    appendNewMessage("<span>local:</span> init socket");
    var socket = new WebSocket("ws://localhost:8080");
    socket.onopen = function(evt) {
      messagesForm.classList.remove("disabled");
      appendNewMessage("<span>local:</span> open socket");
      if (myParam) {
        appendNewMessage("<span>local:</span> send: <b>" + myParam);
        socket.send(myParam);
      }
      else {
      }
    };
    socket.onclose = function(evt) {
      messagesForm.classList.add("disabled");
      appendNewMessage("<span>local:</span> close socket");
    };
    socket.onmessage = function(evt) {
      appendNewMessage("<span>server:</span> " + evt.data);
    }
  })();