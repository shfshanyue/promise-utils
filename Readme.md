[![NPM](https://nodei.co/npm/pp-map.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pp-map/)

# promise-map

[![npm version](https://img.shields.io/npm/v/pp-map.svg?style=flat-square)](https://www.npmjs.org/package/pp-map)
![build status](https://img.shields.io/github/workflow/status/shfshanyue/pp-map/test?style=flat-square)
[![install size](https://packagephobia.now.sh/badge?p=pp-map)](https://packagephobia.now.sh/result?p=pp-map)
[![npm downloads](https://img.shields.io/npm/dw/pp-map.svg?style=flat-square)](http://npm-stat.com/charts.html?package=pp-map)

promise-map control promises concurrently and support Promise.all and **allSettled**. It does not short-circuit when value is rejected if you need.

## Install

``` bash
$ npm install pp-map
```

## Usage

``` javascript
const promiseMap = require('pp-map')

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
```

### When value is rejected

``` javascript
const promiseMap = require('pp-map')
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
```


## API

### promiseMap(promises, mapper, options?)

#### promises

A list of promise or any value.

#### options

##### options.concurrency: Integer

Default: `Infinity`\
Minimum: `1`

##### options.settled: Boolean

