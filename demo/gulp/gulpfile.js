var gulp = require('gulp');
var less = require('gulp-less');
var cssTheme = require('css-theme');
var themeConfig = require('./theme.config');

gulp.task('default', function () {
  return gulp.src('./index.less')
    .pipe(less()).pipe(cssTheme({gulp: true, ...themeConfig}))
    .pipe(gulp.dest('./dist'));
});
