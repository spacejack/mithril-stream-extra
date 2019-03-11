# Mithril Stream Extras

This library includes a few supplemental stream functions as well as a `ReadonlyStream` type which can be used to declare steam types that can only be read and not written to.

Additional functions include:

* `readOnly` for creating a dependent stream that cannot be written to
* `lift` is a more user-friendly `combine` that unwraps the stream values
* `dropRepeats` drops emits for values that are the same as the previous
* `dropInitial` omits initial values from the parent stream

See the `index.d.ts` for details.
