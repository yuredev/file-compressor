const { readFileSync } = require('fs');
const filePath = process.argv[1];
const fileContent = readFileSync(filePath).toString();
const Compactor = require('./Compactor');

const compactor = new Compactor();

compactor.compact(fileContent);
