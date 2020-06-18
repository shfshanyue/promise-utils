function sleep (n) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, n * 1000)
  })
}
