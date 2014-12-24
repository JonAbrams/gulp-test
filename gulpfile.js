var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var del = require('del');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var less = require('gulp-less');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('assets', ['js', 'css']);
gulp.task('prod-assets', ['prod-js', 'prod-css']);

gulp.task('server', ['assets'], function () {
  gulp.watch([jsGlob, coffeeGlob], ['js']);
  gulp.watch([cssGlob, lessGlob, scssGlob, sassGlob], ['css']);
});
gulp.task('prod', ['prod-assets'], function () {

});

/* Prepare JS assets */
var jsGlob = 'front/**/*.js';
var coffeeGlob = 'front/**/*.coffee';

function jsFiles () {
  var jsFiles = gulp.src(jsGlob);
  var coffeeFiles = gulp.src(coffeeGlob)
    .pipe(coffee({ bare: true }).on('error', gutil.log));
  return merge(jsFiles, coffeeFiles)
    .pipe(ngAnnotate());
}

gulp.task('prod-js', ['cleanJS'], function () {
  return jsFiles()
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(rev())
    .pipe(gulp.dest('./public'));
});

gulp.task('js', ['cleanJS'], function () {
  return jsFiles()
    .pipe(gulp.dest('./public'));
});

/* Prepare CSS assets */
var cssGlob = 'front/**/*.css';
var lessGlob = 'front/**/*.less';
var sassGlob = 'front/**/*.sass';
var scssGlob = 'front/**/*.scss';

function cssFiles () {
  var cssFiles = gulp.src(cssGlob);
  var lessFiles = gulp.src(lessGlob)
    .pipe(less());
  var sassFiles = gulp.src([scssGlob, sassGlob])
    .pipe(sass());

    return merge(cssFiles, lessFiles, sassFiles);
}
gulp.task('prod-css', ['cleanCSS'], function () {
  return cssFiles()
    .pipe(minifyCSS())
    .pipe(concat('main.css'))
    .pipe(rev())
    .pipe(gulp.dest('./public'));
});
gulp.task('css', ['cleanCSS'], function () {
  return cssFiles()
    .pipe(gulp.dest('./public'));
});

/* Clean assets */
gulp.task('cleanJS', function (done) {
  return del(['public/**/*.js'], done);
});

gulp.task('cleanCSS', function (done) {
  return del(['public/**/*.css'], done);
});
