export function swap(arr: number[], i: number, j: number) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

type SortAlgoFn = () => {}
export function testSort(sortFn: Function) {}