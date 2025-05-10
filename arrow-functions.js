// Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能
const babelCore = require('@babel/core');
// const arrowFunctions = require('babel-plugin-transform-es2015-arrow-functions');
const arrowFunctions = require('./plugins/babel-plugin-transform-es2015-arrow-functions');

const code = `
  const sum = (a,b)=>{
    console.log(this);
    return a+b;
  }
`;

const transformArrowFunctions = (code) => {
  return babelCore.transformSync(code, {
    plugins: [
      [arrowFunctions],
    ],
  }).code;
}

const transformedCode = transformArrowFunctions(code);
console.log(transformedCode);