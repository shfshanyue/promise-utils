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

function map (list, maper, { concurrency = Infinity, settled = false } = {}) {
  const limit = new Limit(concurrency)
  return Promise.all(list.maper((item, ...args) => {
    return limit.build(async () => {
      // Item may be promise
      const x = await item
      const result = maper(x, ...args)
      return settled ? reflect(result) : result
    })
  }))
}
