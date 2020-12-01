/**
 * TO_DO: desfazer classe e tranformar seus métodos em funções
 */

const fs = require('fs');

class Compactor {
  /**
   * Compacta um arquivo em outro menor
   * @param {string} inputPath caminho para o arquivo que será lido 
   * @param {string} outputPath caminho para salvar o arquivo comprimido
   */
  compact(inputPath, outputPath){
    const fileContent = fs.readFileSync(inputPath).toString();
    const charCounter = {};
    for (const char of fileContent) {
      if (charCounter[char]) {
        charCounter[char]++;
      } else {
        charCounter[char] = 1;
      }
    }
    const charRanking = Object.entries(charCounter).sort((e1, e2) => e2[1] - e1[1]);
    let tree = charRanking.map(el => ({ 
      letter: el[0],
      value: el[1]
    }));
    const treeSize = tree.length;
    for(let i = 0; i < treeSize - 1; i++) {
      tree.sort((a, b) => b.value - a.value);
      const node1 = tree.pop();
      const node2 = tree.pop();
      tree.push({
        value: node1.value + node2.value, 
        left: node1, 
        right: node2
      });
    }
    tree = tree[0];
    const codeMap = {};
    this._createCodeMap(codeMap, tree);
    
    let encodedText = '';
    // criar string com o texto codificado
    for(const char of fileContent) {
      encodedText += codeMap[char];
    }
    // juntar todo hashMap para salvar na primeira linha do arquivo
    let fileHeader = Object.entries(codeMap).reduce((acc, cur, i, arr) => {
      let result = acc + `${cur[0]}${cur[1]}`;
      result += i < arr.length - 1 ? ',' : '';
      return result;
    }, '');

    fileHeader += process.platform === 'linux' ? '\n' : '\r\n';
    // juntar primeira linha com o texto codificado
    const textToSave = fileHeader + encodedText;

    fs.writeFileSync(outputPath, textToSave);
  }
  _createCodeMap(codeMap, tree) {
    this._fillCodeMap(codeMap, '', tree);
  }
  _fillCodeMap(letterCodeHash, steps, tree) {
    if(tree.letter) {
      letterCodeHash[tree.letter] = steps;
      return;
    }
    this._fillCodeMap(letterCodeHash, steps + '0', tree.left);
    this._fillCodeMap(letterCodeHash, steps + '1', tree.right);
  }
  /**
   * @param {object} codeMap 
   */
  _getTreeByEncodedText(codeMap) {
    let tree;
    let cur = tree = {};
    function moveLeft() {
      if (!cur.left) {
        cur = cur.left = {};
      } else {
        cur = cur.left;
      }
    }
    function moveRight() {
      if (!cur.right) {
        cur = cur.right = {};
      } else {
        cur = cur.right;
      }
    }
    function addLetter(lett) {
      cur.letter = lett;
      cur = tree;
    }
    Object.entries(codeMap).forEach(([letter, code]) => {
      for (const char of code) {
        char === '0' ? moveLeft() : moveRight();  
      }
      addLetter(letter);
    })
    return tree;
  }
  /**
   * @param {string} hashMapString 
   * @returns {object} 
   */
  _mountHashMap(hashMapString) {
    const codeMap = hashMapString.split(',');
    const hashMap = {};
    codeMap.forEach(el => {
      const elArray = el.split('');
      hashMap[elArray[0]] = elArray.slice(1, elArray.length).join('');
    });
    return hashMap;
  }
  discompact(inputPath, outputPath) {
    const fileContent = fs.readFileSync(inputPath).toString();
    const [ hashMapString, encodedText ] = fileContent.split(process.platform === 'linux' ? '\n' : '\r\n');
    const codeMap = this._mountHashMap(hashMapString);
    const tree = this._getTreeByEncodedText(codeMap);
    
    let currentNode = tree;
    let rawString = '';
    
    for(let i = 0; i <= encodedText.length; i++){
      if (currentNode.letter) {
        rawString += currentNode.letter;
        currentNode = tree;
      }
      if(encodedText[i] == '0') {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    fs.writeFileSync(outputPath, rawString);
  }
}

module.exports = Compactor; 
