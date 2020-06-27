import { map, MapOptions } from './map'

export async function filter<Element> (
  it: Iterable<Element>,
  filterer: (item: Element, index: number) => boolean | Promise<boolean>,
  options?: MapOptions
) : Promise<Element[]> {
  const list = await map<Element, [Element, boolean]>(it, async (item, index) => {
    const bool = await filterer(item, index)
    return [item, bool]
  }, options)
  const result = list.filter(([item, bool]) => bool)
  return result.map(x => x[0])
}
