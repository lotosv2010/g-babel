/*
 * Babel插件：移除所有console对象的方法调用
 * @returns {Object} Babel插件对象，包含AST节点访问器
 * {
 *   visitor: {
 *     CallExpression: 处理函数调用表达式节点
 *   }
 * }
 */
const types = require('@babel/types');

const removeConsolePlugin = () => {
  return {
    /*
     * AST节点访问器集合
     * 处理函数调用表达式节点，移除所有console对象的方法调用
     */
    visitor: {
      CallExpression(path, state) {
        // 判断当前节点是否为console对象方法调用
        if (types.isMemberExpression(path.node.callee) && 
            path.node.callee.object.name === 'console') {
          path.remove();
        }
      }, 
    },
  };
};

module.exports = removeConsolePlugin;