var path = require('path');
var fs = require('fs');

// hide warning //
var emitter = require('events');
emitter.defaultMaxListeners = 5;

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

var paths = {
  root: appRoot,
  source: appRoot + '**/*.js',
  style: 'styles/**/*.css',
  output: 'dist/',
  doc:'./doc',
  test: 'test/**/*.js',
  exampleSource: 'doc/example/',
  exampleOutput: 'doc/example-dist/',
  packageName: pkg.name,
  ignore: [],
  useTypeScriptForDTS: false,
  importsToAdd: [],
  importsToIgnoreForDts: ['extend', 'typer', 'get-prop'],
  sort: true,
  concat: false,
  jsResources: [appRoot + '**/*.js', '!' + appRoot + '*.js'],
  resources: appRoot + '{**/*.css,**/*.html}'
};

paths.files = paths.root + '*.js';

module.exports = paths;
