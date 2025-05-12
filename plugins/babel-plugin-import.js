const types = require('@babel/types');
const template = require('@babel/template');

/**
 * Babel插件函数，用于转换特定库的导入方式。
 * 
 * @returns {Object} 返回一个Babel插件对象，包含visitor访问器模式定义
 */
function babelPluginImport() {
  return {
    visitor: {
      /**
       * 访问import声明节点的处理函数
       * 
       * @param {NodePath} nodePath 当前AST节点路径
       * @param {Object} state 插件状态对象，包含配置选项
       *   - opts.libraryName {string} 需要转换的目标库名称
       *   - opts.libraryDirectory {string} 库的目录路径，默认为'lib'
       */
      ImportDeclaration(nodePath, state){
        const { node } = nodePath; // 获取当前节点
        const { specifiers } = node; // 获取当前节点的子节点
        const { libraryName, libraryDirectory = 'lib' } = state.opts;
        if (node.source.value === libraryName
          && (!types.isImportDefaultSpecifier(specifiers[0]))
        ) {
          // 将具名导入转换为默认导入的代码生成逻辑
          const newImportDefaultSpecifier = specifiers.map(specifier => {
            const statement = `import ${specifier.local.name} from '${libraryName}/${specifier.imported.name}';`
            return template.statement(
              statement
            )();
          })
          nodePath.replaceWithMultiple(newImportDefaultSpecifier);
        }
      }
    }
  }
}

module.exports = babelPluginImport;