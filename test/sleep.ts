import { describe, it } from 'mocha'
import { expect } from 'chai'

import { sleep } from '../index'

describe('Promise.sleep', function () {
  it('expect work', async () => {
    const start = Date.now()

    await sleep(800)

    expect(Date.now()).to.gte(start + 800)
  })
})
