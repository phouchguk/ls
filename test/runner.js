/* globals console, require */

var fs, ls, tester;

fs = require("fs");
ls = require("../js/core.js");
tester = require("./tester.js");

console.log(
  tester.test(
    ls,
    fs.readFileSync("../ls/core.txt", "utf8"),
    fs.readFileSync("tests.txt", "utf8")
  )
);
