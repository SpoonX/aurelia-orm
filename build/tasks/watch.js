var gulp  = require('gulp');
var gutil = require('gulp-util');

gulp.task('watch', ['clean', 'build-commonjs'], function() {
  return gulp.watch(['src/**/*', 'test/**/*'], ['build']).on('change', function(file) {

    gutil.log('File ' + file + ' was changed, running tasks...');
  });
});
