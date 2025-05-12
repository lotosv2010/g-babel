/**
 * 将 TypeScript 类型注解映射为对应的 JavaScript 类型
 * @type {Object}
 */
const typeAnnotationMap = {
  TSNumberKeyword: 'Number',
  TSStringKeyword: 'String',
}

/**
 * Babel 插件函数，用于检查变量声明的类型与其初始化值的类型是否匹配
 * @param {Object} options - 插件配置选项
 * @returns {Object} 返回一个包含 pre、visitor 和 post 方法的对象，用于在 Babel 转换过程中执行类型检查
 */
function tscPlugin(options) {
  return {
    /**
     * 在转换开始前初始化错误列表
     * @param {Object} file - Babel 文件对象
     */
    pre: (file) => {
      file.set('errors', []);
    },
    visitor: {
      /**
       * 检查变量声明的类型与初始化值的类型是否匹配
       * @param {Object} nodePath - AST 节点路径
       * @param {Object} state - 转换状态对象
       */
      VariableDeclarator(nodePath, state) {
        const errors = state.file.get('errors');
        const { node } = nodePath;
        const idType = typeAnnotationMap[node.id.typeAnnotation.typeAnnotation.type];
        const initType = node.init.type;
        if (idType !== initType) {
          Error.stackTraceLimit = 0;
          errors.push(nodePath.buildCodeFrameError(
            `${node.id.name} is ${idType}, but initialized with ${initType}`, 
            Error
          ));
        }
      }
    },
    /**
     * 在转换完成后输出所有类型不匹配的错误信息
     * @param {Object} file - Babel 文件对象
     */
    post: (file) => {
      console.log(...file.get('errors'));
    }
  }
}

module.exports = tscPlugin;