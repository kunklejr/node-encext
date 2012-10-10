var expect = require('chai').expect;
var encext = require('../index');

encext.init('aes-128-cbc', 'password');

describe('encext', function() {
  describe('#init()', function() {
    it('should only be called once', function(done) {
      expect(encext.init).to.be.undefined;
      done();
    });

    it('should register a .js_enc require extension', function(done) {
      expect(require.extensions['.js_enc']).to.exist;
      done();
    });

    it('should register a .json_enc require extension', function(done) {
      expect(require.extensions['.json_enc']).to.exist;
      done();
    });
  });

  describe('#isSupported()', function() {
    it('should support files with a .js extension', function(done) {
      expect(encext.isSupported('test.js')).to.be.true;
      expect(encext.isSupported('a/test.js')).to.be.true;
      expect(encext.isSupported('a/b/test.js')).to.be.true;
      expect(encext.isSupported('.js')).to.be.true;
      done();
    });

    it('should support files with a .json extension', function(done) {
      expect(encext.isSupported('test.json')).to.be.true;
      expect(encext.isSupported('a/test.json')).to.be.true;
      expect(encext.isSupported('a/b/test.json')).to.be.true;
      expect(encext.isSupported('.json')).to.be.true;
      done();
    });
  });

  describe('requiring .js_enc file', function() {
    it('should properly require an encrypted js file', function(done) {
      expect(require('./a').success).to.be.true;
      done();
    });
  });

  describe('requiring .json_enc file', function() {
    it('should properly require an encrypted json file', function(done) {
      expect(require('./b').success).to.be.true;
      done();
    });
  });
});
