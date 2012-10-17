#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var optimist = require('optimist');
var prompt = require('prompt');
var efs = require('efs');
var encext = require('./index');
var defaultAlgorithm = 'aes-128-cbc';

var argv = optimist
  .usage('usage: encext [-r] [-a algorithm] [file ...]')
  .describe('r', 'recursively encrypt supported files')
  .boolean('r')
  .alias('r', 'recursive')
  .default('r', false)
  .describe('a', 'encryption algorithm')
  .string('a')
  .alias('a', 'algorithm')
  .default('a', defaultAlgorithm)
  .argv;

if (argv.help) {
  optimist.showHelp();
}

var pwdPrompt = {
  name: 'password',
  description: 'Please enter the encryption password',
  required: true,
  hidden: true
};

prompt.message = 'encext';
prompt.colors = false;
prompt.start();
prompt.get(pwdPrompt, function(err, result) {
  if (err) {
    console.error('[ERROR]', err);
    process.exit(1);
  }

  efs = efs.init(argv.algorithm, result.password);
  argv._.forEach(processPath);
});

function processPath(fspath) {
  fs.stat(fspath, onStat);

  function onStat(err, stats) {
    if (err) { return exit(err) }

    if (stats.isDirectory() && argv.recursive) {
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
