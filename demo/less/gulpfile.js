var gulp = require('gulp');
var less = require('gulp-less');
var LessPluginTheme = require('css-theme').less;
var themeConfig = require('./theme.config');

gulp.task('default', function() {
  return gulp.src('./index.less')
    .pipe(less({
      plugins:[new LessPluginTheme(themeConfig)]
    }))
    .pipe(gulp.dest('./dist'));
});
