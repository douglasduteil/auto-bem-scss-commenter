//
import nomnom from 'nomnom';
import fs from 'vinyl-fs';
import through2 from 'through2';
import pkg from '../package.json'
import autoBemScssCommenter from './autoBemScssCommenter';

//

let options = nomnom
.script('auto-bem-scss-commenter')
  .help(pkg.description)
  .options({
    path: {
      position: 0,
      help: 'BEM files to comment',
      required: true,
      list: true
    },
    version: {
      flag: true,
      help: 'Print version',
      callback: function () {
        return pkg.version;
      }
    },
    force: {
      flag: true,
      help: 'force rewrite all comments'
    }
  })
  .parse();

fs.src(options.path || [])
  .pipe(autoBemScssCommenter(options))
  .pipe(through2.obj(function (file, enc, callback) {
    //console.log(file.path);
    console.log(file.contents.toString());
    callback(null, file);
  }))
  //.pipe(fs.dest('./'))
;
