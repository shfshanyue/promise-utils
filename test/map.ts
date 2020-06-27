import { describe, it } from 'mocha'
import { expect } from 'chai'
import timeSpan from 'time-span'

import { map, sleep } from '../index'

const input = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
  4,
  5,
  6
]

const addOne = async (n: number | Promise<number>) => {
  n = await n
  return n + 1
}

describe('Promise.map', function () {
  it('expect work', async () => {
    const r = await map(input, x => addOne(x))
    expect(r).to.deep.equal([2, 3, 4, 5, 6, 7])
  })

  it('expect work with concurrency', async () => {
    this.timeout(10000)

    const ts = timeSpan()
    const r = await map(input, async x => {
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
    const r = await map(input, async x => {
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
    const r = await map(input, async (x, i) => {
      await sleep(i * 100)
      return addOne(x)
    }, { concurrency: 2 })
    const time = ts()
    expect(r).to.deep.equal([2, 3, 4, 5, 6, 7])
    expect(time).to.above(900)
    expect(time).to.below(1000)
  })

})
