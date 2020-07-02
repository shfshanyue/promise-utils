# promise-utils

A few tools about promise, like delay, map, filter and retry.

[![npm version](https://img.shields.io/npm/v/@shanyue/promise-utils.svg?style=flat-square)](https://www.npmjs.org/package/@shanyue/promise-utils)
![build status](https://img.shields.io/github/workflow/status/shfshanyue/promise-utils/test?style=flat-square)
[![install size](https://packagephobia.now.sh/badge?p=@shanyue/promise-utils)](https://packagephobia.now.sh/result?p=@shanyue/promise-utils)
[![npm downloads](https://img.shields.io/npm/dw/@shanyue/promise-utils.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@shanyue/promise-utils)

## Install

``` bash
$ npm install @shanyue/promise-utils
```

> Require node > 10.x

## Usage

``` ts
import { map, filter, retry, sleep } from '@shanyue/promise-utils'


// Output: [2, 3, 4, 5]
await map([Promise.resolve(1), 2, 3, 4], (x: number) => x + 1)

// Output: [1, 3]
await filter([Promise.resolve(1), 2, 3, 4], (x: number) => Boolean(x % 2))

await sleep(300)

await retry(() => Promise.resolve(3), { times: 3 })
```

## API

### map(input, mapper, [options])

> Map promises concurrently 

+ `input`: Promise or any value
+ `mapper`: Expected to return a Promise or value.
+ `options.concurrency`: Number of concurrently pending promises.

``` ts
import { map } from '@shanyue/promise-utils'

// Output: [2, 3, 4, 5]
await map([Promise.resolve(1), 2, 3, 4], (x: number) => x + 1)

// Output: [2, 3, 4, 5]
await map([Promise.resolve(1), 2, 3, 4], (x: number) => Promise.resolve(x + 1))

// After 4 * 300ms，Output: [2, 3, 4, 5]
await map([1, 2, 3, 4], async x => {
  await sleep(300)
  return x + 1
}, { concurrency: 1 })
```

### filter(input, filterer, [options])

> Filter promises concurrently

+ `input`: Promise or any value.
+ `filterer`: Expected to return boolean-like value.
+ `options.concurrency`: Number of concurrently pending promises.

``` ts
import { filter } from '@shanyue/promise-utils'

// Output: [1, 3]
await filter([Promise.resolve(1), 2, 3, 4], (x: any) => Boolean(x % 2))

// Output: [1, 3]
await filter([Promise.resolve(1), 2, 3, 4], (x: any) => Promise.resolve(Boolean(x % 2)))
```

### retry(input, [options])

> Retry promise

+ `input`: Promise or any value.
+ `options.times`: Number of concurrently pending promises.
+ `options.attemptNumber`: Number of concurrently pending promises.

``` ts
import { retry, AbortError } from '@shanyue/promise-utils'

// Output: 'ok'
await retry(async attemptNumber => {
  return attemptNumber === 3 ? 'ok' : Promise.reject(new Error('error'))
}, {
  times: 3
})

// Output: 'ok'
await retry(async attemptNumber => {
  return attemptNumber === 3 ? 'ok' : Promise.reject(new Error('error'))
}, {
  times: 3,
  onFailedAttempt: async (e) => {
    console.log(e)
    // retry delay 1s
    await sleep(1000)
  }
})


// AbortError fail-fast
try {
  await retry(async () => {
    const err = new AbortError('hello')
    return Promise.reject(err)
  }, {
    times: 3
  })
} catch (e) {
}
```

### sleep(ms)

``` js
import { retry } from '@shanyue/promise-utils'

// delay 1s
await sleep(1000)
```