const { describe, it } = require('mocha')
const { expect } = require('chai')
const timeSpan = require('time-span')

const promiseMap = require('.')

const input = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
  4,
  5,
  6
]

const errorInput = [
  Promise.resolve(1),
  Promise.resolve(2),
  () => Promise.reject(4),
  () => Promise.reject(new Error('foo')),
  5,
  6
]

const addOne = async n => {
  if (typeof value === 'function') {
    n = await n()
  }
  return n + 1
}
const sleep = n => {
  return new Promise(resolve => {
    setTimeout(resolve, n)
  })
}

describe('Promise.map', function () {
  it('expect work', async () => {
    const r = await promiseMap(input, x => addOne(x))
    expect(r).to.deep.equal([2, 3, 4, 5, 6, 7])
  })

  it('expect work in concurrent', async () => {
    this.timeout(10000)

    const ts = timeSpan()
    const r = await promiseMap(input, async x => {
      await sleep(300)
      return addOne(x)
    }, { concurrency: 1 })
    const time = ts()
    expect(r).to.deep.equal([2, 3, 4, 5, 6, 7])
    expect(time).to.above(1800)
    expect(time).to.below(2000)
  })
})
