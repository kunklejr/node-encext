#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var program = require('commander');
var efs = require('efs');
var encext = require('./index');
var defaultAlgorithm = 'aes-128-cbc';

program
  .command('encext')
  .usage('[options] <file ...>')
  .option('-a, --algorithm <alg>', 'encryption algorithm, defaults to ' + defaultAlgorithm)
  .option('-r, --recursive', 'recursively encrypt supported files').parse(process.argv);

var algorithm = program.algorithm || defaultAlgorithm;
var recursive = program.recursive || false;

program.password('Password: ', function(password) {
  process.stdin.destroy();
  efs = efs.init(algorithm, password);
  program.args.forEach(processPath);
});

function processPath(fspath) {
  fs.stat(fspath, onStat);

  function onStat(err, stats) {
    if (err) { return exit(err) }

    if (stats.isDirectory() && recursive) {
      fs.readdir(fspath, onReaddir);
    } else if (stats.isFile() && encext.isSupported(fspath)) {
      encrypt(fspath);
    }
  }

  function onReaddir(err, fspaths) {
    if (err) { return exit(err) }
    fspaths.forEach(function(p) {
      processPath(path.join(fspath, p));
    });
  }
}

function encrypt(fspath) {
  var encpath = fspath + '_enc';
  var writeStream = efs.createWriteStream(encpath);
  writeStream.on('error', exit);
  var readStream = fs.createReadStream(fspath);
  readStream.on('error', exit);
  readStream.on('end', function() {
    console.info(fspath, 'encrypted and written to', encpath);
  });
  readStream.pipe(writeStream);
}

function exit(err) {
  console.error(err);
  process.exit(1);
}
