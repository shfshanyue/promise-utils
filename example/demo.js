const pMap = require('..')

const list = [
  Promise.resolve(3),
  Promise.reject(30),
  Promise.reject(40),
  Promise.reject(50),
  Promise.resolve(4),
  Promise.resolve(5),
]

pMap(list, x => x + 1, {
  settled: true
}).then(o => { console.log(o) }).catch(e => console.error('error', e))
