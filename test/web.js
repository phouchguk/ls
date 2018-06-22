/* globals ls, tester */

var xhr = function(url, onOk) {
  var key;

  key = "_XHR_" + url;

  if (localStorage.getItem(key)) {
    onOk(localStorage.getItem(key));
    return;
  }

  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
      localStorage.setItem(key, req.responseText);
      onOk(req.responseText);
    }
  };

  req.open("GET", url, true);
  req.send();
};

xhr("../ls/core.txt", function(core) {
  xhr("tests.txt", function(tests) {
    document.getElementById("output").innerText = tester.test(ls, core, tests);
  });
});
