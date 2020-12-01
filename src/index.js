const { readFileSync } = require('fs');
const filePath = process.argv[2];
const fileContent = readFileSync(filePath).toString();
const Compactor = require('./Compactor');

const compactor = new Compactor();

// console.log(fileContent);

// compactor.compact(fileContent);

// console.log(compactor.codeMap);
// console.log(compactor.compactedString);

compactor.discompact('compact');