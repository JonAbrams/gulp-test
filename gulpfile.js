var fs = require('fs');
var Writable = require('stream').Writable;

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
var symlink = require('gulp-symlink');

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

/* Create symlinks to misc folder */
gulp.task('misc-ln', function () {
  var linkHandler = function (destDir, options) {
    var options = options || {};
    var destDir = destDir || '';
    var ws = Writable({ objectMode: true });

    ws._write = function (chunk, enc, next) {
      var base = chunk.base;
      var filename = chunk.path.replace(base, '');
      var destFilename = destDir + '/' + filename;

      fs.symlink(chunk.path, destFilename, function (err) {
        if (err) {
          if (err.code === 'EEXIST') {
            console.log('File exists at ' + destFilename +', skipping');
          } else {
            return next(err);
          }
        } else {
          if (options.verbose) {
            console.log(
              "Linked " + destFilename + ' to ' + chunk.path.replace(base, '')
            );
          }
        }
        next();
      });
    }

    return ws;
  };

  return gulp.src('front/misc/**/*')
    .pipe(linkHandler('public', { verbose: true }));
});
