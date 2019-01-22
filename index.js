module.exports = function (opts) {
  if (opts.postcss) {
    return require('./lib/postcss')(opts);
  }
  if (opts.less) {
    return new (require('./lib/less'))(opts);
  }
  if (opts.gulp) {
    return require('./lib/gulp')(opts);
  }
};
