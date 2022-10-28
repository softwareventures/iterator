import test from "ava";
import {iterator, pushOnce, tailOnce, toArrayOnce} from "./index";

test("iterator", t => {
    t.true(iterator([]).next().done);
    const a = [1, 2, 3];
    const it = a[Symbol.iterator]();
    t.false(iterator(a).next().done);
    t.is(iterator(a).next().value, 1);
    t.is(iterator(it), it);
});

test("tailOnce", t => {
    t.deepEqual(toArrayOnce(tailOnce(iterator([1, 2, 3, 4]))), [2, 3, 4]);
    t.deepEqual(toArrayOnce(tailOnce(iterator([1]))), []);
    t.deepEqual(toArrayOnce(tailOnce(iterator([]))), []);
});

test("pushOnce", t => {
    t.deepEqual(toArrayOnce(pushOnce(iterator([1, 2, 3]), 4)), [1, 2, 3, 4]);
    t.deepEqual(toArrayOnce(pushOnce(iterator([]), 4)), [4]);
});
