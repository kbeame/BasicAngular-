const gulp = require('gulp');
const webpack = require('webpack-stream');

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

gulp.task('default', ['webpack', 'static']);
