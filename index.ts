import type {Comparator} from "@softwareventures/ordered";
import {compare as defaultCompare, equal as defaultEqual, reverse} from "@softwareventures/ordered";
import {hasProperty} from "unknown";
import {isNotNull} from "@softwareventures/nullable";

export type IteratorLike<T> = Iterator<T> | Iterable<T>;

export function iterator<T>(iterator: IteratorLike<T>): Iterator<T> {
    return hasProperty(iterator, Symbol.iterator) ? iterator[Symbol.iterator]() : iterator;
}

const toIterator = iterator;

export function toArrayOnce<T>(iterator: IteratorLike<T>): T[] {
    const it = toIterator(iterator);
    const array: T[] = [];
    let element = it.next();
    while (element.done !== true) {
        array.push(element.value);
        element = it.next();
    }
    return array;
}

export function toSetOnce<T>(iterator: IteratorLike<T>): Set<T> {
    const it = toIterator(iterator);
    const set = new Set<T>();
    let element = it.next();
    while (element.done !== true) {
        set.add(element.value);
        element = it.next();
    }
    return set;
}

export function firstOnce<T>(iterator: IteratorLike<T>): T | null {
    const it = toIterator(iterator);
    const element = it.next();
    if (element.done === true) {
        return null;
    } else {
        return element.value;
    }
}

export function tailOnce<T>(iterator: IteratorLike<T>): Iterator<T> {
    const it = toIterator(iterator);
    it.next();
    return it;
}

export function pushOnce<T>(iterator: IteratorLike<T>, value: T): Iterator<T> {
    const it = toIterator(iterator);
    let next = (): IteratorResult<T> => {
        const element = it.next();
        if (element.done === true) {
            next = () => ({done: true, value: undefined});
            return {value};
        } else {
            return element;
        }
    };
    return {next: () => next()};
}

export function pushOnceFn<T>(value: T): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => pushOnce(iterator, value);
}

export function unshiftOnce<T>(iterator: IteratorLike<T>, value: T): Iterator<T> {
    const it = toIterator(iterator);
    let next = (): IteratorResult<T> => {
        next = () => it.next();
        return {value};
    };
    return {next: () => next()};
}

export function unshiftOnceFn<T>(value: T): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => unshiftOnce(iterator, value);
}

export function initialOnce<T>(iterator: IteratorLike<T>): Iterator<T> {
    const it = toIterator(iterator);
    let prev = it.next();
    return {
        next: () => {
            const element = it.next();
            if (element.done === true) {
                return element;
            } else {
                const result = prev;
                prev = element;
                return result;
            }
        }
    };
}

export function lastOnce<T>(iterator: IteratorLike<T>): T | null {
    const it = toIterator(iterator);
    let last = it.next();
    if (last.done === true) {
        return null;
    }
    let element = it.next();
    while (element.done !== true) {
        last = element;
        element = it.next();
    }
    return last.value;
}

export function onlyOnce<T>(iterator: IteratorLike<T>): T | null {
    const it = toIterator(iterator);
    const first = it.next();
    if (first.done === true) {
        return null;
    }
    const second = it.next();
    if (second.done === true) {
        return first.value;
    } else {
        return null;
    }
}

export function emptyOnce<T>(iterator: IteratorLike<T>): boolean {
    return toIterator(iterator).next().done === true;
}

export function notEmptyOnce<T>(iterator: IteratorLike<T>): boolean {
    return !emptyOnce(iterator);
}

export function sliceOnce<T>(iterator: IteratorLike<T>, start = 0, end = Infinity): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const done: IteratorResult<T> = {done: true, value: undefined};
    const before = (): IteratorResult<T> => {
        let element = it.next();
        while (i++ < start && element.done !== true) {
            element = it.next();
        }

        if (element.done === true) {
            next = after;
            return done;
        } else {
            next = during;
            return element;
        }
    };
    const during = (): IteratorResult<T> => {
        const element = it.next();
        if (i++ < end && element.done !== true) {
            return element;
        } else {
            next = after;
            return done;
        }
    };
    const after = (): IteratorResult<T> => done;
    let next = end <= start ? after : before;
    return {next: () => next()};
}

export function sliceOnceFn<T>(
    start: number,
    end = Infinity
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => sliceOnce(iterator, start, end);
}

export function takeOnce<T>(iterator: IteratorLike<T>, count: number): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const done: IteratorResult<T> = {done: true, value: undefined};
    const during = (): IteratorResult<T> => {
        const element = it.next();
        if (i++ < count && element.done !== true) {
            return element;
        } else {
            next = after;
            return done;
        }
    };
    const after = (): IteratorResult<T> => done;
    let next = count <= 0 ? after : during;
    return {next: () => next()};
}

export function takeOnceFn<T>(count: number): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => takeOnce(iterator, count);
}

export function dropOnce<T>(iterator: IteratorLike<T>, count: number): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const before = (): IteratorResult<T> => {
        let element = it.next();
        while (i++ < count && element.done !== true) {
            element = it.next();
        }

        next = during;
        return element;
    };
    const during = (): IteratorResult<T> => it.next();
    let next = count <= 0 ? during : before;
    return {next: () => next()};
}

export function dropOnceFn<T>(count: number): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => dropOnce(iterator, count);
}

export function takeWhileOnce<T, U extends T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => element is U
): Iterator<U>;
export function takeWhileOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T>;
export function takeWhileOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const done: IteratorResult<T> = {done: true, value: undefined};
    const during = (): IteratorResult<T> => {
        const element = it.next();
        if (element.done !== true && predicate(element.value, i++)) {
            return element;
        } else {
            next = after;
            return done;
        }
    };
    const after = (): IteratorResult<T> => done;
    let next = during;
    return {next: () => next()};
}

export function takeWhileOnceFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterator: IteratorLike<T>) => Iterator<U>;
export function takeWhileOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T>;
export function takeWhileOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => takeWhileOnce(iterator, predicate);
}

export function takeUntilOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const done: IteratorResult<T> = {done: true, value: undefined};
    const during = (): IteratorResult<T> => {
        const element = it.next();
        if (element.done !== true && !predicate(element.value, i++)) {
            return element;
        } else {
            next = after;
            return done;
        }
    };
    const after = (): IteratorResult<T> => done;
    let next = during;
    return {next: () => next()};
}

export function takeUntilOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => takeUntilOnce(iterator, predicate);
}

export function dropWhileOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const before = (): IteratorResult<T> => {
        let element = it.next();
        while (element.done !== true && predicate(element.value, i++)) {
            element = it.next();
        }
        next = during;
        return element;
    };
    const during = (): IteratorResult<T> => it.next();
    let next = before;
    return {next: () => next()};
}

export function dropWhileOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => dropWhileOnce(iterator, predicate);
}

export function dropUntilOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const before = (): IteratorResult<T> => {
        let element = it.next();
        while (element.done !== true && !predicate(element.value, i++)) {
            element = it.next();
        }
        next = during;
        return element;
    };
    const during = (): IteratorResult<T> => it.next();
    let next = before;
    return {next: () => next()};
}

export function dropUntilOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => dropUntilOnce(iterator, predicate);
}

export function equalOnce<T>(
    a: IteratorLike<T>,
    b: IteratorLike<T>,
    elementsEqual: (a: T, b: T) => boolean = defaultEqual
): boolean {
    const ait = toIterator(a);
    const bit = toIterator(b);
    let aElement = ait.next();
    let bElement = bit.next();
    while (
        aElement.done !== true &&
        bElement.done !== true &&
        elementsEqual(aElement.value, bElement.value)
    ) {
        aElement = ait.next();
        bElement = bit.next();
    }
    return aElement.done === true && bElement.done === true;
}

export function equalOnceFn<T>(
    b: IteratorLike<T>,
    elementsEqual: (a: T, b: T) => boolean = defaultEqual
): (a: IteratorLike<T>) => boolean {
    return a => equalOnce(a, b, elementsEqual);
}

export function notEqualOnce<T>(
    a: IteratorLike<T>,
    b: IteratorLike<T>,
    elementsEqual: (a: T, b: T) => boolean = defaultEqual
): boolean {
    return !equalOnce(a, b, elementsEqual);
}

export function notEqualOnceFn<T>(
    b: IteratorLike<T>,
    elementsEqual: (a: T, b: T) => boolean = defaultEqual
): (a: IteratorLike<T>) => boolean {
    return a => !equalOnce(a, b, elementsEqual);
}

export function prefixMatchOnce<T>(
    a: IteratorLike<T>,
    b: IteratorLike<T>,
    elementsEqual: (a: T, b: T) => boolean = defaultEqual
): boolean {
    const ait = toIterator(a);
    const bit = toIterator(b);
    let aElement = ait.next();
    let bElement = bit.next();
    while (
        aElement.done !== true &&
        bElement.done !== true &&
        elementsEqual(aElement.value, bElement.value)
    ) {
        aElement = ait.next();
        bElement = bit.next();
    }
    return bElement.done === true;
}

export function prefixMatchOnceFn<T>(
    b: IteratorLike<T>,
    elementsEqual: (a: T, b: T) => boolean = defaultEqual
): (a: IteratorLike<T>) => boolean {
    return a => prefixMatchOnce(a, b, elementsEqual);
}

export function mapOnce<T, U>(
    iterator: IteratorLike<T>,
    f: (element: T, index: number) => U
): Iterator<U> {
    const it = toIterator(iterator);
    let i = 0;
    const done: IteratorResult<U> = {done: true, value: undefined};
    const during = (): IteratorResult<U> => {
        const element = it.next();
        if (element.done === true) {
            next = after;
            return done;
        } else {
            return {value: f(element.value, i++)};
        }
    };
    const after = (): IteratorResult<U> => done;
    let next = during;
    return {next: () => next()};
}

export function mapOnceFn<T, U>(
    f: (element: T, index: number) => U
): (iterator: IteratorLike<T>) => Iterator<U> {
    return iterator => mapOnce(iterator, f);
}

export function filterOnce<T, U extends T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => element is U
): Iterator<U>;
export function filterOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T>;
export function filterOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    return {
        next: () => {
            let element = it.next();
            while (element.done !== true && !predicate(element.value, i++)) {
                element = it.next();
            }
            return element;
        }
    };
}

export function filterOnceFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterator: IteratorLike<T>) => Iterator<U>;
export function filterOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T>;
export function filterOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => filterOnce(iterator, predicate);
}

export function excludeOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T> {
    return filterOnce(iterator, (element, index) => !predicate(element, index));
}

export function excludeOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => filterOnce(iterator, (element, index) => !predicate(element, index));
}

export function excludeNullOnce<T>(iterator: IteratorLike<T | null | undefined>): Iterator<T> {
    return filterOnce(iterator, isNotNull);
}

export function excludeFirstOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): Iterator<T> {
    const it = toIterator(iterator);
    let i = 0;
    const before = (): IteratorResult<T> => {
        const element = it.next();
        if (element.done !== true && !predicate(element.value, i++)) {
            return element;
        }
        next = after;
        return it.next();
    };
    const after = (): IteratorResult<T> => it.next();
    let next = before;
    return {next: () => next()};
}

export function excludeFirstOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => excludeFirstOnce(iterator, predicate);
}

export function removeOnce<T>(iterator: IteratorLike<T>, value: T): Iterator<T> {
    return excludeOnce(iterator, element => element === value);
}

export function removeOnceFn<T>(value: T): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => removeOnce(iterator, value);
}

export function removeFirstOnce<T>(iterator: IteratorLike<T>, value: T): Iterator<T> {
    return excludeFirstOnce(iterator, element => element === value);
}

export function removeFirstOnceFn<T>(value: T): (iterator: IteratorLike<T>) => Iterator<T> {
    return iterator => removeFirstOnce(iterator, value);
}

export function foldOnce<T, U>(
    iterator: IteratorLike<T>,
    f: (accumulator: U, element: T, index: number) => U,
    initial: U
): U {
    const it = toIterator(iterator);
    let element = it.next();
    let accumulator = initial;
    let i = 0;
    while (element.done !== true) {
        accumulator = f(accumulator, element.value, i++);
        element = it.next();
    }
    return accumulator;
}

export function foldOnceFn<T, U>(
    f: (accumulator: U, element: T, index: number) => U,
    initial: U
): (iterator: IteratorLike<T>) => U {
    return iterator => foldOnce(iterator, f, initial);
}

export function fold1Once<T>(
    iterator: IteratorLike<T>,
    f: (accumulator: T, element: T, index: number) => T
): T {
    const it = toIterator(iterator);
    const element = it.next();

    if (element.done === true) {
        throw new TypeError("fold1Once: empty Iterator");
    }

    return foldOnce(
        it,
        (accumulator, element, index) => f(accumulator, element, index + 1),
        element.value
    );
}

export function fold1OnceFn<T>(
    f: (accumulator: T, element: T, index: number) => T
): (iterator: IteratorLike<T>) => T {
    return iterator => fold1Once(iterator, f);
}

export function indexOnce<T>(iterator: IteratorLike<T>, index: number): T | null {
    if (index < 0 || !isFinite(index) || Math.floor(index) !== index) {
        throw new RangeError("illegal index");
    }

    const it = toIterator(iterator);
    let element = it.next();
    for (let i = 0; element.done !== true && i < index; ++i) {
        element = it.next();
    }

    if (element.done === true) {
        return null;
    } else {
        return element.value;
    }
}

export function indexOnceFn<T>(index: number): (iterator: IteratorLike<T>) => T | null {
    return iterator => indexOnce(iterator, index);
}

export function containsOnce<T>(iterator: IteratorLike<T>, value: T): boolean {
    const it = toIterator(iterator);
    let element = it.next();
    while (element.done !== true) {
        if (element.value === value) {
            return true;
        }
        element = it.next();
    }
    return false;
}

export function containsOnceFn<T>(value: T): (iterator: IteratorLike<T>) => boolean {
    return iterator => containsOnce(iterator, value);
}

export function indexOfOnce<T>(iterator: IteratorLike<T>, value: T): number | null {
    const it = toIterator(iterator);
    let element = it.next();
    for (let i = 0; element.done !== true; ++i) {
        if (element.value === value) {
            return i;
        }
        element = it.next();
    }
    return null;
}

export function indexOfOnceFn<T>(value: T): (iterator: IteratorLike<T>) => number | null {
    return iterator => indexOfOnce(iterator, value);
}

export function findIndexOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): number | null {
    const it = toIterator(iterator);
    let element = it.next();
    for (let i = 0; element.done !== true; ++i) {
        if (predicate(element.value, i)) {
            return i;
        }
        element = it.next();
    }
    return null;
}

export function findIndexOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => number | null {
    return iterator => findIndexOnce(iterator, predicate);
}

export function findOnce<T, U extends T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => element is U
): U | null;
export function findOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): T | null;
export function findOnce<T>(
    iterator: IteratorLike<T>,
    predicate: (element: T, index: number) => boolean
): T | null {
    const it = toIterator(iterator);
    let element = it.next();
    for (let i = 0; element.done !== true; ++i) {
        if (predicate(element.value, i)) {
            return element.value;
        }
        element = it.next();
    }
    return null;
}

export function findOnceFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterator: IteratorLike<T>) => U | null;
export function findOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => T | null;
export function findOnceFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterator: IteratorLike<T>) => T | null {
    return iterator => findOnce(iterator, predicate);
}

export function maximumOnce<T extends string | number | boolean>(
    iterator: IteratorLike<T>
): T | null;
export function maximumOnce<T>(iterator: IteratorLike<T>, compare: Comparator<T>): T | null;
export function maximumOnce<T>(iterator: IteratorLike<T>, compare?: Comparator<T>): T | null {
    return internalMaximumOnce(iterator, compare ?? (defaultCompare as unknown as Comparator<T>));
}

export function maximumOnceFn<T>(compare: Comparator<T>): (iterator: IteratorLike<T>) => T | null {
    return iterator => internalMaximumOnce(iterator, compare);
}

function internalMaximumOnce<T>(iterator: IteratorLike<T>, compare: Comparator<T>): T | null {
    const it = toIterator(iterator);
    let element = it.next();

    if (element.done === true) {
        return null;
    }

    let max = element.value;
    element = it.next();
    while (element.done !== true) {
        if (compare(element.value, max) > 0) {
            max = element.value;
        }
        element = it.next();
    }

    return max;
}

export function maximumByOnce<T>(
    iterator: IteratorLike<T>,
    select: (element: T, index: number) => number
): T | null {
    const it = toIterator(iterator);
    let element = it.next();

    if (element.done === true) {
        return null;
    }

    let max = element.value;
    let maxBy = select(element.value, 0);
    element = it.next();
    for (let i = 1; element.done !== true; ++i) {
        const by = select(element.value, i);
        if (by > maxBy) {
            max = element.value;
            maxBy = by;
        }
        element = it.next();
    }

    return max;
}

export function maximumByOnceFn<T>(
    select: (element: T, index: number) => number
): (iterator: IteratorLike<T>) => T | null {
    return iterator => maximumByOnce(iterator, select);
}

export function minimumOnce<T extends string | number | boolean>(
    iterator: IteratorLike<T>
): T | null;
export function minimumOnce<T>(iterator: IteratorLike<T>, compare: Comparator<T>): T | null;
export function minimumOnce<T>(iterator: IteratorLike<T>, compare?: Comparator<T>): T | null {
    return internalMaximumOnce(
        iterator,
        reverse(compare ?? (defaultCompare as unknown as Comparator<T>))
    );
}

export function minimumOnceFn<T>(compare: Comparator<T>): (iterator: IteratorLike<T>) => T | null {
    return iterator => internalMaximumOnce(iterator, reverse(compare));
}
