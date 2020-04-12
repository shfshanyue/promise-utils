const promiseMap = require('..')

const addOne = n => Promise.resolve(n + 1)

const list = [
  Promise.resolve(3),
  Promise.resolve(4),
  Promise.resolve(5),
  6,
  7,
  8
]

// => [4, 5, 6, 7, 8, 9]
promiseMap(list, x => addOne(x), { concurrency: 3 }).then(o => { console.log(o) })
