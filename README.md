# css-theme

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/css-theme.svg?style=flat-square
[npm-url]: https://npmjs.org/package/css-theme
[download-image]: https://img.shields.io/npm/dm/css-theme.svg?style=flat-square
[download-url]: https://npmjs.org/package/css-theme

通过单一css文件生成多套主题，并合并入一个css文件中

## 特性

- 只加载一个css，通过切换rootClass瞬间切换主题
- 体积压缩，将多套css合并，去除冗余代码，避免文件体积膨胀
- 低侵入性，不改变现有开发模式，一处修改，全局生效

## 安装


```bash
$ npm i css-theme --save-dev
```

## 使用

### css编写

在css中需要根据主题变化的地方使用占位符，占位符可以是任何字符串。
你也可以通过预处理器变量的方式向css文件注入这些占位符。
```less
@dark: #theme1;
@light: #theme2;

.container {
  .text1 {
    font-size: 16px;
    color: #theme1;
    line-height: normal;
  }
  .text2 {
    font-size: 14px;
    color:  @dark;
    line-height: normal;
  }
  .text2 {
    font-size: 14px;
    color: @light;
    line-height: normal;
  }
}
```


### gulp插件模式

在gulp任务中调用theme插件。详见 demo/gulp

```js
var cssTheme = require('css-theme').gulp; // gulp-plugin
var themeConfig = require('./theme.config'); // configs

less({
  plugins:[new LessPluginTheme(themeConfig)]
})
```

### less插件模式

在通过gulp/webpack等工具调用less时，插入theme中间件。详见 demo/less

```js
var LessPluginTheme = require('css-theme').less; // less-plugin
var themeConfig = require('./theme.config'); // configs

gulp.task('default', function() {
  return gulp.src('./index.less')
    .pipe(less())
    .pipe(cssTheme(themeConfig))
    .pipe(gulp.dest('./dist'));
});
```

## 配置

placeholder: 占位符,描述每个变量在css文件中对应的占位符

list: 主题列表

list.targetMap: 该主题中每个变量对应的值

list.rootClass: 使用该主题时顶层添加的class

list.default: 是否将该主题作为默认主题，在未指定class时默认展示该主题

```js
module.exports = {
  'placeholder': {
    'dark': '#theme1',
    'light': '#theme2'
  },
  'list': [
    {
      'default': false,
      'targetMap': {
        'dark': '#ff6a3a',
        'light': '#ffa284',
      },
      'rootClass': 'skin_orange'
    },
    {
      'default': false,
      'targetMap': {
        'dark': '#fdd000',
        'light': '#ffd71c',
      },
      'rootClass': 'skin_yellow'
    }
  ]
};
```

## 链接

[Questions](https://github.com/woodensail/css-theme/issues)

[Github](https://github.com/woodensail/css-theme)

## 授权

[MIT](LICENSE)
