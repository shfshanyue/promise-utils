interface PromiseQueueItem {
  fn: () => any | Promise<any>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

export class Limit<T> {
  limit: number;
  count: number;
  queue: PromiseQueueItem[];

  constructor (limit: number) {
    this.limit = limit
    this.count = 0
    this.queue = []
  }

  enqueue<T> (fn: () => T | Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
    })
  }

  dequeue () {
    if (this.count < this.limit && this.queue.length) {
      const { fn, resolve, reject } = this.queue.shift()!
      this.run(fn).then(resolve).catch(reject)
    }
  }

  async run<T> (fn: () => T | Promise<T>) {
    this.count++
    const value = await fn()
    this.count--
    this.dequeue()
    return value
  }

  build<T> (fn: () => T | Promise<T>): Promise<T> {
    if (this.count < this.limit) {
      return this.run(fn)
    } else {
      return this.enqueue(fn)
    }
  }
}
