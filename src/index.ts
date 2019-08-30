import * as Stream from 'mithril/stream'

// Modified module typedefs to provide readonly stream support
declare module 'mithril/stream' {
	interface ReadonlyStream<T> {
		/** Returns the value of the stream. */
		(): T
		/** Creates a dependent stream whose value is set to the result of the callback function. */
		map<U>(f: (current: T) => U | typeof Stream.SKIP): Stream<U>
		/** This method is functionally identical to stream. It exists to conform to Fantasy Land's Applicative specification. */
		of(value?: T): Stream<T>
		/** Apply. */
		ap<U>(s: ReadonlyStream<(value: T) => U>): Stream<U>
		/** A co-dependent stream that unregisters dependent streams when set to true. */
		end: Stream<boolean>
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
		/** Creates a computed stream that reactively updates if any of its upstreams are updated. */
		combine<T>(combiner: (...streams: ReadonlyStream<any>[]) => T, streams: ReadonlyStream<any>[]): Stream<T>
		/** Combines the values of one or more streams into a single stream that is updated whenever one or more of the sources are updated */
		lift<S extends any[], T>(fn: (...values: S) => T, ...streams: {[I in keyof S]: ReadonlyStream<S[I]>}): Stream<T>
		/** Creates a stream whose value is the array of values from an array of streams. */
		merge<S extends any[]>(streams: {[I in keyof S]: ReadonlyStream<S[I]>}): Stream<{[I in keyof S]: S[I]}>
		/** Creates a new stream with the results of calling the function on every incoming stream with and accumulator and the incoming value. */
		scan<T, U>(fn: (acc: U, value: T) => U, acc: U, stream: ReadonlyStream<T>): Stream<U>
		/** Takes an array of pairs of streams and scan functions and merges all those streams using the given functions into a single stream. */
		scanMerge<T, U>(pairs: [ReadonlyStream<T>, (acc: U, value: T) => U][], acc: U): Stream<U>
		/** Takes an array of pairs of streams and scan functions and merges all those streams using the given functions into a single stream. */
		scanMerge<U>(pairs: [ReadonlyStream<any>, (acc: U, value: any) => U][], acc: U): Stream<U>
	}
}

import {ReadonlyStream} from 'mithril/stream'
export {ReadonlyStream} from 'mithril/stream'

/**
 * Creates a ReadonlyStream from the source stream.
 * The source can be writeable or readonly.
 * NOTE: No run-time checks are performed
 */
export function readOnly<T>(s: ReadonlyStream<T>): ReadonlyStream<T> {
	return s.map(x => x)
}

/**
 * (Experimental!)
 * Creates a ReadonlyStream from the source stream.
 * The source can be writeable or readonly.
 * The returned stream performs run-time write checks.
 */
export function readOnlyRT<T>(s: ReadonlyStream<T>): ReadonlyStream<T> {
	const rs = s.map(x => x)
	// Provide run-time write checks
	function f() {
		if (arguments.length > 0) {
			throw new Error('Cannot write to a ReadonlyStream')
		}
		return rs()
	}
	Object.assign(f, rs)
	// rs.end is a getter, not copied by the assign.
	// Need to handle it specially.
	f.end = rs.end
	return f as any as ReadonlyStream<T>
}

const sentinel = {}

/**
 * Creates a dependent stream that only updates when the source stream value differs from the previous
 * @param s The source stream
 * @returns The resulting dependent stream
 */
export function dropRepeats<T>(s: Stream<T>) {
	let prev = sentinel
	return s.map(x => {
		const cur = prev
		prev = x
		return cur === x ? Stream.SKIP : x
	})
}

/**
 * Creates a dependent stream that will not emit any existing value for the stream.
 * This will only fire on future updates.
 */
export function dropInitial<T>(s: ReadonlyStream<T>): Stream<T> {
	let isset = false
	const e = Stream<T>()
	s.map(x => (isset ? e(x) : isset = true, x))
	return isset ? e : s.map(x => x)
}

/**
 * Promise that resolves on stream's initial value
 */
export function one<T>(s: ReadonlyStream<T>) {
	return new Promise<T>(resolve => {
		let child: any = sentinel
		const dep = s.map(v => {
			const memo = child
			child = undefined
			if (memo != null) {
				resolve(v)
				if (sentinel !== memo) memo.end(true)
			}
			return Stream.SKIP
		})
		if (child == null) dep.end(true)
		else child = dep
	})
}

/**
 * Promise that resolves on stream's next value
 */
export function nextOne<T>(s: ReadonlyStream<T>): Promise<T> {
	const ds = dropInitial(s)
	return one(ds)
}
