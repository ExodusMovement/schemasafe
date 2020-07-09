# Specification support

Currently supported target JSON Schema versions are `draft04`, `draft06`, `draft07`.

If you notice issues with any of those draft versions support, please file an issue here and / or
a test case to [JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite)
which is used in this project to ensure correctness.

---

`draft03` and below are not supported, though for convenience some compatibility with it is present,
but it is advised to migrate the schemas to newer specification versions.\
Most likely, any patches to improve `draft03` support would be rejected.

---

`draft2019-09` support is not ready, but in the works. Most tests pass, unsupported functionality
will throw errors on compliation, so attempts to use `draft2019-09` should be safe as long as the
schema compiles successfully.
