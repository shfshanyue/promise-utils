import { describe, it } from 'mocha'
import { expect } from 'chai'

import { filter } from '../index'

describe('Promise.filter', function () {
  it('expect work', async () => {
    const r1 = await filter([Promise.resolve(1), 2, 3, 4], (x: any) => Boolean(x % 2))
    const r2 = await filter([Promise.resolve(1), 2, 3, 4], (x: any) => Promise.resolve(Boolean(x % 2)))

    expect(r1).to.deep.equal([1, 3])
    expect(r2).to.deep.equal([1, 3])
  })
})
