var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');

gulp.task('assets', ['js', 'css']);

gulp.task('server', ['assets'], function () {

});

gulp.task('js', ['coffee'], function (coffeeFiles) {
  console.log("Making JS");
});

gulp.task('css', function () {
  console.log("Making CSS");
});

gulp.task('coffee', function () {
  return gulp.src('front/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/'));
})
