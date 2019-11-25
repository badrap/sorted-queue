type Cmp<T> = (a: T, b: T) => number;

export default class SortedQueue<T> {
  private _cmp: Cmp<T>;
  private _array: Array<Item<T>>;

  constructor(cmp: Cmp<T> = defaultCmp) {
    this._cmp = cmp;
    this._array = [];
  }

  push(value: T): void {
    const item = new Item(value, this, this._array.length);
    const index = this._array.push(item);
    siftUp(
      (this._array as unknown) as InternalItem<T>[],
      (item as unknown) as InternalItem<T>,
      this._cmp
    );
  }

  peek(): Item<T> | undefined {
    return this._array.length > 0 ? this._array[0] : undefined;
  }

  pop(): Item<T> | undefined {
    const item = this.peek();
    if (!item) {
      return item;
    }
    item.pop();
    return item;
  }
}

interface InternalSortedQueue<T> {
  _cmp: Cmp<T>;
  _array: Array<Item<T>>;
}

class Item<T> {
  readonly value: T;
  private _queue: InternalSortedQueue<T> | null;
  private _index: number;

  constructor(value: T, queue: SortedQueue<T>, index: number) {
    this.value = value;
    this._queue = (queue as unknown) as InternalSortedQueue<T>;
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
      siftDown(
        (queue._array as unknown) as InternalItem<T>[],
        (last as unknown) as InternalItem<T>,
        queue._cmp
      );
    }
    this._queue = null;
    return true;
  }
}

interface InternalItem<T> {
  readonly value: T;
  _queue: InternalSortedQueue<T> | null;
  _index: number;
}

function defaultCmp(a: unknown, b: unknown): number {
  if (a === b) {
    return 0;
  }
  if (a !== a) {
    return b !== b ? 0 : -1;
  }
  return (b as any) < (a as any) || b !== b ? 1 : -1;
}

function swap<T>(
  array: InternalItem<T>[],
  left: InternalItem<T>,
  right: InternalItem<T>
): void {
  const li = left._index;
  const ri = right._index;
  array[li] = right;
  array[ri] = left;
  left._index = ri;
  right._index = li;
}

function siftUp<T>(
  array: InternalItem<T>[],
  item: InternalItem<T>,
  cmp: Cmp<T>
): void {
  while (item._index > 0) {
    // ECMA-262, 7ᵗʰ Edition / June 2016:
    // "Every Array object has a length property whose value is always a nonnegative integer less than 2**32."
    const parent = array[(item._index / 2) >>> 0];
    if (cmp(parent.value, item.value) <= 0) {
      return;
    }
    swap(array, parent, item);
  }
}

function siftDown<T>(
  array: InternalItem<T>[],
  item: InternalItem<T>,
  cmp: Cmp<T>
): void {
  for (;;) {
    const left = item._index * 2 + 1;
    const right = left + 1;
    if (right < array.length && cmp(array[right].value, item.value) <= 0) {
      swap(array, array[right], item);
    } else if (left < array.length && cmp(array[left].value, item.value) <= 0) {
      swap(array, array[left], item);
    } else {
      return;
    }
  }
}
