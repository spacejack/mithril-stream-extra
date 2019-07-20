"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream = require("mithril/stream");
/**
 * Creates a ReadonlyStream from the source stream.
 * The source can be writeable or readonly.
 * NOTE: Compile-time safety only. No run-time error will be thrown.
 */
function readOnly(s) {
    // TODO: How to add run-time check?
    return s.map(function (x) { return x; });
}
exports.readOnly = readOnly;
function lift(fn) {
    var streams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        streams[_i - 1] = arguments[_i];
    }
    return stream.merge(streams).map(function (values) { return fn.apply(undefined, values); });
}
exports.lift = lift;
/**
 * Creates a dependent stream that only updates when the source stream value differs from the previous
 * @param s The source stream
 * @returns The resulting dependent stream
 */
function dropRepeats(s) {
    var ready = false;
    var d = stream();
    s.map(function (v) {
        if (!ready || v !== d()) {
            ready = true;
            d(v);
        }
    });
    return d;
}
exports.dropRepeats = dropRepeats;
/**
 * Creates a dependent stream that will not emit any existing value for the stream.
 * This will only fire on future updates.
 */
function dropInitial(s) {
    var isset = false;
    var e = stream();
    s.map(function (x) { return (isset ? e(x) : isset = true, x); });
    return isset ? e : s.map(function (x) { return x; });
}
exports.dropInitial = dropInitial;
/**
 * Promise that resolves on stream's initial value
 */
function one(s) {
    return new Promise(function (resolve) {
        var done = false;
        var s1;
        s1 = s.map(function (v) {
            if (done) {
                return;
            }
            done = true;
            if (s1 != null) {
                s1.end(true);
            }
            resolve(v);
        });
        if (done) {
            s1.end(true);
        }
    });
}
exports.one = one;
/**
 * Promise that resolves on stream's next value
 */
function nextOne(s) {
    var ds = dropInitial(s);
    return one(ds);
}
exports.nextOne = nextOne;
