const gulp = require('gulp');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const protractor = require('gulp-protractor').protractor;
const exec = require('child_process').exec;
const server = require(__dirname + '/server.js');

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

// start dev server and selenium server
gulp.task('server', function() {
  exec('node server.js');
  exec('webdriver-manager start');
});

// protractor
gulp.task('integrationTest', ['server'], function() {
  gulp.src(['./test/integration/db-spec.js'])
  .pipe(protractor({
    configFile: './test/integration/config.js'
  }))
  .on('error', function(e) {
    throw new Error('Error' + e + 'in gulp file');
  }).on('end', () => {
    server.close();
  });
});


gulp.task('default', ['lintServer', 'lintClient', 'webpack', 'static',
'integrationTest']);

gulp.task('test', ['integrationTest']);
