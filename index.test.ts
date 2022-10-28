import test from "ava";
import {iterator} from "./index";

test("iterator", t => {
    t.true(iterator([]).next().done);
    const a = [1, 2, 3];
    const it = a[Symbol.iterator]();
    t.false(iterator(a).next().done);
    t.is(iterator(a).next().value, 1);
    t.is(iterator(it), it);
});
