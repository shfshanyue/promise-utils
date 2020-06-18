interface RetryOptions {
  readonly times?: number;
  readonly onFailedAttempt?: (error: Error) => void | Promise<void>;
}

export async function retry <T>(
  run: (attemptCount: number) => Promise<T> | T,
  {
    times = 10,
    onFailedAttempt = () => {},
  }: RetryOptions = {}
) {
  let count = 0
  async function exec () {
    try {
      await run(count)
    } catch (e) {
      count++
      if (count < times) {
        await onFailedAttempt(e)
        await exec()
      } else {
        throw e
      }
    }
  }
  return exec()
}
