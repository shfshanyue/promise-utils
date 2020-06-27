interface RetryOptions {
  readonly times?: number;
  readonly onFailedAttempt?: (error: Error) => void | Promise<void>;
}

export class AbortError extends Error {
  originalError: Error

  constructor(message: string | Error) {
    super()

    if (message instanceof Error) {
      this.originalError = message;
      ({message} = message)
    } else {
      this.originalError = new Error(message)
      this.originalError.stack = this.stack
    }

    this.name = 'AbortError'
    this.message = message
  }
}

export async function retry <T>(
  run: (attemptCount: number) => Promise<T> | T,
  {
    times = 10,
    onFailedAttempt = () => {},
  }: RetryOptions = {}
) {
  let count = 1
  async function exec (): Promise<T> {
    try {
      const result = await run(count)
      return result
    } catch (e) {
      if (count > times || e instanceof AbortError) {
        throw e
      }
      count++
      await onFailedAttempt(e)
      return exec()
    }
  }
  return exec()
}
