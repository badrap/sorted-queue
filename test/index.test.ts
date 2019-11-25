import SortedQueue from "../index";
import { expect } from "chai";

describe("SortedQueue", () => {
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
