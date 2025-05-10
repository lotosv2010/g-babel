# g-babel

## 项目说明

`g-babel` 是一个用于学习和研究 Babel 核心功能及常用插件的开源项目。该项目旨在帮助开发者深入理解 Babel 的工作原理，特别是其在代码转换和语法解析方面的应用。

### 主要特性

- **Babel 核心功能分析**：探索 Babel 的基本工作流程和架构设计。
- **ES2015 箭头函数转换**：演示如何使用 Babel 插件将 ES2015 箭头函数转换为传统函数表达式。
- **插件开发指南**：提供自定义 Babel 插件的开发示例和最佳实践。

## 项目结构

```text
├── LICENSE
├── README.md
├── arrow-functions.js
├── plugins/
│   └── babel-plugin-transform-es2015-arrow-functions.js
├── package.json
└── node_modules/
```

### 目录说明

- `plugins/`：包含自定义或第三方 Babel 插件。
- `arrow-functions.js`：示例文件，展示箭头函数的原始写法及其转换过程。

## 安装与使用

### 安装依赖

首先确保你已经安装了 [Node.js](https://nodejs.org) 和 [pnpm](https://pnpm.io/)。然后运行以下命令安装项目依赖：

```bash
pnpm install
```

### 使用方法

1. **运行转换**：

   ```bash
   npx babel arrow-functions.js --out-file transformed.js
   ```

2. **查看转换结果**：
   转换后的代码将保存在 `transformed.js` 文件中。

### 自定义插件开发

如果你想开发自己的 Babel 插件，可以参考 `plugins/` 目录下的示例。每个插件应该导出一个默认函数，该函数返回一个访问者对象（visitor object），用于定义 AST 节点的访问逻辑。

## 许可证

本项目采用 [ISC License](LICENSE)，详情请参阅 LICENSE 文件。

## 贡献指南

欢迎任何形式的贡献！如果你有任何想法、问题或建议，请提交 issue 或 pull request。

## 致谢

感谢 [Babel](https://babeljs.io/) 团队提供的强大工具，以及所有为本项目做出贡献的人。
