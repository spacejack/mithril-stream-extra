import * as stream from 'mithril/stream';
import { Stream } from 'mithril/stream';
export { Stream } from 'mithril/stream';
declare module 'mithril/stream' {
    interface ReadOnlyStream<T> {
        /** Returns the value of the stream. */
        (): T;
        /** Creates a dependent stream whose value is set to the result of the callback function. */
        map(f: (current: T) => Stream<T> | T | void): Stream<T>;
        /** Creates a dependent stream whose value is set to the result of the callback function. */
        map<U>(f: (current: T) => Stream<U> | U): Stream<U>;
        /** This method is functionally identical to stream. It exists to conform to Fantasy Land's Applicative specification. */
        of(val?: T): Stream<T>;
        /** Apply. */
        ap<U>(f: ReadOnlyStream<(value: T) => U>): Stream<U>;
        /** When a stream is passed as the argument to JSON.stringify(), the value of the stream is serialized. */
        toJSON(): string;
        /** Returns the value of the stream. */
        valueOf(): T;
    }
    interface Static {
        combine<T>(combiner: (...streams: ReadOnlyStream<any>[]) => T, streams: ReadOnlyStream<any>[]): Stream<T>;
        merge(streams: ReadOnlyStream<any>[]): Stream<any[]>;
        scan<T, U>(fn: (acc: U, value: T) => U, acc: U, stream: ReadOnlyStream<T>): Stream<U>;
        scanMerge<T, U>(pairs: [ReadOnlyStream<T>, (acc: U, value: T) => U][], acc: U): Stream<U>;
        scanMerge<U>(pairs: [ReadOnlyStream<any>, (acc: U, value: any) => U][], acc: U): Stream<U>;
    }
}
import { ReadOnlyStream } from 'mithril/stream';
/**
 * Creates a ReadOnlyStream from the source stream. The source can be writeable or readonly.
 */
export declare function readOnly<T>(s: ReadOnlyStream<T>): ReadOnlyStream<T>;
/**
 * Combines the values of one or more streams into a single stream that is updated whenever one or more of the sources are updated
 * @param combiner A combiner function that receives the values of the source streams and returns the value of the dependent stream
 * @param streams One or more source streams
 * @returns A dependent stream containing a combined value from all source streams
 */
export declare function lift<A, Z>(fn: (a: A) => Z, s: ReadOnlyStream<A>): Stream<Z>;
export declare function lift<A, B, Z>(fn: (a: A, b: B) => Z, sa: ReadOnlyStream<A>, sb: ReadOnlyStream<B>): Stream<Z>;
export declare function lift<A, B, C, Z>(fn: (a: A, b: B, c: C) => Z, sa: ReadOnlyStream<A>, sb: ReadOnlyStream<B>, sc: ReadOnlyStream<C>): Stream<Z>;
export declare function lift<A, B, C, D, Z>(fn: (a: A, b: B, c: C, d: D) => Z, sa: ReadOnlyStream<A>, sb: ReadOnlyStream<B>, sc: ReadOnlyStream<C>, sd: ReadOnlyStream<D>): Stream<Z>;
export declare function lift<A, B, C, D, E, Z>(fn: (a: A, b: B, c: C, d: D, e: E) => Z, sa: ReadOnlyStream<A>, sb: ReadOnlyStream<B>, sc: ReadOnlyStream<C>, sd: ReadOnlyStream<D>, se: ReadOnlyStream<E>): Stream<Z>;
export declare function lift<A, B, C, D, E, F, Z>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => Z, sa: ReadOnlyStream<A>, sb: ReadOnlyStream<B>, sc: ReadOnlyStream<C>, sd: ReadOnlyStream<D>, se: ReadOnlyStream<E>, sf: ReadOnlyStream<F>): Stream<Z>;
/**
 * Creates a dependent stream that only updates when the source stream value differs from the previous
 * @param s The source stream
 * @returns The resulting dependent stream
 */
export declare function dropRepeats<T>(s: ReadOnlyStream<T>): Stream<T>;
/**
 * Creates a dependent stream that will not emit any existing value for the stream.
 * This will only fire on future updates.
 */
export declare function dropInitial<T>(s: Stream<T>): stream.Stream<T>;
