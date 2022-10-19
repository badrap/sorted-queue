import { SortedQueue, SortedQueueItem } from "../index";
import { describe, it, expect } from "vitest";

function collect<T>(queue: SortedQueue<T>): T[] {
  const array: T[] = [];
  for (;;) {
    const item = queue.pop();
    if (!item) {
      break;
    }
    array.push(item.value);
  }
  return array;
}

describe("SortedQueue", () => {
  describe("constructor(cmp?)", () => {
    it("should support custom comparison functions", () => {
      const q = new SortedQueue((a: number, b: number) => b - a);
      q.push(-1);
      q.push(1);
      q.push(0);
      expect(q.pop()).to.have.property("value", 1);
      expect(q.pop()).to.have.property("value", 0);
      expect(q.pop()).to.have.property("value", -1);
    });
  });

  describe("#push(value)", () => {
    it("should return an item with property 'value' set to the given value", () => {
      const q = new SortedQueue();
      const i = q.push(1);
      expect(i).to.have.property("value", 1);
    });

    it("should return a SortedQueueItem instance", () => {
      const q = new SortedQueue();
      const i = q.push(1);
      expect(i).to.be.instanceof(SortedQueueItem);
    });
  });

  describe("#pop()", () => {
    it("should return and remove the smallest queue item", () => {
      const q = new SortedQueue();
      q.push(1);
      q.push(0);
      q.push(2);
      expect(q.pop()).to.have.property("value", 0);
      expect(q.pop()).to.have.property("value", 1);
      expect(q.pop()).to.have.property("value", 2);
    });

    it("should return undefined when the queue is empty", () => {
      const q = new SortedQueue();
      expect(q.pop()).to.be.undefined;
    });
  });

  describe("#peek()", () => {
    it("should return but not remove the smallest queue item", () => {
      const q = new SortedQueue();
      q.push(1);
      q.push(0);
      expect(q.peek()).to.have.property("value", 0);
      expect(q.peek()).to.have.property("value", 0);
      q.push(-1);
      expect(q.peek()).to.have.property("value", -1);
    });

    it("should return undefined when the queue is empty", () => {
      const q = new SortedQueue();
      expect(q.pop()).to.be.undefined;
    });
  });

  describe("#empty()", () => {
    it("should return true for a newly created queue", () => {
      const q = new SortedQueue();
      expect(q.empty()).to.be.true;
    });

    it("should return false for a non-empty queue", () => {
      const q = new SortedQueue();
      q.push(1);
      expect(q.empty()).to.be.false;
    });

    it("should return true for a queue that has just been emptied", () => {
      const q = new SortedQueue();
      q.push(1);
      q.pop();
      expect(q.empty()).to.be.true;
    });
  });

  it("should preserve order", () => {
    const original = [];
    for (let i = 0; i < 1024; i++) {
      original.push(i);
    }

    const copy = original.slice();
    const queue = new SortedQueue();
    while (copy.length > 0) {
      const index = (Math.random() * copy.length) | 0;
      queue.push(copy[index]);
      copy.splice(index, 1);
    }

    expect(collect(queue)).to.deep.equal(original);
  });
});

describe("SortedQueueItem", () => {
  describe("#pop()", () => {
    it("should return true when the item existed in the queue", () => {
      const q = new SortedQueue();
      const i = q.push(1);
      expect(i.pop()).to.be.true;
    });

    it("should return false when the item did not exist in the queue", () => {
      const q = new SortedQueue();
      const i = q.push(1);
      i.pop();
      expect(i.pop()).to.be.false;
    });

    it("should remove items from the front of the queue and still keep the queue ordered", () => {
      const q = new SortedQueue();
      q.push(1);
      const i = q.push(0);
      q.push(2);
      i.pop();
      expect(q.pop()).to.have.property("value", 1);
      expect(q.pop()).to.have.property("value", 2);
    });

    it("should remove items from the end of the queue and still keep the queue ordered", () => {
      const q = new SortedQueue();
      q.push(1);
      q.push(0);
      const i = q.push(2);
      i.pop();
      expect(q.pop()).to.have.property("value", 0);
      expect(q.pop()).to.have.property("value", 1);
    });

    it("should keep ordering when the replacement item needs to be sifted up", () => {
      // Manufacture a situation where the replacement item popped
      // from the end of the backing array needs to be sifted up.
      const queue = new SortedQueue();
      const values = [0, 1000, 1, 1001, 1002, 2, 3, 1003, 1004, 1005, 1006, 4];
      const items = values.map(v => queue.push(v));
      items[3].pop();
      values.splice(3, 1);
      expect(collect(queue)).to.deep.equal(values.sort((a, b) => a - b));
    });

    it("should keep ordering when the replacement needs to be sifted down", () => {
      const queue = new SortedQueue();
      const values = [0, 1000, 1, 1001, 1002, 2, 3, 1003, 1004, 1005, 1006];
      const items = values.map(v => queue.push(v));
      items[2].pop();
      values.splice(2, 1);
      expect(collect(queue)).to.deep.equal(values.sort((a, b) => a - b));
    });
  });
});
