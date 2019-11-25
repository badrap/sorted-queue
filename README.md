# sorted-queue [![npm](https://img.shields.io/npm/v/sorted-queue.svg)](https://www.npmjs.com/package/sorted-queue)

A sorted queue, based on an array-backed binary heap.

## Installation

```sh
$ npm install --save sorted-queue
```

## Usage

```ts
import SortedQueue from "../index";

const queue = new SortedQueue();

// `queue.push()` adds a value to the queue and returns an object
// `item` with the `item.value` set to the pushed value.
queue.push(1);        // { value: 1, ... }
queue.push(-1);       // { value: -1, ... }
queue.push(0);        // { value: 0, ... }

// `queue.peek()` returns the item with the smallest value.
queue.peek().value;   // -1

// `queue.pop()` returns the item with the smallest value
// and also removes it from the queue.
queue.pop().value;    // -1
queue.pop().value;    // 0
queue.pop().value;    // 1

// `pop()` and `peek()` return `undefined` when the queue is empty
queue.pop();          // undefined
queue.peek();         // undefined

// Items returned by push() can also be removed using `item.pop()`.
const first = queue.push(0);
const middle = queue.push(1);
const last = queue.push(2);

// `item.pop()` returns `true` if the item existed in the queue, and
// `false` if the item has already been removed previously.
middle.pop();         // true
middle.pop();         // false

// The order is preserved no matter from which position the item got
// removed from.
first.pop();          // true
queue.pop().value;    // 2
queue.pop();          // undefined

// For more complex sortings you can defined a custom comparison function
// (with the same signature as the comparison function Array#sort takes).
const custom = new SortedQueue<{ name: string }>((a, b) => a.name.localeCompare(b.name));
custom.push({ name: "Mallory" });
custom.push({ name: "Alice" });
custom.push({ name: "Bob" });
custom.pop().value;   // { name: "Alice" }
custom.pop().value;   // { name: "Bob" }
custom.pop().value;   // { name: "Mallory" }
```

## License

This library is licensed under the MIT license. See [LICENSE](./LICENSE).
