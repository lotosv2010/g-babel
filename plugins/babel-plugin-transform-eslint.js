/*
 * Babel插件：eslintPlugin
 * 功能：检测并禁止console语句的使用
 * 
 * @param {Object} options - 插件配置选项
 *   @param {boolean} [options.fix] - 是否自动移除console语句
 * 
 * @returns {Object} 返回Babel插件对象，包含以下属性：
 *   @property {Function} pre - 遍历前的初始化函数
 *   @property {Object} visitor - 包含AST节点访问器的对象
 *   @property {Function} post - 遍历后的处理函数
 */
const eslintPlugin = (options) => {
  return {
    /*
     * 遍历开始前的初始化函数
     * 功能：为当前文件设置错误收集数组
     * 
     * @param {Object} file - Babel文件对象
     */
    pre(file) {
      file.set('errors',[]);
    },
    visitor: {
      /*
       * AST节点访问器：处理函数调用表达式
       * 功能：检测console语句并记录错误
       * 
       * @param {Object} nodePath - 节点路径对象
       * @param {Object} state - 转换状态对象
       */
      CallExpression(nodePath, state) {
        const { node } = nodePath;
        const errors = state.file.get('errors');
        if(node.callee.object && node.callee.object.name === 'console') {
          const stackTraceLimit = Error.stackTraceLimit; // 保存原始堆栈跟踪限制
          Error.stackTraceLimit = 0; // 临时关闭错误堆栈跟踪
          errors.push(nodePath.buildCodeFrameError(`代码中不能出现 console 语句`, Error));
          Error.stackTraceLimit = stackTraceLimit;
          if (options.fix) { // 如果需要修复
            nodePath.parentPath.remove();
          }
        }
      }
    },
    /*
     * 遍历结束后的处理函数
     * 功能：输出收集到的所有错误
     * 
     * @param {Object} file - Babel文件对象
     */
    post(file) {
      console.log(...file.get('errors'));
    }
  }
}

module.exports = eslintPlugin;