"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = autoBemScssCommenter;
//

var throught = _interopRequire(require("through2"));

var assert = _interopRequire(require("assert"));

var IS_CLASS_LINE_REG = /^(\s*)(\.|&)([^\s{:,]+)/;
var IS_A_COMPLICATE_LINE_REG = new RegExp("^\\s*" + // "indentation"
"(:?" + "(\\.|&)(?:--)?(?:__)?" + // "start with a . or &-- or &__"
"(?:[^\\s\\{\\}]+))" + // "has a fist part"
"([\\s\\.:\\[\\#][^\\{\\s]+" + ")+" // "get more complicate there..."
);

function autoBemScssCommenter(options) {
  options = options || {};

  return throught.obj(function transform(file, enc, callback) {
    var lines = file.contents.toString().split(/(?:\n|\r\n|\r)/g);
    file.contents = Buffer(lines.reduce(reduceSelectorLines, {
      lines: [],
      stack: []
    }).lines.join("\n"));

    callback(null, file);
  });

  ////

  function reduceSelectorLines(env, line, index) {
    var lines = env.lines;
    var stack = env.stack;


    var lastSubStack = stack.length - 1;

    var indentation = "";
    var name = "";
    var isReferencingParentSelectors = 0;

    var comment = undefined;

    var lastLine = undefined;
    var expectedCommentReg = undefined;

    return unSupportedLine() || extractSelectorInfo() || pushSelectorToStack() || testAlreadyCommented() || commentTheSelector();

    function unSupportedLine() {
      if (!isUnsupportedSelector(line)) {
        return;
      }

      // stack if "{" found;
      openingRules(line, stack);
      // unstack if "}" found;
      closingRules(line, stack);

      lines.push(line);
      return env;
    }


    function extractSelectorInfo() {
      line.replace(IS_CLASS_LINE_REG, function (match, selectorIndentation, selectorStartingCharacter, selectorName) {
        isReferencingParentSelectors |= selectorStartingCharacter === "&";
        indentation = selectorIndentation;
        name = selectorName;
      });
    }

    function pushSelectorToStack() {
      if (isReferencingParentSelectors) {
        assert(stack[lastSubStack], "Try to push " + name + " in an undefined state");
        if (stack[lastSubStack].join("").replace("{", "").length) {
          stack[lastSubStack].push(name);
        }
      } else {
        stack.push([name]);
        lastSubStack++;
      }
      //console.log(line)
      //console.log(stack)
    }

    function testAlreadyCommented() {
      comment = stack[lastSubStack].join("").replace("{", "");
      lastLine = lines[lines.length - 1];
      expectedCommentReg = new RegExp("^\\s*//\\s+" + comment);

      if (index <= 0) {
        return;
      }

      if (options.force && /^\s*\/\//.test(lastLine)) {
        lines.splice(-1, 1);
      } else if (expectedCommentReg.test(lastLine)) {
        lines.push(line);
        return env;
      }
    }

    function commentTheSelector() {
      if (comment.length) {
        lines.push("" + indentation + "// " + comment);
      }

      lines.push(line);

      closingRules(line, stack);

      // extra pop for multiple rules
      if (/\s*,\s*$/.test(line)) {
        if (!stack[lastSubStack]) {
          return env;
        }
        // Hack here...
        stack[lastSubStack].splice(-1, 1);
      }

      return env;
    }
  }


  function openingRules(line, stack) {
    var lastSubStack = stack.length - 1;
    var n = (line.match(/{/g) || []).length;

    if (!n) {
      return;
    }
    if (stack[lastSubStack]) {
      stack[lastSubStack] = stack[lastSubStack].concat(Array.apply(null, { length: n }).map(function () {
        return "{";
      }));
    } else {
      stack.push(["{"]);
    }
  }

  function closingRules(line, stack) {
    var lastSubStack = stack.length - 1;
    var n = (line.match(/}/g) || []).length;

    if (!stack[lastSubStack]) {
      return;
    }

    stack[lastSubStack].splice(-n, n);
    if (!stack[lastSubStack].length) {
      stack.pop();
    }
  }

  function isUnsupportedSelector(line) {
    var isUnsupported = 0;

    // Is not a class
    isUnsupported |= !IS_CLASS_LINE_REG.test(line);
    // Is a complicate line... too hard; don't do
    isUnsupported |= IS_A_COMPLICATE_LINE_REG.test(line);
    // Has multiple definition on the same line
    isUnsupported |= (line.match(/[\.&]/g) || []).length > 1;

    return isUnsupported;
  }
}