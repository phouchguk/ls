/* globals console, require */

var file, fs, ls, start;

fs = require("fs");
ls = require("../js/core.js");

// load core lib
file = fs.readFileSync("../ls/core.ls", "utf8");

start = new Date().getTime();
ls.evaluate(file);

(function() {
  var expected, i, result, test, tests;

  tests = fs.readFileSync("core.txt", "utf8").split("\n");

  for (i = 0; i < tests.length; i += 3) {
    test = tests[i].trim();
    expected = tests[i + 1].trim();

    console.log(test);
    result = ls.evaluate(test).val.trim();

    if (expected !== "") {
      console.log(expected);
    }

    if (result === expected) {
      console.log("ok");
    } else {
      console.log("FAIL: " + result);
      break;
    }

    console.log("");
  }

  console.log("took ", new Date().getTime() - start, "ms");
})();
