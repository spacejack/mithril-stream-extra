"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream = require("mithril/stream");
/**
 * Creates a ReadonlyStream from the source stream. The source can be writeable or readonly.
 */
function readOnly(s) {
    var s2 = stream();
    s.map(s2);
    return s2;
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
