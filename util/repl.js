/* globals console, process, require */

var file, fs, ls, readline, rl;

fs = require("fs");
readline = require("readline");
ls = require("./core.js");

file = fs.readFileSync("../ls/core.ls", "utf8");
ls.evaluate(file);

rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function read() {
  rl.question("ls> ", function(answer) {
    console.log(ls.evaluate(answer).val);

    read();
  });
}

read();
