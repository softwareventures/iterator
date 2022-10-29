import test from "ava";
import {
    initialOnce,
    iterator,
    lastOnce,
    pushOnce,
    tailOnce,
    toArrayOnce,
    unshiftOnce
} from "./index";

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

test("unshiftOnce", t => {
    t.deepEqual(toArrayOnce(unshiftOnce(iterator([1, 2, 3]), 4)), [4, 1, 2, 3]);
    t.deepEqual(toArrayOnce(unshiftOnce(iterator([]), 4)), [4]);
});

test("initialOnce", t => {
    t.deepEqual(toArrayOnce(initialOnce(iterator([1, 2, 3, 4]))), [1, 2, 3]);
    t.deepEqual(toArrayOnce(initialOnce(iterator([1]))), []);
    t.deepEqual(toArrayOnce(initialOnce(iterator([]))), []);
});

test("lastOnce", t => {
    t.is(lastOnce(iterator([])), null);
    t.is(lastOnce(iterator([1, 2, 3])), 3);
});
