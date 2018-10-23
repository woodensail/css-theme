// through2 是一个对 node 的 transform streams 简单封装
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
const Parser = require('./parser');

// 常量
const PLUGIN_NAME = 'gulp-css-theme';

// 插件级别函数 (处理文件)
function gulpPrefixer(option) {
  const parser = new Parser(option);

  // 创建一个让每个文件通过的 stream 通道
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // 返回空文件
      cb(null, file);
    }
    if (file.isBuffer()) {
      file.contents =  new Buffer(parser.replaceParser(file.contents.toString()));
    }
    if (file.isStream()) {     console.log('isStream');
      this.emit('error');
      return cb();
    }

    cb(null, file);

  });

};

// 暴露（export）插件主函数
module.exports = gulpPrefixer;
