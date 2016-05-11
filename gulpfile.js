const gulp = require('gulp');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const protractor = require('gulp-protractor').protractor;
const webdriver_standalone = require('gulp-protractor').webdriver_standalone;
const webdriver_update = require('gulp-protractor').webdriver_update;
const exec = require('child_process').exec;

var files = ['lib**/*.js', 'test/**/*.js', 'routes/**/*.js',
'models/**/*.js', 'gulpfile.js', 'server.js'];
var clientFiles = ['./app**/*.js'];

gulp.task('lintServer', () => {
  return gulp.src(files)
  .pipe(eslint('./.eslintrc'))
  .pipe(eslint.format());
});


gulp.task('lintClient', () => {
  return gulp.src(clientFiles)
  .pipe(eslint('./app/.eslintrc'))
  .pipe(eslint.format());
});

gulp.task('webpack', () => {
  gulp.src('./app/js/entry.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('static', () => {
  gulp.src('app/**/*.html')
    .pipe(gulp.dest('./build'));
  gulp.src('app/**/*.css')
   .pipe(gulp.dest('./build'));
});
// selenium server update
gulp.task('webdriver_update', webdriver_update);
// // selenium server start
gulp.task('webdriver_standalone', webdriver_standalone);
// start dev server
gulp.task('server', function(cb) {
  exec('node server.js', function(err) {
    // console.log(stdout);
    // console.log(stderr);
    cb(err);
  });
});

// protractor
gulp.task('integrationTest', function(cb) {
  gulp.src(['./test/integration/db-spec.js'])
  .pipe(protractor({
    configFile: './test/integration/config.js'
  }))
  .on('error', function(e) {
    throw new Error('Error' + e + 'in gulp file');
  }).on('end', cb);
});


gulp.task('default', ['lintServer', 'lintClient', 'webpack', 'static',
 // 'webdriver_update', 'webdriver_standalone',
 'server', 'integrationTest']);
