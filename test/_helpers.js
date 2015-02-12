import fs from 'fs';
import path from 'path';

const FIXTURES_PATH = path.join(__dirname, 'fixtures');

export function readFile(filename) {
  if (fs.existsSync(filename)) {
    var file = fs.readFileSync(filename, 'utf8').trim();
    file = file.replace(/\r\n/g, '\n');
    return file;
  } else {
    return '';
  }
}

export function getFixturesTest() {
  return fs
    .readdirSync(FIXTURES_PATH)
    .filter((fixtureName) => fixtureName[0] !== '.')
    // it.only helper
    //.filter((fixtureName) => fixtureName === 'bem-overwrite')
    .map(createFixtureDescription);

  //

  function createFixtureDescription(fixtureName) {
    let [actual, expected] =
      ['actual.scss', 'expected.scss']
        .map((filename) => {
          let relLoc = path.join(fixtureName, filename);
          return {
            loc: relLoc,
            code: readFile(path.join(FIXTURES_PATH, relLoc)),
            filename: filename
          }
        });

    let options = {};
    try{
      options = require(path.join(FIXTURES_PATH, fixtureName, 'options.json'));
    }catch (_){}

    return { name: fixtureName, actual, expected, options };
  }

}
