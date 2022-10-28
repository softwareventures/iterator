import {hasProperty} from "unknown";

export type IteratorLike<T> = Iterator<T> | Iterable<T>;

export function iterator<T>(iterator: IteratorLike<T>): Iterator<T> {
    return hasProperty(iterator, Symbol.iterator) ? iterator[Symbol.iterator]() : iterator;
}
