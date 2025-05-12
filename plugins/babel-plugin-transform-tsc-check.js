// 定义一个类型注解映射对象
const TypeAnnotationMap = {
  TSNumberKeyword: "NumericLiteral"
};

function tscPlugin(options) {
  return {
    // 在遍历开始前执行
    pre(file) {
      // 为当前文件设置一个空的 errors 数组
      file.set('errors', []);
    },
    visitor: {
      // 当访问 VariableDeclarator 节点时触发
      VariableDeclarator(nodePath, state) {
        // 获取之前设置的 errors 数组
        const errors = state.file.get('errors');
        const { node } = nodePath;
        // 获取变量声明的类型注解类型
        const idType = TypeAnnotationMap[node.id.typeAnnotation.typeAnnotation.type];
        // 获取变量初始值的类型
        const initType = node.init.type;
        // 如果变量声明类型与初始值类型不匹配
        if (idType !== initType) {
          // 禁用堆栈跟踪
          Error.stackTraceLimit = 0;
          // 将错误信息添加到 errors 数组中
          errors.push(nodePath.get('init').buildCodeFrameError(
            `${node.id.name} is ${idType}, but initialized with ${initType}`,
            Error
          ));
        }
      }
    },
    // 遍历结束后执行
    post(file) {
      // 在控制台输出 errors 数组的内容
      console.log(...file.get('errors'));
    }
  };
}

module.exports = tscPlugin