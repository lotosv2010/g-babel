const types = require('@babel/types');
const path = require('path');

const addBinaryIconToConsolePlugin = () => {
  const iconMap = {
    log: '📘',
    warn: '⚠️',
    error: '🚨',
    info: 'ℹ️',
    debug: '🔧'
  };

  return {
    /*
     * AST节点访问器集合
     * 处理console调用并自动添加二进制图标
     */
    visitor: {
      CallExpression(nodePath, state) {
        const { callee } = nodePath.node;
        
        if (
          types.isMemberExpression(callee) &&
          types.isIdentifier(callee.object) &&
          callee.object.name === 'console' &&
          types.isIdentifier(callee.property)
        ) {
          const methodName = callee.property.name;
          const icon = iconMap[methodName];
          
          if (icon !== undefined) {
            // 创建图标字符串节点并插入到参数数组最前面
            const { start: { line, column}} = callee.loc;
            const locNode = types.stringLiteral(`${line}:${column}`);
            const iconNode = types.stringLiteral(`${icon} `);
            // 获取相对于当前文件的文件名并将反斜杠替换为正斜杠
            const relativeFileName = path.relative(__dirname, state.file.opts.filename).replace(/\\/g, '/');
            const fileNameNode = types.stringLiteral(`${relativeFileName}: `);
            // 将文件名和位置信息插入到参数列表的开头
            nodePath.node.arguments.unshift(locNode);
            nodePath.node.arguments.unshift(fileNameNode);
            nodePath.node.arguments.unshift(iconNode);
          }
        }
      }
    }
  };
};

module.exports = addBinaryIconToConsolePlugin;