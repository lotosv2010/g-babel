const babelCore = require('@babel/core');
// const transformRemoveConsolePlugin = require('babel-plugin-transform-remove-console');
const transformRemoveConsolePlugin = require('./plugins/babel-plugin-transform-remove-console');

const code = `
  console.lo('start');
  function name(params) {
    console.log(2);
    return 3;
  }
    console.log('end');
`;


const transformRemoveConsole = (code) => {
  return babelCore.transformSync(code, {
    plugins: [
      [transformRemoveConsolePlugin],
    ],
  }).code;
}

const transformedCode = transformRemoveConsole(code);
console.log(transformedCode);