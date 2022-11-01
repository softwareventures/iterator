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
