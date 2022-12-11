import test from "ava";
import {
    allOnce,
    andOnce,
    anyOnce,
    appendOnce,
    averageOnce,
    concatMapOnce,
    concatOnce,
    containsOnce,
    dropOnce,
    dropUntilOnce,
    dropWhileOnce,
    emptyOnce,
    equalOnce,
    excludeFirstOnce,
    excludeNullOnce,
    excludeOnce,
    filterOnce,
    findIndexOnce,
    findOnce,
    fold1Once,
    foldOnce,
    indexOfOnce,
    indexOnce,
    initialOnce,
    iterator,
    lastOnce,
    mapOnce,
    maximumByOnce,
    maximumOnce,
    minimumByOnce,
    minimumOnce,
    noneNullOnce,
    notEmptyOnce,
    notEqualOnce,
    onlyOnce,
    orOnce,
    prefixMatchOnce,
    prependOnce,
    productOnce,
    pushOnce,
    removeFirstOnce,
    removeOnce,
    scan1Once,
    scanOnce,
    sliceOnce,
    sumOnce,
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

test("excludeOnce", t => {
    t.deepEqual(toArrayOnce(excludeOnce(iterator([1, 2, 3, 4, 3, 2, 1]), n => n < 3)), [3, 4, 3]);
});

test("excludeNullOnce", t => {
    t.deepEqual(toArrayOnce(excludeNullOnce(iterator(["a", null, "b"]))), ["a", "b"]);
});

test("excludeFirstOnce", t => {
    t.deepEqual(
        toArrayOnce(excludeFirstOnce(iterator([1, 2, 3, 4, 3, 2, 1]), n => n > 2)),
        [1, 2, 4, 3, 2, 1]
    );
});

test("removeOnce", t => {
    t.deepEqual(toArrayOnce(removeOnce(iterator([1, 2, 3, 4, 3, 2, 1]), 3)), [1, 2, 4, 2, 1]);
});

test("removeFirstOnce", t => {
    t.deepEqual(
        toArrayOnce(removeFirstOnce(iterator([1, 2, 3, 4, 3, 2, 1]), 3)),
        [1, 2, 4, 3, 2, 1]
    );
});

test("foldOnce", t => {
    t.is(
        foldOnce(iterator([1, 2, 3]), (a, e, i) => a + e * i, 0),
        8
    );
});

test("fold1Once", t => {
    t.is(
        fold1Once(iterator([1, 2, 3]), (a, e, i) => a + e * i),
        9
    );
});

test("indexOnce", t => {
    t.is(indexOnce(iterator([1, 2, 3, 4, 3, 2, 1]), 2), 3);
    t.is(indexOnce(iterator([1, 2, 3, 4, 3, 2, 1]), 7), null);
});

test("containsOnce", t => {
    t.true(containsOnce(iterator([1, 2, 3]), 1));
    t.false(containsOnce(iterator([1, 2, 3]), 0));
});

test("indexOfOnce", t => {
    t.is(indexOfOnce(iterator([1, 2, 3, 4, 3, 2, 1]), 3), 2);
    t.is(indexOfOnce(iterator([1, 2, 3, 4, 3, 2, 1]), 5), null);
});

test("findIndexOnce", t => {
    t.is(
        findIndexOnce(iterator([1, 2, 3, 4, 3, 2, 1]), n => n >= 3),
        2
    );
});

test("findOnce", t => {
    t.is(
        findOnce(iterator([1, 2, 3, 4, 3, 2, 1]), n => n >= 3),
        3
    );
});

test("maximumOnce", t => {
    t.is(maximumOnce(iterator([1, 2, 3])), 3);
    t.is(maximumOnce(iterator([1, 2, 3, 4, 3, 2, 1])), 4);
    t.is(maximumOnce(iterator([])), null);
});

test("maximumByOnce", t => {
    t.is(maximumByOnce(iterator(["1", "2", "3"]), Number), "3");
    t.is(maximumByOnce(iterator(["1", "2", "3", "4", "3", "2", "1"]), Number), "4");
    t.is(maximumByOnce(iterator([]), Number), null);
});

test("minimumOnce", t => {
    t.is(minimumOnce(iterator([1, 2, 3])), 1);
    t.is(minimumOnce(iterator([2, 3, 4, 1, 2, 3])), 1);
    t.is(minimumOnce(iterator([])), null);
});

test("minimumByOnce", t => {
    t.is(minimumByOnce(iterator(["1", "2", "3"]), Number), "1");
    t.is(minimumByOnce(iterator(["2", "3", "4", "1", "2", "3"]), Number), "1");
    t.is(minimumByOnce(iterator([]), Number), null);
});

test("sumOnce", t => {
    t.is(sumOnce(iterator([1, 2, 3])), 6);
    t.is(sumOnce(iterator([])), 0);
});

test("productOnce", t => {
    t.is(productOnce(iterator([1, 2, 3])), 6);
    t.is(productOnce(iterator([1, 2, 3, 2])), 12);
    t.is(productOnce(iterator([])), 1);
});

test("averageOnce", t => {
    t.is(averageOnce(iterator([1, 2, 3])), 2);
    t.is(averageOnce(iterator([1, 2, 3, 2])), 2);
    t.is(averageOnce(iterator([])), null);
});

test("andOnce", t => {
    t.true(andOnce(iterator([true, true, true])));
    t.false(andOnce(iterator([true, false, true])));
    t.true(andOnce(iterator([])));
});

test("orOnce", t => {
    t.true(orOnce(iterator([true, false, true])));
    t.false(orOnce(iterator([false, false, false])));
    t.false(orOnce(iterator([])));
});

test("anyOnce", t => {
    t.true(anyOnce(iterator([1, 2, 3]), e => e > 2));
    t.false(anyOnce(iterator([1, 2, 3]), e => e > 4));
});

test("allOnce", t => {
    t.true(allOnce(iterator([1, 2, 3]), e => e < 4));
    t.false(allOnce(iterator([1, 2, 3]), e => e > 2));
});

test("concatOnce", t => {
    t.deepEqual(
        toArrayOnce(
            concatOnce(iterator([iterator([1, 2]), iterator([]), iterator([3]), iterator([4, 5])]))
        ),
        [1, 2, 3, 4, 5]
    );
    t.deepEqual(toArrayOnce(concatOnce(iterator([iterator([]), iterator([])]))), []);
});

test("prependOnce", t => {
    t.deepEqual(
        toArrayOnce(prependOnce(iterator([1, 2, 3]))(iterator([4, 5, 6]))),
        [1, 2, 3, 4, 5, 6]
    );
    t.deepEqual(toArrayOnce(prependOnce(iterator<number>([]))(iterator([4, 5, 6]))), [4, 5, 6]);
    t.deepEqual(toArrayOnce(prependOnce(iterator([1, 2, 3]))(iterator([]))), [1, 2, 3]);
});

test("appendOnce", t => {
    t.deepEqual(
        toArrayOnce(appendOnce(iterator([4, 5, 6]))(iterator([1, 2, 3]))),
        [1, 2, 3, 4, 5, 6]
    );
    t.deepEqual(toArrayOnce(appendOnce(iterator<number>([]))(iterator([1, 2, 3]))), [1, 2, 3]);
    t.deepEqual(toArrayOnce(appendOnce(iterator([4, 5, 6]))(iterator([]))), [4, 5, 6]);
});

test("concatMapOnce", t => {
    t.deepEqual(toArrayOnce(concatMapOnce(iterator(["1,2,3", "4,5,6"]), s => s.split(","))), [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
    ]);
});

test("noneNullOnce", t => {
    t.deepEqual(noneNullOnce(iterator([1, 2, 3])), [1, 2, 3]);
    t.is(noneNullOnce(iterator([1, null, 3])), null);
    t.is(noneNullOnce(iterator([undefined, 2, 3])), null);
    t.deepEqual(noneNullOnce(iterator([])), []);
});

test("scanOnce", t => {
    t.deepEqual(toArrayOnce(scanOnce(iterator([1, 2, 3]), (a, e, i) => a + e * i, 0)), [0, 2, 8]);
    t.deepEqual(
        toArrayOnce(scanOnce(iterator(["a", "b", "c"]), (a, e, i) => `${a} ${i} ${e}`, "_")),
        ["_ 0 a", "_ 0 a 1 b", "_ 0 a 1 b 2 c"]
    );
});

test("scan1Once", t => {
    t.deepEqual(toArrayOnce(scan1Once(iterator([1, 2, 3]), (a, e, i) => a + e * i)), [1, 3, 9]);
});
