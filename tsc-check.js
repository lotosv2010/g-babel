const { transformSync } = require('@babel/core');
const tscCheckPlugin = require('./plugins/babel-plugin-transform-tsc-check');

const code = `
  var age:number="12";
`;


const tscCheck = (code) => {
  return transformSync(code, {
    parserOpts: { 
      plugins: ['typescript'] 
    },
    plugins: [
      [tscCheckPlugin()],
    ],
  }).code;
}

const transformedCode = tscCheck(code);
console.log(transformedCode);