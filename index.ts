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
