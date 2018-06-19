/* globals exports */
(function(exports) {
  "use strict";

  var balance,
    catchForm,
    dict,
    evalDef,
    evalForm,
    evalForms,
    evalLambda,
    evalQuote,
    evalSpecialForms,
    formReplace,
    fnNr,
    postprocessing,
    preprocessing,
    quot,
    quotNr,
    supertrim,
    unquote;

  exports.dict = dict = {};

  exports.evaluate = function(s) {
    var bal = balance(s);

    if (bal.left === bal.right) {
      s = preprocessing(s);
      s = evalSpecialForms(s);
      s = evalForms(s);
      s = postprocessing(s);
    }

    return { val: s, bal: bal };
  };

  exports.reset = function() {
    dict = {};
    fnNr = 0;
  };

  exports.supertrim = supertrim = function(s) {
    return s.trim().replace(/\s+/g, " ");
  };

  fnNr = 0;

  quot = {};
  quotNr = 0;

  balance = function(s) {
    var strt, stop;

    strt = s.match(/\(/g);
    stop = s.match(/\)/g);

    strt = strt ? strt.length : 0;
    stop = stop ? stop.length : 0;

    return { left: strt, right: stop };
  };

  catchForm = function(symbol, str) {
    var d1, d2, index, nb, start;

    start = str.indexOf(symbol);

    if (start === -1) {
      return "none";
    }

    // (symbol ...)
    d1 = symbol.length;
    d2 = 0;

    nb = 1;
    index = start;

    while (nb > 0) {
      index++;
      if (str.charAt(index) === "(") {
        nb++;
      } else if (str.charAt(index) === ")") {
        nb--;
      }
    }

    return str.substring(start + d1, index + d2);
  };

  evalDef = function(s, flag) {
    var body, index, name;

    // (def name body)
    s = evalSpecialForms(s, false);

    flag = flag === undefined;

    index = s.search(/\s/);
    name = s.substring(0, index).trim();
    body = s.substring(index).trim();

    if (body.substring(0, 6) === "_LAMB_") {
      dict[name] = dict[body];
    } else {
      body = evalForms(body);

      dict[name] = function() {
        return body;
      };
    }

    return flag ? "_DEF_" : "";
  };

  evalForm = function() {
    var f, r;

    f = arguments[1] || "";
    r = arguments[2] || "";

    if (dict.hasOwnProperty(f)) {
      return dict[f].apply(null, [r]);
    } else {
      return "[" + f + " " + r + "]";
    }
  };

  evalForms = function(s) {
    var regexp;

    // nested (first rest)
    regexp = /\(([^\s()]*)(?:[\s]*)([^()]*)\)/g;
    while (s !== (s = s.replace(regexp, evalForm)));

    return s;
  };

  evalLambda = function(s) {
    var argStr, args, body, index, name, regArgs;

    // (lambda (args) body)
    s = evalSpecialForms(s);
    index = s.indexOf(")");
    argStr = supertrim(s.substring(1, index));
    args = argStr === "" ? [] : argStr.split(" ");
    body = s.substring(index + 2).trim();
    name = "_LAMB_" + fnNr++;
    regArgs = [];

    for (var i = 0; i < args.length; i++) {
      regArgs[i] = args[i] === "_" ? null : new RegExp(args[i], "g");
    }

    dict[name] = function() {
      var valStr = supertrim(arguments[0]);
      var vals = valStr === "" ? [] : valStr.split(" ");

      return (function(bod) {
        var i, isRest, lastIndex;

        //bod = eval_conds(bod, reg_args, vals);
        if (vals.length < args.length) {
          // partial call
          for (i = 0; i < vals.length; i++) {
            if (regArgs[i] !== null) {
              bod = bod.replace(regArgs[i], vals[i]);
            }
          }

          var _args_ = args.slice(vals.length).join(" ");

          bod = evalLambda("(" + _args_ + ") " + bod);
        } else if (args.length > 0) {
          lastIndex = args.length - 1;
          isRest = vals.length > args.length && args[lastIndex][0] === ("&");

          // total call
          for (i = 0; i < args.length; i++) {
            if (isRest && i === lastIndex) {
              bod = bod.replace(
                new RegExp(args[i].substring(1), "g"),
                vals.slice(i).join(" ")
              );
            } else {
              bod = bod.replace(regArgs[i], vals[i]);
            }
          }
        }
        return evalForms(bod);
      })(supertrim(body));
    };
    return name;
  };

  evalQuote = function(s) {
    // (quote expressions)
    var name;

    // (quote x) -> _QUOT_n
    name = "_QUOT_" + quotNr++;
    quot[name] = s;

    return name;
  };

  evalSpecialForms = function(s, flag) {
    while (s !== (s = formReplace(s, "(quote", evalQuote)));
    while (s !== (s = formReplace(s, "(fn", evalLambda)));
    while (s !== (s = formReplace(s, "(def", evalDef, flag)));

    return s;
  };

  formReplace = function(str, sym, func, flag) {
    sym += " ";
    var s = catchForm(sym, str);
    return s === "none" ? str : str.replace(sym + s + ")", func(s, flag));
  };

  postprocessing = function(s) {
    s = s.replace(/_QUOT_\d+/g, unquote);

    // remove def leftovers
    s = s.replace(/_DEF_\s*/g, "");

    quot = {};
    quotNr = 0;

    return s;
  };

  preprocessing = function(s) {
    s = s.replace(/'\(/g, "(quote _"); // '(x) -> (quote _x)

    return s;
  };

  unquote = function(s) {
    var ss;

    // _QUOT_n -> x
    ss = quot[s];

    //  ? from (quote x) : from '(x)
    return ss.charAt(0) !== "_" ? ss : "(" + ss.substring(1) + ")";
  };
})(typeof exports === "undefined" ? (this.ls = {}) : exports);
