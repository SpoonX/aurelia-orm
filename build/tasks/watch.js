var gulp  = require('gulp'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util');

gulp.task('watch', ['clean', 'build-commonjs'], function () {
  return gulp.watch('src/**/*', ['build']).on('change', function (file) {

    gutil.log('File ' + file + ' was changed, running tasks...');
  });
});
