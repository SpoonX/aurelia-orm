var gulp        = require('gulp');
var KarmaServer = require('karma').Server;
var server      = require('./server');

/**
 * Run test once and exit
 */
gulp.task('test', ['lint'], function(done) {
  server.start(function() {
    var karmaServer = new KarmaServer({
      configFile: __dirname + '/../../karma.conf.js',
      singleRun: true
    }, function() {
      server.stop(function() {
        done();

        process.exit();
      });
    });

    karmaServer.start();
  });
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function(done) {
  var karmaServer = new KarmaServer({
    configFile: __dirname + '/../../karma.conf.js'
  }, function() {
    done();
  });

  karmaServer.start();
});

/**
 * Run test once with code coverage and exit
 */
gulp.task('cover', function(done) {
  var karmaServer = new KarmaServer({
    configFile: __dirname + '/../../karma.conf.js',
    singleRun: true,
    reporters: ['coverage'],
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel', 'coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'build/reports/coverage'
    }
  }, function() {
    done();
  });

  karmaServer.start();
});
