"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stream = require("mithril/stream");
/**
 * Creates a ReadonlyStream from the source stream.
 * The source can be writeable or readonly.
 * NOTE: No run-time checks are performed
 */
function readOnly(s) {
    return s.map(function (x) { return x; });
}
exports.readOnly = readOnly;
/**
 * (Experimental!)
 * Creates a ReadonlyStream from the source stream.
 * The source can be writeable or readonly.
 * The returned stream performs run-time write checks.
 */
function readOnlyRT(s) {
    var rs = s.map(function (x) { return x; });
    // Provide run-time write checks
    function f() {
        if (arguments.length > 0) {
            throw new Error('Cannot write to a ReadonlyStream');
        }
        return rs();
    }
    Object.assign(f, rs);
    // rs.end is a getter, not copied by the assign.
    // Need to handle it specially.
    f.end = rs.end;
    return f;
}
exports.readOnlyRT = readOnlyRT;
var sentinel = {};
/**
 * Creates a dependent stream that only updates when the source stream value differs from the previous
 * @param s The source stream
 * @returns The resulting dependent stream
 */
function dropRepeats(s) {
    var prev = sentinel;
    return s.map(function (x) {
        var cur = prev;
        prev = x;
        return cur === x ? Stream.SKIP : x;
    });
}
exports.dropRepeats = dropRepeats;
/**
 * Creates a dependent stream that will not emit any existing value for the stream.
 * This will only fire on future updates.
 */
function dropInitial(s) {
    var isset = false;
    var e = Stream();
    s.map(function (x) { return (isset ? e(x) : isset = true, x); });
    return isset ? e : s.map(function (x) { return x; });
}
exports.dropInitial = dropInitial;
/**
 * Promise that resolves on stream's initial value
 */
function one(s) {
    return new Promise(function (resolve) {
        var child = sentinel;
        var dep = s.map(function (v) {
            var memo = child;
            child = undefined;
            if (memo != null) {
                resolve(v);
                if (sentinel !== memo)
                    memo.end(true);
            }
            return Stream.SKIP;
        });
        if (child == null)
            dep.end(true);
        else
            child = dep;
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
