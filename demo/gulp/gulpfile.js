var gulp = require('gulp');
var less = require('gulp-less');
var cssTheme = require('css-theme').gulp;
var themeConfig = require('./theme.config');

gulp.task('default', function() {
  return gulp.src('./index.less')
    .pipe(less()).pipe(cssTheme(themeConfig))
    .pipe(gulp.dest('./dist'));
});
