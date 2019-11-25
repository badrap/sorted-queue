import { SortedQueue, SortedQueueItem } from "../index";
import { expect } from "chai";

describe("SortedQueue", () => {
  describe("constructor()", () => {
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

  describe("#push()", () => {
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
});

describe("SortedQueueItem", () => {
  describe("#pop", () => {
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

    it("should remove items from the middle of the queue and still keep the queue ordered", () => {
      const q = new SortedQueue();
      const i = q.push(1);
      q.push(0);
      q.push(2);
      i.pop();
      expect(q.pop()).to.have.property("value", 0);
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
  });
});
