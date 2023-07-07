const fs = require('fs');
const esprima = require('esprima');


const code = fs.readFileSync('app.js', 'utf-8');
const ast = esprima.parseScript(code);

const functionCalls = {};

function traverse(node) {
  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
    const functionName = node.id ? node.id.name : '[anonymous]';

    if (!functionCalls[functionName]) {
      functionCalls[functionName] = [];
    }

    if (node.body && node.body.type === 'BlockStatement') {
      node.body.body.forEach(statement => {
        if (statement.type === 'ExpressionStatement' && statement.expression.type === 'CallExpression') {
          const calleeName = statement.expression.callee.name;

          if (!functionCalls[functionName].includes(calleeName)) {
            functionCalls[functionName].push(calleeName);
          }
        }
      });
    }
  }

  for (let key in node) {
    if (node.hasOwnProperty(key)) {
      const child = node[key];
      if (typeof child === 'object' && child !== null) {
        traverse(child);
      }
    }
  }
}

traverse(ast);

const appJson = {};

for (let functionName in functionCalls) {
  appJson[functionName] = functionCalls[functionName];
}

console.log(JSON.stringify(appJson, null, 2));
fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));