const babelCore  = require('@babel/core');
const autoLoggerPlugin = require('./plugins/babel-plugin-transform-auto-logger');

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
    plugins: [
      [autoLoggerPlugin({
        fnNames: ['sum', 'multiply', 'minis', 'divide'], // 默认是all
        libName: 'logger', // 默认是logger
        params: ['a', 'b', 'c'],
      })],
    ],
  }).code;
}

const transformedCode = autoLogger(code);
console.log(transformedCode);