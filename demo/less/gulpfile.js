var gulp = require('gulp');
var less = require('gulp-less');
var LessPluginTheme = require('css-theme');
var themeConfig = require('./theme.config');
console.log(new LessPluginTheme({less: true, ...themeConfig}))

gulp.task('default', function () {
  return gulp.src('./index.less')
    .pipe(less({
      plugins: [new LessPluginTheme({less: true, ...themeConfig})]
    }))
    .pipe(gulp.dest('./dist'));
});
