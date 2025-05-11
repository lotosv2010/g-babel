const types = require('@babel/types');
const importModuleHelper = require('@babel/helper-module-imports');
const template = require('@babel/template');
const pathLib = require('path');

/**
 * 自动日志插件，用于在指定的函数或类方法前插入日志记录语句。
 *
 * @param {Object} options - 插件配置选项。
 * @param {string} options.libName - 要导入的日志库名称。
 * @param {Array<string>} [options.fnNames] - 需要插入日志的函数名列表。
 * @returns {Object} 返回一个 Babel 插件对象。
 */
const autoLoggerPlugin = (options = {}) => {
  options = {
    libName: 'logger',
    fnNames: [],
    params: [],
    ...options,
  };
  return {
    visitor: {
      Program: {
        /**
         * 在遍历程序节点时，检查并处理日志库的导入。
         *
         * @param {NodePath} nodePath - 当前节点路径。
         * @param {Object} state - 遍历过程中传递的状态对象。
         */
        enter(nodePath, state) {
          let loggerId;
          nodePath.traverse({
            ImportDeclaration(nodePath) {
              // 获取导入库的名称
              const libName = nodePath.get('source').node.value;
              // 如果此导入语句导入的第三方模块和配置的日志第三方库名称一样
              if (options.libName === libName) {
                const specifierPath = nodePath.get('specifiers.0');
                if (specifierPath.isImportDefaultSpecifier()
                  || specifierPath.isImportNamespaceSpecifier()
                  || specifierPath.isImportSpecifier()
                ) {
                  loggerId = specifierPath.node.local;
                }
                nodePath.stop(); // 停止遍历
              }
            }
          });
          // 如果遍历完Program，loggerId还是空的，那说明在源码中尚未导入logger模块
          if (!loggerId) {
            const libName = pathLib.relative(
              state.file.opts.filename,
              options.libName
            ).replace(/\\/g, '/');
            loggerId = importModuleHelper.addDefault(nodePath, libName, {
              // 在Program作用域内生成一个不会与当前作用域内变量重复的变量名
              nameHint: nodePath.scope.generateUid(libName),
            })
          }
          // 使用template模块生成一个ast语法树节点,把一个字符串变成节点
          state.loggerNode = template.statement(`LOGGER_PLACE(${options.params.join(',')});`)({
            LOGGER_PLACE: loggerId.name
          })
        }
      },
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(nodePath, state) {
        const { node } = nodePath;
        let fnName;
        if (node.type === 'FunctionDeclaration') { // 函数声明
          fnName = node.id.name;
        } else if (node.type === 'FunctionExpression') { // 函数表达式
          fnName = nodePath.parent.id.name;
        } else if (node.type === 'ArrowFunctionExpression') { // 箭头函数
          fnName = nodePath.parent.id.name;
        } else if (node.type === 'ClassMethod') { // 类方法
          fnName = node.key.name;
        }

        if (!options.fnNames.length || options.fnNames.includes(fnName)) {
          if (types.isBlockStatement(node.body)) {
            node.body.body.unshift(state.loggerNode);
          } else {
            const newNode = types.blockStatement([
              state.loggerNode,
              types.returnStatement(node.body),
            ]);
            nodePath.get('body').replaceWith(newNode);
          }
        }
      }
    }
  }
}

module.exports = autoLoggerPlugin;