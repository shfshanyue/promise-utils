import { describe, it } from 'mocha'
import { expect } from 'chai'

import { AbortError, retry, sleep } from '../index'

describe('Promise.retry', function () {
  this.timeout(20000)

  it('expect work', async () => {
    let i = 0
    const result = 100

    const data = await retry(async attemptNumber => {
      i++
      return attemptNumber === 3 ? result : Promise.reject(new Error('error'))
    }, {
      times: 3
    })
  
    expect(data).to.eq(100)
    expect(i).to.eq(3)
  })

  it('abort', async () => {
    let i = 0
    const err = new AbortError('hello')

    try {
      await retry(async () => {
        i++
        return Promise.reject(err)
      }, {
        times: 3
      })
    } catch (e) {
      expect(e).to.equal(err)
    }
  
    expect(i).to.eq(1)
  })

  it('onFailedAttempt can return a promise to add a delay', async () => {

    const waitFor = 1000
    const start = Date.now()
    const result = 100
    let isCalled: boolean
  
    await retry(
      async () => {
        if (isCalled) {
          return result
        }
  
        isCalled = true
  
        throw new Error('error')
      },
      {
        onFailedAttempt: async () => {
          await sleep(waitFor)
        }
      }
    )
  
    expect(Date.now()).to.gt(start + waitFor)
  })
})
