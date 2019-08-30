# Mithril Stream Extras

This library includes a few supplemental stream functions as well as a `ReadonlyStream` type which can be used to declare steam types that can only be read and not written to.

Additional functions include:

* `readOnly` for creating a dependent stream that cannot be written to
* `readOnlyRT` for creating a dependent stream that cannot be written to - with run-time checks
* `dropRepeats` drops emits for values that are the same as the previous
* `dropInitial` omits initial values from the parent stream
* `one` returns a Promise that resolves on stream's initial value
* `nextOne` returns a Promise that resolves on stream's next value

See the `index.d.ts` for details.
