import { Limit } from './limit'

export interface MapOptions {
  readonly concurrency?: number;
  readonly settled?: boolean;
}

export type Mapper<Element = any, NewElement = unknown> = (
  element: Element,
  index: number
) => NewElement | Promise<NewElement>;

export function map<Element, NewElement> (
  it: Iterable<Element>,
  mapper: Mapper<Element, NewElement>,
  { concurrency = Infinity }: MapOptions = {}
) {
  const limit = new Limit<NewElement>(concurrency)
  const list = Array.from(it)
  const listJob = list.map((item, index) => {
    return limit.build(async () => {
      // Item may be promise
      const x = await item
      const result = mapper(x, index)
      return result
    })
  })
  return Promise.all(listJob)
}
