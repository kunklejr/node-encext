var efs = require('efs');
var suffix = '_enc';

var extensions = {
  '.js': function(module, filename) {
    var content = efs.readFileSync(filename, 'utf8');
    module._compile(stripBOM(content), filename);
  },

  '.json': function(module, filename) {
    var content = efs.readFileSync(filename, 'utf8');
    try {
      module.exports = JSON.parse(stripBOM(content));
    } catch (err) {
      err.message = filename + ': ' + err.message;
      throw err;
    }
  }
};

// register extension warnings
Object.keys(extensions).forEach(function(ext) {
  require.extensions[ext + suffix] = function(module, filename) {
    throw new Error('You must call encext.init(alg, pass) before requiring', filename);
  };
});

exports.init = function(algorithm, password) {
  efs = efs.init(algorithm, password);
  delete exports.init; // makes no sense to init twice

  // register real extensions
  Object.keys(extensions).forEach(function(ext) {
    require.extensions[ext + suffix] = extensions[ext];
  });
};

exports.isSupported = function(filename) {
  return Object.keys(extensions).some(function(ext) {
    return filename.indexOf(ext) === filename.length - ext.length;
  });
}

function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

