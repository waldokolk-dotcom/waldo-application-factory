# API 0.2.0

`http.mjs` supplies bounded input and RFC 9457-style problem responses. `connector.mjs` performs JSON requests only to an explicit HTTPS origin allowlist, strips ambient credentials, refuses redirects, limits duration and bytes, validates media type and normalizes upstream failures to a 502-class error. Supply deliberate authorization headers inside a product-specific adapter after identity and scope checks; the generic connector never forwards them.

`openapi.mjs` creates and validates a minimal OpenAPI 3.1 contract. Every operation must have a stable `operationId` and a documented 2xx response. Consumers keep their full schema beside the adapter, validate request bodies at the boundary and test live success plus negative authorization. Rollback by pinning the previous block version; never widen the origin allowlist or disable validation to recover availability.
