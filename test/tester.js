/* globals exports */

(function(exports) {
  "use strict";

  exports.test = function(ls, core, testsText) {
    var expected, i, logs, result, start, test, tests;

    logs = [];
    tests = testsText.split("\n");

    start = new Date().getTime();

    ls.evaluate(core);

    for (i = 0; i < tests.length; i += 3) {
      test = tests[i].trim();
      expected = tests[i + 1].trim();

      logs.push(test);
      result = ls.evaluate(test).val.trim();

      if (expected !== "") {
        logs.push(expected);
      }

      if (result === expected) {
        logs.push("ok");
      } else {
        logs.push("FAIL: " + result);
        break;
      }

      logs.push("");
    }

    logs.push("took " + (new Date().getTime() - start) + "ms");
    return logs.join("\n");
  };
})(typeof exports === "undefined" ? (this.tester = {}) : exports);
