"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

//
var nomnom = _interopRequire(require("nomnom"));

var fs = _interopRequire(require("vinyl-fs"));

var through2 = _interopRequire(require("through2"));

var pkg = _interopRequire(require("../package.json"));

var autoBemScssCommenter = _interopRequire(require("./autoBemScssCommenter"));

//

var options = nomnom.script("auto-bem-scss-commenter").help(pkg.description).options({
  path: {
    position: 0,
    help: "BEM files to comment",
    required: true,
    list: true
  },
  version: {
    flag: true,
    help: "Print version",
    callback: function () {
      return pkg.version;
    }
  },
  force: {
    flag: true,
    help: "force rewrite all comments"
  }
}).parse();

fs.src(options.path || []).pipe(autoBemScssCommenter(options)).pipe(through2.obj(function (file, enc, callback) {
  //console.log(file.path);
  console.log(file.contents.toString());
  callback(null, file);
}));
//.pipe(fs.dest('./'))