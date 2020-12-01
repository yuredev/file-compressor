


let tree;
let cur = tree = {};

function left() {
  if (!cur.left) {
    cur = cur.left = {};
  } else {
    cur = cur.left;
  }
}

function right() {
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
