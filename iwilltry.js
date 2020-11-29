
const tree = [
  {letter:'m', value:1},
  {letter:'i', value:5},
  {letter:'s', value:4},
  {letter:'p', value:2},
  {letter:'r', value:2},
  {letter:'v', value:1},
  {letter:'e', value:1},
  {letter:'z', value:1},
]

/*
recursive(treeroot);
str = "000000111"



if(i.letter) {
  if(str[curstr] == "0") {
      return current.left;
  }
  else {
      return current.right;
  }
}
else {
   return descompactado = i.letter;
}

*/

// gerar a arvore;

let num1,num2;

const size = tree.length;

for(let i = 0; i < size - 1; i++) {
  tree.sort((a,b) => b.value - a.value);
  
  num1 = tree.pop();
  num2 = tree.pop();

  tree.push({value: num1.value + num2.value,left: num1,right: num2});
}

console.log("TREE", tree);

function percorcer(code, work, tree) {
  if(tree.letter) {
    code[tree.letter] = work;
    return;
  }
  percorcer(code, work + '0', tree.left);
  percorcer(code, work + '1', tree.right);
}

const hashMap = {};

percorcer(hashMap, '', tree[0]);

console.log(hashMap);
