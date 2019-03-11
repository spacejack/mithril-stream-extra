import * as stream from 'mithril/stream'
import {Stream} from 'mithril/stream'
export {Stream} from 'mithril/stream'

declare module 'mithril/stream' {
	interface ReadonlyStream<T> {
		/** Returns the value of the stream. */
		(): T
		/** Creates a dependent stream whose value is set to the result of the callback function. */
		map(f: (current: T) => Stream<T> | T | void): Stream<T>
		/** Creates a dependent stream whose value is set to the result of the callback function. */
		map<U>(f: (current: T) => Stream<U> | U): Stream<U>
		/** This method is functionally identical to stream. It exists to conform to Fantasy Land's Applicative specification. */
		of(val?: T): Stream<T>
		/** Apply. */
		ap<U>(f: ReadonlyStream<(value: T) => U>): Stream<U>
		/** When a stream is passed as the argument to JSON.stringify(), the value of the stream is serialized. */
		toJSON(): string
		/** Returns the value of the stream. */
		valueOf(): T
	}

	// We can (almost) make this type using conditions...
	// type ReadOnlyStream<T> = {
	// 	[P in Exclude<keyof Stream<T>, 'end'>]: Stream<T>[P]
	// } & (() => T)

	interface Static {
		combine<T>(combiner: (...streams: ReadonlyStream<any>[]) => T, streams: ReadonlyStream<any>[]): Stream<T>
		merge(streams: ReadonlyStream<any>[]): Stream<any[]>
		scan<T, U>(fn: (acc: U, value: T) => U, acc: U, stream: ReadonlyStream<T>): Stream<U>
		scanMerge<T, U>(pairs: [ReadonlyStream<T>, (acc: U, value: T) => U][], acc: U): Stream<U>
		scanMerge<U>(pairs: [ReadonlyStream<any>, (acc: U, value: any) => U][], acc: U): Stream<U>
	}
}

import {ReadonlyStream as ReadonlyStream} from 'mithril/stream'

/**
 * Creates a ReadonlyStream from the source stream. The source can be writeable or readonly.
 */
export function readOnly<T>(s: ReadonlyStream<T>): ReadonlyStream<T> {
	const s2 = stream<T>()
	s.map(s2)
	return s2
}

/**
 * Combines the values of one or more streams into a single stream that is updated whenever one or more of the sources are updated
 * @param combiner A combiner function that receives the values of the source streams and returns the value of the dependent stream
 * @param streams One or more source streams
 * @returns A dependent stream containing a combined value from all source streams
 */
export function lift<A,Z>(fn: (a: A) => Z, s: ReadonlyStream<A>): Stream<Z>
export function lift<A,B,Z>(fn: (a: A, b: B) => Z, sa: ReadonlyStream<A>, sb: ReadonlyStream<B>): Stream<Z>
export function lift<A,B,C,Z>(fn: (a: A, b: B, c: C) => Z, sa: ReadonlyStream<A>, sb: ReadonlyStream<B>, sc: ReadonlyStream<C>): Stream<Z>
export function lift<A,B,C,D,Z>(fn: (a: A, b: B, c: C, d: D) => Z, sa: ReadonlyStream<A>, sb: ReadonlyStream<B>, sc: ReadonlyStream<C>, sd: ReadonlyStream<D>): Stream<Z>
export function lift<A,B,C,D,E,Z>(fn: (a: A, b: B, c: C, d: D, e: E) => Z, sa: ReadonlyStream<A>, sb: ReadonlyStream<B>, sc: ReadonlyStream<C>, sd: ReadonlyStream<D>, se: ReadonlyStream<E>): Stream<Z>
export function lift<A,B,C,D,E,F,Z>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => Z, sa: ReadonlyStream<A>, sb: ReadonlyStream<B>, sc: ReadonlyStream<C>, sd: ReadonlyStream<D>, se: ReadonlyStream<E>, sf: ReadonlyStream<F>): Stream<Z>
export function lift<T>(fn: (...values: any[]) => T, ...streams: ReadonlyStream<any>[]): Stream<T>  {
	return stream.merge(streams).map<T>(values => fn.apply(undefined, values))
}

/**
 * Creates a dependent stream that only updates when the source stream value differs from the previous
 * @param s The source stream
 * @returns The resulting dependent stream
 */
export function dropRepeats<T>(s: ReadonlyStream<T>): Stream<T> {
	let ready = false
	const d = stream<T>()
	s.map(v => {
		if (!ready || v !== d()) {
			ready = true
			d(v)
		}
	})
	return d
}

/**
 * Creates a dependent stream that will not emit any existing value for the stream.
 * This will only fire on future updates.
 */
export function dropInitial<T>(s: ReadonlyStream<T>) {
	let isset = false
	const e = stream<T>()
	s.map(x => (isset ? e(x) : isset = true, x))
	return isset ? e : s.map(x => x)
}
