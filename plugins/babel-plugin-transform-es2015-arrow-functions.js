/**
 * 用于 AST 节点的 Lodash 式工具库，包含构造、验证以及变换 AST 节点的方法
 */
const types = require('@babel/types');

/**
 * 在作用域中查找绑定 this 的标识符
 * @param {Object} scope - 作用域对象
 * @returns {Identifier|null} 返回绑定 this 的标识符，未找到返回 null
 */
function getThisBindingIdentifier(scope) {
  for (const bindingName in scope.bindings) {
    const binding = scope.bindings[bindingName];
    if (['const', 'let', 'var'].includes(binding.kind)) {
      const initVlaue = binding.path.node.init;
      if (types.isThisExpression(initVlaue)) {
        return binding.identifier;
      }
    }
  }
  return null;
}

/**
 * 收集路径中所有 this 表达式路径
 * @param {Object} path - AST 节点路径
 * @returns {Array} 包含所有 this 表达式路径的数组
 */
function getThisPaths(path) {
  const thisPaths = [];
  path.traverse({
    // 跳过函数声明避免内部 this 被收集
    FunctionDeclaration(path) {
      path.skip();
    },
    ThisExpression(path) {
      thisPaths.push(path);
    }
  });
  return thisPaths;
}

/**
 * 提升函数环境，处理 this 绑定问题
 * @param {Object} path - 箭头函数节点路径
 */
function hoistFunctionEnviroment(path) {
  // 查找最近的父级函数环境或程序作用域
  const thisEnv = path.findParent((parent) => {
    return (parent.isFunction() && !parent.isArrowFunctionExpression()) || parent.isProgram();
  });

  // 收集当前路径下的所有 this 使用
  const thisPaths = getThisPaths(path);
  
  // 检查当前作用域是否已存在 this 绑定
  let thisBinding = getThisBindingIdentifier(thisEnv.scope);
  
  // 不存在则创建新的 this 绑定
  if (!thisBinding) {
    thisBinding = types.identifier(thisEnv.scope.generateUid('this'));
    thisEnv.scope.push({
      id: thisBinding,
      init: types.thisExpression(),
    });
  }

  // 替换所有 this 表达式为绑定标识符
  if (thisPaths.length > 0) {
    thisPaths.forEach((thisPath) => {
      thisPath.replaceWith(thisBinding);
    });
  }
}

/**
 * Babel 插件：转换箭头函数的访问器对象
 */
const arrowFunctions = {
  visitor: {
    /**
     * 处理箭头函数表达式，转换为普通函数表达式
     * @param {Object} path - 箭头函数节点路径
     */
    ArrowFunctionExpression(path) {
      const { node } = path;
      // 提升函数环境处理 this 绑定
      hoistFunctionEnviroment(path);
      
      // 修改节点类型为普通函数表达式
      node.type = 'FunctionExpression';
      
      // 处理非块级语句的函数体
      const body = node.body;
      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([
          types.returnStatement(body),
        ]);
      }
    }
  }
}

module.exports = arrowFunctions;