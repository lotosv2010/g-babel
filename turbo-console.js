const babelCore = require('@babel/core');
const turboConsolePlugin = require('./plugins/babel-plugin-transform-turbo-console');

const code = `
  console.debug('debug')
  console.log('start');
  function name(params) {
    console.info(2);
    return 3;
  }
  console.error('end');
`;


const turboConsole = (code) => {
  return babelCore.transformSync(code, {
    filename:'any.js',
    plugins: [
      [turboConsolePlugin],
    ],
  }).code;
}

const transformedCode = turboConsole(code);
console.log(transformedCode);