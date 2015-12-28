var gulp        = require('gulp');
var gutil       = require('gulp-util');
var runSequence = require('run-sequence');

gulp.task('attach-watchers', function () {
  return gulp.watch(['src/**/*', 'test/**/*'], ['build']).on('change', function(file) {
    gutil.log('File ' + file + ' was changed, running tasks...');
  });
});

gulp.task('watch', function(callback) {
  return runSequence(
    'clean',
    'build-commonjs',
    'attach-watchers',
    callback
  );
});
