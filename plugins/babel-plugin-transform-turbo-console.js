const types = require('@babel/types');
const path = require('path');

/**
 * 创建一个Babel插件，用于在console调用中自动添加图标和文件位置信息
 * @returns {Object} Babel插件对象，包含visitor方法处理AST节点
 */
const turboConsolePlugin = () => {
  // 图标映射对象，定义不同console方法对应的emoji图标
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
      /**
       * 处理AST中的函数调用表达式节点
       * @param {NodePath} nodePath 当前节点路径
       * @param {Object} state 插件状态对象，包含文件信息等
       */
      CallExpression(nodePath, state) {
        const { callee } = nodePath.node;
        
        // 检查是否为console对象的方法调用
        if (
          types.isMemberExpression(callee) &&
          types.isIdentifier(callee.object) &&
          callee.object.name === 'console' &&
          types.isIdentifier(callee.property)
        ) {
          const methodName = callee.property.name;
          const icon = iconMap[methodName];
          
          // 如果找到对应图标，则注入文件位置信息和图标
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

module.exports = turboConsolePlugin;