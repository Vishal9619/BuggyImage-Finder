"use strict";

async function loadData() {
  var url = chrome.runtime.getURL("tempCsv.csv");
  console.log(url);
  return (await fetch(url)).text();
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(text))
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  //   localStorage.clear();
}

function insertButtons(x, yesButton, noButton) {
  if (!localStorage.getItem(window.location.href)) {
    x[0].appendChild(yesButton);
    x[0].appendChild(noButton);
  }
}

function moveNext(allTextLines) {
  for (var i = 0; i < allTextLines.length; i++) {
    if (!localStorage.getItem(allTextLines[i])) {
      console.log(allTextLines[i]);
      document.location.href = allTextLines[i];
      return;
    }
  }
  window.location.href = "https://www.practo.com/order";
}

// Start file download.
function yesClicked() {
  var getCsvData = loadData();
  getCsvData.then(function(result) {
    var allTextLines = result.split(/\r\n|\n/);
    for (var i = 0; i < allTextLines.length; i++) {
      if (allTextLines[i] === window.location.href) {
        localStorage.setItem(allTextLines[i], "Correct");
        break;
      }
    }
    moveNext(allTextLines);
  });
}
function noClicked() {
  var getCsvData = loadData();
  getCsvData.then(function(result) {
    var allTextLines = result.split(/\r\n|\n/);
    for (var i = 0; i < allTextLines.length; i++) {
      if (allTextLines[i] === window.location.href) {
        localStorage.setItem(allTextLines[i], "Wrong");
        break;
      }
    }
    moveNext(allTextLines);
  });
}
function putButtonPage() {
  var yesButton = document.createElement("BUTTON");
  var noButton = document.createElement("BUTTON");
  //   var downloadButton = document.createElement("BUTTON");
  var x = document.getElementsByClassName("heading-alpha");

  insertButtons(x, yesButton, noButton);
  //   x[0].appendChild(downloadButton);

  yesButton.style.width = "70px";
  yesButton.style.cursor = "pointer";
  yesButton.innerHTML = "Correct";
  yesButton.style.backgroundColor = "green";
  yesButton.style.color = "white";
  yesButton.style.fontSize = "15px";
  yesButton.onclick = function() {
    yesClicked();
  };
  noButton.style.width = "70px";
  noButton.style.cursor = "pointer";
  noButton.innerHTML = "Wrong";
  noButton.style.backgroundColor = "red";
  noButton.style.color = "white";
  noButton.style.fontSize = "15px";
  noButton.onclick = function() {
    noClicked();
  };
  //   downloadButton.style.width = "80px";
  //   downloadButton.style.cursor = "pointer";
  //   downloadButton.innerHTML = "Download";
  //   downloadButton.style.backgroundColor = "yellow";
  //   downloadButton.style.fontSize = "15px";
  //   downloadButton.onclick = function() {
  //     var imageData = [];
  //     for (var i in localStorage) {
  //       var val = localStorage[i];
  //       var result = i.match(/practo/g);
  //       if (result != null) imageData.push({ val, i });
  //     }
  //     //console.log(imageData);
  //     download("PractoFile.csv", imageData);
  //   };
}
function orderHomeButton() {
  function setButtonStyles(button) {
    button.style.width = "90px";
    button.style.height = "25px";
    button.style.position = "absolute";
    button.style.cursor = "pointer";
    button.style.top = "100px";
    button.style.right = "300px";
    button.style.zIndex = "100000";
    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.fontSize = "15px";
    return button;
  }

  var getCsvData = loadData();
  var flag = false;
  getCsvData.then(function(result) {
    var allTextLines = result.split(/\r\n|\n/);
    for (var i = 0; i < allTextLines.length; ++i) {
      if (!localStorage.getItem(allTextLines[i])) {
        flag = true;
        break;
      }
    }
    if (flag) {
      console.log("inside start button");
      var startButton = document.createElement("BUTTON");
      var st_btn = document.getElementById("root");
      startButton.innerHTML = "Start";
      st_btn.appendChild(startButton);
      setButtonStyles(startButton);

      startButton.onclick = function() {
        moveNext(allTextLines);
      };
    } else {
      console.log("inside end button");
      var dwnldButton = document.createElement("BUTTON");
      var end_btn = document.getElementById("root");
      end_btn.appendChild(dwnldButton);
      setButtonStyles(dwnldButton);
      dwnldButton.innerHTML = "Download";
      dwnldButton.onclick = function() {
        var imageData = [];
        for (var i in localStorage) {
          var val = localStorage[i];
          var result = i.match(/practo/g);
          if (result != null) imageData.push({ val, i });
        }
        download("PractoFile.csv", imageData);
      };
    }
  });
}

if (window.location.href === "https://www.practo.com/order/") {
  orderHomeButton();
} else {
  console.log("no matfch");
  putButtonPage();
}
