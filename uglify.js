const babelCore = require('@babel/core');
const uglifyPlugin = require('./plugins/babel-plugin-transform-uglify');

const code = `
  var age = 12;
  console.log(age);
  var name = 'test';
  console.log(name)
`;

const uglify = (code) => {
  return babelCore.transformSync(code, {
    filename:'./some.js',
    plugins: [
      [
        uglifyPlugin({})
      ],
    ],
  }).code;
}

const transformedCode = uglify(code);
console.log(transformedCode);