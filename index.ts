import {equal as defaultEqual} from "@softwareventures/ordered";
import {hasProperty} from "unknown";

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
