import * as Stream from 'mithril/stream';
declare module 'mithril/stream' {
    interface ReadonlyStream<T> {
        /** Returns the value of the stream. */
        (): T;
        /** Creates a dependent stream whose value is set to the result of the callback function. */
        map<U>(f: (current: T) => U | typeof Stream.SKIP): Stream<U>;
        /** This method is functionally identical to stream. It exists to conform to Fantasy Land's Applicative specification. */
        of(value?: T): Stream<T>;
        /** Apply. */
        ap<U>(s: ReadonlyStream<(value: T) => U>): Stream<U>;
        /** A co-dependent stream that unregisters dependent streams when set to true. */
        end: Stream<boolean>;
        /** When a stream is passed as the argument to JSON.stringify(), the value of the stream is serialized. */
        toJSON(): string;
        /** Returns the value of the stream. */
        valueOf(): T;
    }
    interface Static {
        /** Creates a computed stream that reactively updates if any of its upstreams are updated. */
        combine<T>(combiner: (...streams: ReadonlyStream<any>[]) => T, streams: ReadonlyStream<any>[]): Stream<T>;
        /** Combines the values of one or more streams into a single stream that is updated whenever one or more of the sources are updated */
        lift<S extends any[], T>(fn: (...values: S) => T, ...streams: {
            [I in keyof S]: ReadonlyStream<S[I]>;
        }): Stream<T>;
        /** Creates a stream whose value is the array of values from an array of streams. */
        merge<S extends any[]>(streams: {
            [I in keyof S]: ReadonlyStream<S[I]>;
        }): Stream<{
            [I in keyof S]: S[I];
        }>;
        /** Creates a new stream with the results of calling the function on every incoming stream with and accumulator and the incoming value. */
        scan<T, U>(fn: (acc: U, value: T) => U, acc: U, stream: ReadonlyStream<T>): Stream<U>;
        /** Takes an array of pairs of streams and scan functions and merges all those streams using the given functions into a single stream. */
        scanMerge<T, U>(pairs: [ReadonlyStream<T>, (acc: U, value: T) => U][], acc: U): Stream<U>;
        /** Takes an array of pairs of streams and scan functions and merges all those streams using the given functions into a single stream. */
        scanMerge<U>(pairs: [ReadonlyStream<any>, (acc: U, value: any) => U][], acc: U): Stream<U>;
    }
}
import { ReadonlyStream } from 'mithril/stream';
export { ReadonlyStream } from 'mithril/stream';
/**
 * Creates a ReadonlyStream from the source stream.
 * The source can be writeable or readonly.
 * NOTE: No run-time checks are performed
 */
export declare function readOnly<T>(s: ReadonlyStream<T>): ReadonlyStream<T>;
/**
 * (Experimental!)
 * Creates a ReadonlyStream from the source stream.
 * The source can be writeable or readonly.
 * The returned stream performs run-time write checks.
 */
export declare function readOnlyRT<T>(s: ReadonlyStream<T>): ReadonlyStream<T>;
/**
 * Creates a dependent stream that only updates when the source stream value differs from the previous
 * @param s The source stream
 * @returns The resulting dependent stream
 */
export declare function dropRepeats<T>(s: Stream<T>): Stream<T>;
/**
 * Creates a dependent stream that will not emit any existing value for the stream.
 * This will only fire on future updates.
 */
export declare function dropInitial<T>(s: ReadonlyStream<T>): Stream<T>;
/**
 * Promise that resolves on stream's initial value
 */
export declare function one<T>(s: ReadonlyStream<T>): Promise<T>;
/**
 * Promise that resolves on stream's next value
 */
export declare function nextOne<T>(s: ReadonlyStream<T>): Promise<T>;
