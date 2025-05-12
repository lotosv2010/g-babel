const babelCore = require('@babel/core');
const eslintPlugin = require('./plugins/babel-plugin-transform-eslint');

const code = `
  var a = 1;
  console.log(a);
  var b = 2;
`;

const eslint = (code) => {
  return babelCore.transformSync(code, {
    plugins: [
      eslintPlugin({
        fix: true
      })
    ]
  }).code;
  
}

const transformedCode = eslint(code);

console.log(transformedCode);