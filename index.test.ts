import test from "ava";
import {
    dropOnce,
    dropUntilOnce,
    dropWhileOnce,
    emptyOnce,
    equalOnce,
    filterOnce,
    initialOnce,
    iterator,
    lastOnce,
    mapOnce,
    notEmptyOnce,
    notEqualOnce,
    onlyOnce,
    prefixMatchOnce,
    pushOnce,
    sliceOnce,
    tailOnce,
    takeOnce,
    takeUntilOnce,
    takeWhileOnce,
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

test("onlyOnce", t => {
    t.is(onlyOnce(iterator([])), null);
    t.is(onlyOnce(iterator([4])), 4);
    t.is(onlyOnce(iterator([3, 4, 5])), null);
});

test("emptyOnce", t => {
    t.is(emptyOnce(iterator([])), true);
    t.is(emptyOnce(iterator([1])), false);
    t.is(emptyOnce(iterator([1, 2, 3])), false);
});

test("notEmptyOnce", t => {
    t.is(notEmptyOnce(iterator([])), false);
    t.is(notEmptyOnce(iterator([1])), true);
    t.is(notEmptyOnce(iterator([1, 2, 3])), true);
});

test("sliceOnce", t => {
    t.deepEqual(toArrayOnce(sliceOnce(iterator([1, 2, 3, 4]), 1)), [2, 3, 4]);
    t.deepEqual(toArrayOnce(sliceOnce(iterator([1, 2, 3, 4, 5]), 1, 4)), [2, 3, 4]);
    t.deepEqual(toArrayOnce(sliceOnce(iterator([1, 2, 3]), 2)), [3]);
    t.deepEqual(toArrayOnce(sliceOnce(iterator([1, 2, 3]), 0, 2)), [1, 2]);
    t.deepEqual(toArrayOnce(sliceOnce(iterator([]), 3, 5)), []);
    t.deepEqual(toArrayOnce(sliceOnce(iterator([1, 2, 3]), 2, 0)), []);
    t.deepEqual(toArrayOnce(sliceOnce(iterator([1, 2, 3]), 1, 1)), []);
});

test("takeOnce", t => {
    t.deepEqual(toArrayOnce(takeOnce(iterator([]), 3)), []);
    t.deepEqual(toArrayOnce(takeOnce(iterator([1, 2]), 3)), [1, 2]);
    t.deepEqual(toArrayOnce(takeOnce(iterator([1, 2, 3, 4, 5]), 3)), [1, 2, 3]);
    t.deepEqual(toArrayOnce(takeOnce(iterator([1, 2, 3, 4, 5]), 0)), []);
});

test("dropOnce", t => {
    t.deepEqual(toArrayOnce(dropOnce(iterator([]), 3)), []);
    t.deepEqual(toArrayOnce(dropOnce(iterator([1, 2]), 3)), []);
    t.deepEqual(toArrayOnce(dropOnce(iterator([1, 2, 3, 4, 5]), 3)), [4, 5]);
    t.deepEqual(toArrayOnce(dropOnce(iterator([1, 2, 3, 4, 5]), 0)), [1, 2, 3, 4, 5]);
});

test("takeWhileOnce", t => {
    t.deepEqual(toArrayOnce(takeWhileOnce(iterator([]), (_, i) => i < 3)), []);
    t.deepEqual(toArrayOnce(takeWhileOnce(iterator([1, 2]), (_, i) => i < 3)), [1, 2]);
    t.deepEqual(toArrayOnce(takeWhileOnce(iterator([1, 2, 3, 4, 5]), (_, i) => i < 3)), [1, 2, 3]);
    t.deepEqual(toArrayOnce(takeWhileOnce(iterator([1, 2, 3, 4, 5]), () => false)), []);
    t.deepEqual(toArrayOnce(takeWhileOnce(iterator([1, 2, 3, 4, 3, 2, 1]), e => e < 4)), [1, 2, 3]);
});

test("takeUntilOnce", t => {
    t.deepEqual(toArrayOnce(takeUntilOnce(iterator([]), (_, i) => i >= 3)), []);
    t.deepEqual(toArrayOnce(takeUntilOnce(iterator([1, 2]), (_, i) => i >= 3)), [1, 2]);
    t.deepEqual(toArrayOnce(takeUntilOnce(iterator([1, 2, 3, 4, 5]), (_, i) => i >= 3)), [1, 2, 3]);
    t.deepEqual(toArrayOnce(takeUntilOnce(iterator([1, 2, 3, 4, 5]), () => true)), []);
    t.deepEqual(
        toArrayOnce(takeUntilOnce(iterator([1, 2, 3, 4, 3, 2, 1]), e => e >= 4)),
        [1, 2, 3]
    );
});

test("dropWhileOnce", t => {
    t.deepEqual(toArrayOnce(dropWhileOnce(iterator([]), (_, i) => i < 3)), []);
    t.deepEqual(toArrayOnce(dropWhileOnce(iterator([1, 2]), (_, i) => i < 3)), []);
    t.deepEqual(toArrayOnce(dropWhileOnce(iterator([1, 2, 3, 4, 5]), (_, i) => i < 3)), [4, 5]);
    t.deepEqual(
        toArrayOnce(dropWhileOnce(iterator([1, 2, 3, 4, 5]), () => false)),
        [1, 2, 3, 4, 5]
    );
    t.deepEqual(
        toArrayOnce(dropWhileOnce(iterator([1, 2, 3, 4, 3, 2, 1]), e => e < 4)),
        [4, 3, 2, 1]
    );
});

test("dropUntilOnce", t => {
    t.deepEqual(toArrayOnce(dropUntilOnce(iterator([]), (_, i) => i >= 3)), []);
    t.deepEqual(toArrayOnce(dropUntilOnce(iterator([1, 2]), (_, i) => i >= 3)), []);
    t.deepEqual(toArrayOnce(dropUntilOnce(iterator([1, 2, 3, 4, 5]), (_, i) => i >= 3)), [4, 5]);
    t.deepEqual(toArrayOnce(dropUntilOnce(iterator([1, 2, 3, 4, 5]), () => true)), [1, 2, 3, 4, 5]);
    t.deepEqual(
        toArrayOnce(dropUntilOnce(iterator([1, 2, 3, 4, 3, 2, 1]), e => e >= 4)),
        [4, 3, 2, 1]
    );
});

test("equalOnce", t => {
    t.true(equalOnce(iterator([1, 2, 3]), iterator([1, 2, 3])));
    t.false(equalOnce(iterator([1, 2, 3]), iterator([1, 2, 3, 4])));
    t.false(equalOnce(iterator([1, 2, 3, 4]), iterator([1, 2, 3])));
    t.false(equalOnce(iterator([1, 3, 3]), iterator([1, 2, 3])));
    t.true(
        equalOnce(
            iterator([iterator([1, 2]), iterator([3, 4])]),
            iterator([iterator([1, 2]), iterator([3, 4])]),
            equalOnce
        )
    );
    t.false(
        equalOnce(
            iterator([iterator([1, 2]), iterator([3, 4])]),
            iterator([iterator([1, 2]), iterator([3, 4])])
        )
    );
});

test("notEqualOnce", t => {
    t.false(notEqualOnce(iterator([1, 2, 3]), iterator([1, 2, 3])));
    t.true(notEqualOnce(iterator([1, 2, 3]), iterator([1, 2, 3, 4])));
    t.true(notEqualOnce(iterator([1, 2, 3, 4]), iterator([1, 2, 3])));
    t.true(notEqualOnce(iterator([1, 3, 3]), iterator([1, 2, 3])));
    t.false(
        notEqualOnce(
            iterator([iterator([1, 2]), iterator([3, 4])]),
            iterator([iterator([1, 2]), iterator([3, 4])]),
            equalOnce
        )
    );
    t.true(
        notEqualOnce(
            iterator([iterator([1, 2]), iterator([3, 4])]),
            iterator([iterator([1, 2]), iterator([3, 4])])
        )
    );
});

test("prefixMatchOnce", t => {
    t.true(prefixMatchOnce(iterator([]), iterator([])));
    t.true(prefixMatchOnce(iterator([1, 2, 3]), iterator([])));
    t.true(prefixMatchOnce(iterator([1, 2, 3, 4]), iterator([1, 2])));
    t.false(prefixMatchOnce(iterator([1, 3, 4]), iterator([1, 2])));
    t.false(prefixMatchOnce(iterator([]), iterator([1])));
});

test("mapOnce", t => {
    t.deepEqual(toArrayOnce(mapOnce(iterator([1, 2, 3]), e => e + 1)), [2, 3, 4]);
    t.deepEqual(
        toArrayOnce(mapOnce(iterator([1, 2, 3]), (e, i) => (i === 1 ? e * 10 : e))),
        [1, 20, 3]
    );
});

test("filterOnce", t => {
    t.deepEqual(toArrayOnce(filterOnce(iterator([1, 2, 3]), e => e % 2 === 1)), [1, 3]);
    t.deepEqual(
        toArrayOnce(filterOnce(iterator([1, 3, 2, 4, 5]), (_, i) => i % 2 === 0)),
        [1, 2, 5]
    );
});
