const types = require('@babel/types');

/**
 * Babel插件：将ES6类声明转换为ES5原型继承模式
 * @property {Object} visitor - Babel访问者对象
 * @property {Function} visitor.ClassDeclaration - 类声明处理函数
 * @param {Object} visitor.ClassDeclaration.path - AST节点路径对象
 * @param {Object} visitor.ClassDeclaration.path.node - 类声明节点
 * @returns {void} 无显式返回值，通过path操作修改AST节点
 */
const transformClassesPlugin = {
  visitor: {
    /**
     * 处理类声明节点
     * @param {Object} path 节点路径对象
     * @param {Object} path.node 类声明节点
     * @returns {void} 无返回值
     */
    ClassDeclaration(path) {
      let node = path.node;
      let id = node.id;//Identifier name:Person
      let methods = node.body.body;//Array<MethodDefinition>
      
      // 存储转换后的节点集合
      let nodes = [];
      
      /**
       * 遍历类体方法
       * 处理构造函数和普通方法：
       * - 构造函数转换为函数声明
       * - 普通方法转换为原型链赋值表达式
       */
      methods.forEach(method => {
        if (method.kind === 'constructor') {
          // 构造函数处理逻辑
          let constructorFunction = types.functionDeclaration(
            id,
            method.params,
            method.body
          );
          nodes.push(constructorFunction);
        } else {
          // 原型方法处理逻辑
          let memberExpression = types.memberExpression(
            types.memberExpression(
              id, types.identifier('prototype')
            ), method.key
          )
          let functionExpression = types.functionExpression(
            null,
            method.params,
            method.body
          )
          let assignmentExpression = types.assignmentExpression(
            '=',
            memberExpression,
            functionExpression
          );
          nodes.push(assignmentExpression);
        }
      })
      
      /**
       * 节点替换逻辑
       * 根据转换结果数量选择替换策略：
       * - 单节点使用replaceWith
       * - 多节点使用replaceWithMultiple
       */
      if (nodes.length === 1) {
        // 单节点替换
        path.replaceWith(nodes[0]);
      } else {
        // 多节点批量替换
        path.replaceWithMultiple(nodes);
      }
    }
  }
}

module.exports = transformClassesPlugin;