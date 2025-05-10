const babelCore = require('@babel/core');
// const transformClassesPlugin = require('@babel/plugin-transform-classes');
const transformClassesPlugin = require('./plugins/babel-plugin-transform-classes');

const code = `
  class Person{
    constructor(name){
      this.name = name;
    }
    sayName(){
      console.log(this.name);
    }
  }
`;

const transformClasses = (code) => {
  return babelCore.transformSync(code, {
    plugins: [
      [transformClassesPlugin],
    ],
  }).code;
}

const transformedCode = transformClasses(code);
console.log(transformedCode);