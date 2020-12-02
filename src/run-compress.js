const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  throw new Error('Missing arguments');
}

const { compress } = require('./compressor');

compress(inputPath, outputPath);
