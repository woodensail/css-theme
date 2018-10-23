const Parser = require('./parser');

function LessPluginTheme(option) {
  this.option = option
}

LessPluginTheme.prototype = {
  install: function (less, pluginManager) {
    const parser = new Parser(this.option);
    pluginManager.addPostProcessor({
      process: function (css) {
        return parser.replaceParser(css);
      }
    });
  },
  printUsage: function () {
  },
  setOptions: function (options) {
  },
  minVersion: [2, 0, 0]
};


module.exports =  LessPluginTheme;
