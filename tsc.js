const babelCore = require('@babel/core');
const tscPlugin = require('./plugins/babel-plugin-transform-tsc');

const code = `
  var age: number = '18';
`;

const tsc = (code) => {
  return babelCore.transformSync(code, {
    parserOpts: {
      plugins: ['typescript']
    },
    filename: './some.js',
    plugins: [
      [tscPlugin({})],
    ],
  }).code;
}

const transformedCode = tsc(code);
console.log(transformedCode);

