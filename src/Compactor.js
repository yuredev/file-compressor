const fs = require('fs');

class Compactor {
  constructor() {
    this.codeMap = {};
    this.tree = null;
    this.compactedString = "";

  }
  compact(filePath){
    const string = fs.readFileSync(filePath).toString();
    this.lettersCount = {};
    for (const char of string) {
      if (this.lettersCount[char]) {
        this.lettersCount[char]++;
      } else {
        this.lettersCount[char] = 1;
      }
    }
    const entries = Object.entries(this.lettersCount);
    const sortedArray = entries.sort((e1, e2) => e2[1] - e1[1]);
    this.tree = sortedArray.map(el => ({ 
      letter: el[0],
      value: el[1]
    }));
    let num1, num2;
    const size = this.tree.length;
    for(let i = 0; i < size - 1; i++) {
      this.tree.sort((a, b) => b.value - a.value);
      num1 = this.tree.pop();
      num2 = this.tree.pop();
      this.tree.push({value: num1.value + num2.value, left: num1, right: num2});
    }
    
    this._createCodeMap();
    
    // criar string com o texto codificado
    for(const char of string) {
      this.compactedString += this.codeMap[char];
    }
    const hashEntries = Object.entries(this.codeMap);
    // pegar hashMap que vai estar na primeira linha do arquivo
    let hashToSave = hashEntries.reduce((acc, cur) => {
      return acc + `${cur[0]}${cur[1]},`;
    }, '');
    // transformar em array para tirar vírgula do final usando o pop
    hashToSave = hashToSave.split('');
    // tirar vírcula do final
    hashToSave.pop();
    // colocar quebra de linha
    hashToSave.push(process.platform === 'linux' ? '\n' : '\r\n');
    // transformar array em strong novamente
    hashToSave = hashToSave.join('');
    // juntar primeira linha com o texto codificado
    const textToSave = hashToSave + this.compactedString;

    fs.writeFileSync('compact', textToSave);
  }
  _createCodeMap() {
    this._fillCodeMap(this.codeMap, '', this.tree[0]);
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
  discompact(filePath) {

    const fileContent = fs.readFileSync(filePath).toString();

    const [ hashMapString, compactedString ] = fileContent.split(process.platform === 'linux' ? '\n' : '\r\n');
    
    const codeMap = this._mountHashMap(hashMapString);
    const tree = this._getTreeByEncodedText(codeMap);
    
    // let currentNode = this.tree[0];
    let currentNode = tree;
    let rawString = '';
    
    let i = 0;

    while(i <= compactedString.length){
      if (currentNode.letter) {
        rawString += currentNode.letter;
        currentNode = tree;
      }
      if(compactedString[i++] == '0') {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    fs.writeFileSync('output', rawString);
    
  }

}

module.exports = Compactor; 
