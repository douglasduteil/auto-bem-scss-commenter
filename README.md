# auto-bem-scss-commenter [![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url]

> Automatically comment your BEM compliant SCSS files to add class name comments. (inpired by dpellier/bem-comment)


## Installation

Auto-bem-scss-commenter can be installed using

```sh
$ npm install --save-dev auto-bem-scss-commenter 
```

## Usage

```scss
// file.scss 
//

.object {
  /* styles */

  &__child {
    /* styles */

    &--modifier {
      /* styles */
    }
  }
}
```

```bash
auto-bem-scss-commenter file.scss > file.scss 
```

```scss
// file.scss 
//

// object
.object {
  /* styles */

  // object__child
  &__child {
    /* styles */

    // object__child--modifier
    &--modifier {
      /* styles */
    }
  }
}
```

`auto-bem-scss-commenter -h` for more info

### With Node

```js
var bemComment = require('auto-bem-scss-commenter ');
gulp.task('helper:bem-comment', function () {
  return gulp.src(['**/{,*/}/*.scss'], {cwd: options.app})
    .pipe(bemComment({ force: true }))
    .pipe(gulp.dest(options.app));
});
```

The `force` option force rewrite all comments

## License

    Copyright © 2014 Douglas Duteil <douglasduteil@gmail.com>
    This work is free. You can redistribute it and/or modify it under the
    terms of the Do What The Fuck You Want To Public License, Version 2,
    as published by Sam Hocevar. See the LICENCE file for more details.

[npm-url]: https://npmjs.org/package/auto-bem-scss-commenter
[npm-image]: http://img.shields.io/npm/v/auto-bem-scss-commenter.svg
[travis-url]: http://travis-ci.org/douglasduteil/auto-bem-scss-commenter
[travis-image]: http://travis-ci.org/douglasduteil/auto-bem-scss-commenter.svg?branch=master
