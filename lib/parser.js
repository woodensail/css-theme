const css = require('css');

function Parser(config) {
  this.parsedConfig = parseConfig(config);
}

Parser.prototype = {
  replaceParser: function (cssStr) {
    return replaceParser(cssStr, this.parsedConfig);
  }
};

function replaceParser(cssStr, config) {
  const injectRootClass = config.injectRootClass || _injectRootClass;
  // 解析为语法树
  const baseRoot = css.parse(cssStr, {});
  // 对语法树进行预处理，并过滤无用节点
  const baseList = flatten(baseRoot.stylesheet.rules);

  // 获取配置中的占位符列表
  const valueList = config.valueList;
  // 过滤条目为空的节点，无需进行处理，最终得到需要进行配置化的节点列表
  const filterList = baseList.filter(rule => {
    // 获取需要进行替换的条目，即value中含有任意占位符的条目
    rule.rows = rule.rows.filter(row => valueList.findIndex(value => row.value.indexOf(value) > -1) > -1);
    return rule.rows.length;
  });

  // 遍历所有皮肤，对每个皮肤生成对应css并进行拼接
  const appendStr = '\n\n' + config.list.map((theme => {
    // 遍历待配置化节点列表中的节点并生成新节点列表
    const themeRules = filterList.map(rule => {
      // 针对每个节点，遍历其中的条目
      const parsedRows = rule.rows.map(row => {
        let targetValue = row._value;
        // 遍历颜色占位符
        config.valueList.forEach(value => {
          // 针对每种颜色占位符，尝试将value中的占位符替换为当前皮肤中该占位符所对应的颜色
          targetValue = targetValue.replace(value, theme.targetMap[config.valueMap[value]]);
        });
        // 如果当前配置为默认配置，则修改原始语法树的value，从而将默认皮肤直接写入原始css中
        if (theme.default) {
          row.value = targetValue;
        }
        // 返回生成的新条目
        return {
          type: 'declaration', property: `${row.property}`, value: targetValue, isDefault: theme.default
        };
      }).filter(row => !row.isDefault);
      // 返回生成的新节点
      return {
        type: 'rule',
        selectors: rule.selectors.map(selector => injectRootClass(selector, theme.rootClass)),
        declarations: parsedRows
      };
    });
    // 构建空白语法树
    const themeRoot = css.parse(``, {});
    // 将新节点列表插入语法树
    themeRoot.stylesheet.rules = themeRules;
    // 序列化css
    return css.stringify(themeRoot, {});
  })).join('\n\n');

  // 将原始语法树序列化为css(此时默认皮肤已被写入其中)
  const baseParsedStr = css.stringify(baseRoot, {});
  return baseParsedStr + appendStr;
}

// 解析配置文件
function parseConfig(themeConfig) {
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

// 解析语法树
function flatten(list) {
  return list.filter(rule => rule.type === 'rule').map(function (rule) {
    const rows = rule.declarations.filter(row => {
      row._value = row.value;
      return row.type === 'declaration';
    });
    return {selectors: rule.selectors, rows};
  });
}

// 将rootClass注入选择器中
function _injectRootClass(selector, rootClass) {
  // 如果是page开头的选择器则注入到page之后，否则注入到开头
  if (selector.startsWith('page ')) {
    return selector.replace('page', `page .${rootClass}`);
  } else {
    return `.${rootClass} ${selector}`;
  }
}

module.exports = Parser; //{replaceParser, parseConfig};
