const promiseMap = require('..')

const addOne = n => Promise.resolve(n + 1)

const list = [
  Promise.resolve(3),
  Promise.reject(4),   // reject
  Promise.resolve(5),
  6,
  7,
  8
]

// => 'error', 4
promiseMap(list, x => addOne(x), { concurrency: 3 })
  .then(o => { console.log(o) })
  .catch(e => { console.error('error', e) })

//[ { status: 'fulfilled', value: 4 },
//  { status: 'rejected', reason: 5 },
//  { status: 'fulfilled', value: 6 },
//  { status: 'fulfilled', value: 7 } ]
//  { status: 'fulfilled', value: 8 },
//  { status: 'fulfilled', value: 9 } ]
promiseMap(list, x => addOne(x), { concurrency: 3, settled: true })
  .then(o => { console.log(o) })
  .catch(o => { console.error('error', e) })
