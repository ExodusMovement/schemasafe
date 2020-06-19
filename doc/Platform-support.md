# Platform support

If `toModule()` API is used, there are two separate stages:
  1. Code generation: `toModule()` usage,
  2. Generated code: loading and using the generated validator/parser modules.

If code generation is done in runtime, those two stages are merged into a single one.

Both of those stages should work natively in modern browsers and Node.js versions
[supported by upstream](https://github.com/nodejs/Release#release-schedule).

---

For code clarity and performance, compatibility with older platform versions than which are
supported by upstream is not targeted in this package, but that should be possible by using
[Babel](https://github.com/babel/babel).

Depending on the use-case, that might require either processing just the generated code with Babel,
or processing both the generated code and the library itself. Note that during code generation, a
global `URL` API is used.
