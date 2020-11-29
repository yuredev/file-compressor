class Compactor {
  constructor() {
    this.codeMap = {};
    this.tree = null;
  }
  compact(string) {
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
    /** TODO */
    // remover retorno e botar pra salvar num arquivo tlgd
    // escrever arvore
    this._createCodeMap();
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
  discompact() {

  }
}

module.exports = Compactor; 
