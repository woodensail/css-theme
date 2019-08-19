var postcss = require('postcss');

module.exports = postcss.plugin('css-theme', function (opts) {
  opts = opts || {};    // 处理 options
  const config = parseConfig(opts);
  let defaultTheme;
  const themes = config.list.filter(theme => {
    if (theme.default && !defaultTheme) {
      defaultTheme = theme;
    } else {
      return true;
    }
  });

  // 获取配置中的占位符列表
  const valueList = config.valueList;
  const injectRootClass = config.injectRootClass || _injectRootClass;
  const newRoot = postcss.parse('');
  return function (root, result) {
    // 遍历所有的选择器
    root.walkRules(function (rule) {
      const hits = [];
      // 遍历所有的属性
      rule.walkDecls(function (decl) {
        // 判断当前属性是否需要进行处理
        const matchValues = valueList.filter(value => decl.value.indexOf(value) > -1);
        if (matchValues.length) {
          // 记录原有数据
          decl._value = decl.value;
          // 使用默认皮肤进行替换
          matchValues.forEach(matchValue => {
            decl.value = decl.value.replace(new RegExp(matchValue, 'gm'), defaultTheme.targetMap[config.valueMap[matchValue]]);
          });
          hits.push({matchValues, decl});
        }
      });
      // 若当前选择器下包含至少一条需进行处理的属性，则进行theme处理
      if (hits.length) {
        // 循环所有主题
        themes.map(theme => {
          // 插入一条选择器
          newRoot.append({selector: injectRootClass(rule.selector, theme.rootClass)});
          // 遍历所有需进行处理的属性
          hits.forEach(({matchValues, decl}) => {
            let parsed = decl._value;
            matchValues.forEach(matchValue => {
              parsed = parsed.replace(new RegExp(matchValue, 'gm'), theme.targetMap[config.valueMap[matchValue]]);
            });
            // 向新插入的选择器中插入处理后的属性
            newRoot.last.append({
              prop: decl.prop,
              value: parsed
            });
          });
        });
      }
    });
    root.append(newRoot);
  };
});

function parseConfig(themeConfig) {
  themeConfig.placeholder = themeConfig.placeholder || themeConfig.colorMap;
  themeConfig.list.forEach(item => (item.targetMap = item.targetMap || item.color));
  const placeholder = themeConfig.placeholder;
  const valueMap = {};
  const valueList = [];
  Object.keys(placeholder).forEach(key => {
    valueMap[placeholder[key]] = key;
    valueList.push(placeholder[key]);
  });
  themeConfig.valueMap = valueMap;
  themeConfig.valueList = valueList;
  return themeConfig;
}

// 将rootClass注入选择器中
function _injectRootClass(selectors, rootClass) {
  // 如果是page开头的选择器则注入到page之后，否则注入到开头
  if (!selectors) {
    return;
  }
  return selectors.split(',').map(selector => {
      if (selector.startsWith('page ')) {
        return selector.replace('page', `page .${rootClass}`);
      } else {
        return `.${rootClass} ${selector}`;
      }
    }
  ).join(',');
}
