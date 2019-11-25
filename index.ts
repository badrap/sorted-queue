type Cmp<T> = (a: T, b: T) => number;

export class SortedQueue<T> {
  private _cmp: Cmp<T>;
  private _array: Item<T>[];

  constructor(cmp: Cmp<T> = defaultCmp) {
    this._cmp = cmp;
    this._array = [];
  }

  push(value: T): SortedQueueItem<T> {
    const item = new Item(value, this._array, this._array.length, this._cmp);
    const index = this._array.push(item);
    siftUp(this._array, item, this._cmp);
    return item;
  }

  peek(): SortedQueueItem<T> | undefined {
    return this._array.length > 0 ? this._array[0] : undefined;
  }

  pop(): SortedQueueItem<T> | undefined {
    const item = this.peek();
    if (!item) {
      return item;
    }
    item.pop();
    return item;
  }
}

class Item<T> {
  readonly value: T;
  _array: Item<T>[] | null;
  _index: number;
  _cmp: Cmp<T>;

  constructor(value: T, array: Item<T>[], index: number, cmp: Cmp<T>) {
    this.value = value;
    this._array = array;
    this._index = index;
    this._cmp = cmp;
  }

  pop(): boolean {
    const array = this._array;
    if (!array) {
      return false;
    }
    const last = array.pop();
    if (last && last !== this) {
      last._index = this._index;
      array[this._index] = last;
      siftUp(array, last, this._cmp);
      siftDown(array, last, this._cmp);
    }
    this._array = null;
    return true;
  }
}

declare class _SortedQueueItem<T> {
  private constructor();
  readonly value: T;
  pop(): boolean;
}
export const SortedQueueItem = (Item as unknown) as typeof _SortedQueueItem;
export type SortedQueueItem<T> = _SortedQueueItem<T>;

function defaultCmp(a: unknown, b: unknown): number {
  if (a === b) {
    return 0;
  }
  if (a !== a) {
    return b !== b ? 0 : -1;
  }
  return (b as any) < (a as any) || b !== b ? 1 : -1;
}

function swap<T>(array: Item<T>[], left: Item<T>, right: Item<T>): void {
  const li = left._index;
  const ri = right._index;
  array[li] = right;
  array[ri] = left;
  left._index = ri;
  right._index = li;
}

function siftUp<T>(array: Item<T>[], item: Item<T>, cmp: Cmp<T>): void {
  while (item._index > 0) {
    // `item._index - 1` is cast to uint32 in by the `>>> 1`, which could make
    // the value wrap around if `item._index` were larger than `2**32`.
    // But `item._index` is initialized from `Array#length` and according to
    // ECMA-262, 7ᵗʰ Edition / June 2016:
    //   "Every Array object has a length property whose value is always a
    //    nonnegative integer less than 2**32."
    const parent = array[(item._index - 1) >>> 1];
    if (cmp(parent.value, item.value) <= 0) {
      return;
    }
    swap(array, parent, item);
  }
}

function siftDown<T>(array: Item<T>[], item: Item<T>, cmp: Cmp<T>): void {
  for (;;) {
    const left = item._index * 2 + 1;
    if (left >= array.length) {
      return;
    }
    const right = left + 1;
    const child =
      right < array.length && cmp(array[right].value, array[left].value) < 0
        ? array[right]
        : array[left];
    if (cmp(child.value, item.value) > 0) {
      return;
    }
    swap(array, child, item);
  }
}
