type Cmp<T> = (a: T, b: T) => number;

export class SortedQueue<T> {
  private _cmp: Cmp<T>;
  private _array: Array<Item<T>>;

  constructor(cmp: Cmp<T> = defaultCmp) {
    this._cmp = cmp;
    this._array = [];
  }

  push(value: T): SortedQueueItem<T> {
    const item = new Item(
      value,
      (this as unknown) as InternalQueue<T>,
      this._array.length
    );
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

interface InternalQueue<T> {
  _cmp: Cmp<T>;
  _array: Array<Item<T>>;
}

class Item<T> {
  readonly value: T;
  _queue: InternalQueue<T> | null;
  _index: number;

  constructor(value: T, queue: InternalQueue<T>, index: number) {
    this.value = value;
    this._queue = queue;
    this._index = index;
  }

  pop(): boolean {
    const queue = this._queue;
    if (!queue) {
      return false;
    }
    const last = queue._array.pop();
    if (last && last !== this) {
      last._index = this._index;
      queue._array[this._index] = last;
      siftUp(queue._array, last, queue._cmp);
      siftDown(queue._array, last, queue._cmp);
    }
    this._queue = null;
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
    // ECMA-262, 7ᵗʰ Edition / June 2016:
    // "Every Array object has a length property whose value is always a nonnegative integer less than 2**32."
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
    if (cmp(child.value, item.value) <= 0) {
      swap(array, child, item);
    } else {
      return;
    }
  }
}
