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

`draft2019-09` support is not ready, as the specification became increasingly more complex there,
aiming for more advanced JSON Schema features and extensibility.

Authors of this module think that it is more important to provide a reasonably safe and non-broken
version of validator and to fix the widespread security / correctness / usability issues of
JSON Schema validators first.

Patches for improving `draft2019-09` support are welcome, but as long as they don't overcomplicate
the existing code to the point of making it less readable/clear, and do not introduce security
issues.
