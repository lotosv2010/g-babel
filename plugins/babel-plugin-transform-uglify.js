/**
 * 创建一个Babel插件，用于混淆代码中的变量名
 * @param {Object} options - 插件配置选项（未使用）
 * @returns {Object} 返回一个包含visitor对象的Babel插件
 */
const uglifyPlugin = (options) => {
  return {
    /**
     * Babel插件的visitor对象，用于遍历和修改AST节点
     * @property {Object} visitor - 包含各种AST节点访问器的对象
     */
    visitor: {
      /**
       * Scopable节点访问器：处理所有具有作用域的AST节点
       * @param {NodePath} path - 当前节点的路径对象
       * @description 遍历当前作用域内的所有变量绑定，并将它们重命名为唯一标识符
       */
      Scopable(path) {
        // 遍历作用域内所有的绑定，也就是变量
        Object.entries(path.scope.bindings).forEach(([key, binding]) => {
          const newName = path.scope.generateUid('_');
          binding.path.scope.rename(key, newName);
        });
      }
    }
  }
};

module.exports = uglifyPlugin;