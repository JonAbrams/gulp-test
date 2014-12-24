var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var del = require('del');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('assets', ['js', 'css']);

gulp.task('server', ['assets'], function () {

});

gulp.task('js', ['cleanJS'], function () {
  var jsFiles = gulp.src('front/**/*.js');
  var coffeeFiles = gulp.src('front/**/*.coffee')
    .pipe(coffee({ bare: true }).on('error', gutil.log));
  return merge(jsFiles, coffeeFiles)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./public'));
});

gulp.task('css', ['cleanCSS'], function () {
  console.log("Making CSS");
});

gulp.task('cleanJS', function (done) {
  return del(['public/**/*.js'], done);
});

gulp.task('cleanCSS', function (done) {
  return del(['public/**/*.css'], done);
});
