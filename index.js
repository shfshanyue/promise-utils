class Limit {
  constructor (n) {
    this.limit = n
    this.count = 0
    this.queue = []
  }

  enqueue (fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
    })
  }

  dequeue () {
    if (this.count < this.limit && this.queue.length) {
      const { fn, resolve, reject } = this.queue.shift()
      this.run(fn).then(resolve).catch(reject)
    }
  }

  async run (fn) {
    this.count++
    const value = await fn()
    this.count--
    this.dequeue()
    return value
  }

  build (fn) {
    if (this.count < this.limit) {
      return this.run(fn)
    } else {
      return this.enqueue(fn)
    }
  }
}

function reflect (promise) {
  return promise.then(
    v => {
      return { status: 'fulfilled', value: v }
    },
    error => {
      return { status: 'rejected', reason: error }
    }
  )
}

module.exports = function (list, map, { concurrency = Infinity, settled = false } = {}) {
  const limit = new Limit(concurrency)
  return Promise.all(list.map((item, ...args) => {
    return limit.build(async () => {
      // Item may be promise
      const x = await item
      const result = map(x, ...args)
      return settled ? reflect(result) : result
    })
  }))
}
