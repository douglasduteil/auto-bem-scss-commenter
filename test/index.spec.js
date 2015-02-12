//

import assert from 'assert';

import Mocha from 'mocha';
let {Test, Suite} = Mocha;
import {expect} from 'chai';

import File from 'vinyl';

//

import {getFixturesTest} from './_helpers.js';
import autoBemScssCommenter from '../src/autoBemScssCommenter';

//

let mainSuite = describe('autoBemScssCommenter', function () {
  before(generateSourceMapTest);

  it('soulhd generate the tests', function () {
    expect(mainSuite.tests.length).to.be.above(1);
  });

});

function generateSourceMapTest() {

  getFixturesTest()
    .map(testCoverMaps)
    .forEach((test) => mainSuite.addTest(test));

}

function testCoverMaps(fixtureTest) {
  return new Test( `should validate ${fixtureTest.name}`, equalStreamedTest );


  function equalStreamedTest(done) {
    var stream = autoBemScssCommenter(fixtureTest.options);

    stream.on('data', function (file) {
      expect(file.contents.toString()).to.equal(fixtureTest.expected.code);
      done();
    });

    stream.write(new File({
      contents: new Buffer(fixtureTest.actual.code)
    }));

  }


}
