const object = {
  a: '01',
  b: '1011',
  c: '10'
};

const keys = Object.keys(object);
const values = Object.values(object);

const hashMap = new Map();

keys.forEach((el, index) => {
  hashMap.set(values[index], el);
});

const code = '1011';

console.log(hashMap.get(code));
