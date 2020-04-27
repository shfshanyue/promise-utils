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

const err = new Error('foo')

const errorInput = [
  Promise.resolve(1),
  Promise.resolve(2),
  () => Promise.reject(3),
  () => Promise.reject(err),
  5,
  6
]

const output = [
  {
    status: 'fulfilled',
    value: 2
  },
  {
    status: 'fulfilled',
    value: 3
  },
  {
    status: 'fulfilled',
    value: 4
  },
  {
    status: 'fulfilled',
    value: 5
  },
  {
    status: 'fulfilled',
    value: 6
  },
  {
    status: 'fulfilled',
    value: 7
  }
]

const errorOutput = [
  {
    status: 'fulfilled',
    value: 2
  },
  {
    status: 'fulfilled',
    value: 3
  },
  {
    status: 'rejected',
    reason: 3
  },
  {
    status: 'rejected',
    reason: err
  },
  {
    status: 'fulfilled',
    value: 6
  },
  {
    status: 'fulfilled',
    value: 7
  }
]

const addOne = async n => {
  if (typeof n === 'function') {
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

  it('expect work with concurrency', async () => {
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

  it('expect work with concurrency 2', async () => {
    this.timeout(10000)

    const ts = timeSpan()
    const r = await promiseMap(input, async x => {
      await sleep(300)
      return addOne(x)
    }, { concurrency: 2 })
    const time = ts()
    expect(r).to.deep.equal([2, 3, 4, 5, 6, 7])
    expect(time).to.above(900)
    expect(time).to.below(1000)
  })

  it('expect work with concurrency 3', async () => {
    this.timeout(10000)

    const ts = timeSpan()
    const r = await promiseMap(input, async (x, i) => {
      await sleep(i * 100)
      return addOne(x)
    }, { concurrency: 2 })
    const time = ts()
    expect(r).to.deep.equal([2, 3, 4, 5, 6, 7])
    expect(time).to.above(900)
    expect(time).to.below(1000)
  })

  it('expect work with settled', async () => {
    const r = await promiseMap(input, async x => {
      return addOne(x)
    }, { settled: true })
    expect(r).to.deep.equal(output)
  })

  it('expect work with settled of reject', async () => {
    const r = await promiseMap(errorInput, async x => {
      return addOne(x)
    }, { settled: true })
    expect(r).to.deep.equal(errorOutput)
  })

  it('expect work with settled and concurrency', async () => {
    this.timeout(10000)

    const ts = timeSpan()
    const r = await promiseMap(input, async x => {
      await sleep(300)
      return addOne(x)
    }, { settled: true, concurrency: 1 })

    const time = ts()
    expect(r).to.deep.equal(output)
    expect(time).to.above(1800)
    expect(time).to.below(2000)
  })
})
