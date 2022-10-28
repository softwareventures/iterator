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
