const babelCore  = require('@babel/core');
const autoLoggerPlugin = require('./plugins/babel-plugin-transform-auto-logger');
const path = require('path');

const code = `
  // import logger from 'logger';
  function sum(a,b){
    return a+b;
  }
  const multiply = function(a,b){
    return a*b;
  }
  const minis = (a,b)=>a-b;
  class Math{
    divide(a,b){
      return a/b;
    }
  }
`;

const autoLogger = (code) => {
  return babelCore.transformSync(code, {
    filename: path.resolve(__dirname, 'test.js'),
    plugins: [
      [autoLoggerPlugin({
        fnNames: ['sum', 'multiply', 'minis', 'divide'], // 默认是all
        libName: path.resolve(__dirname, './logger'), // 'logger', // 默认是logger
        params: ['a', 'b', 'c'],
      })],
    ],
  }).code;
}

const transformedCode = autoLogger(code);
console.log(transformedCode);