// v0.1.0 — small REST response and validation contract.
export function problem(status, code, detail) {
  if (!Number.isInteger(status) || status < 400 || status > 599) throw new TypeError('Invalid problem status');
  return Object.freeze({ status, body: Object.freeze({ type: `urn:waf:${code}`, title: code, status, detail }) });
}

export function json(status, data, headers = {}) {
  if (!Number.isInteger(status) || status < 200 || status > 299) throw new TypeError('Invalid success status');
  return Object.freeze({ status, headers: Object.freeze({ 'content-type': 'application/json; charset=utf-8', ...headers }), body: data });
}

export function boundedString(value, { name = 'value', min = 1, max = 1000 } = {}) {
  if (typeof value !== 'string') throw problem(400, 'invalid-input', `${name} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) throw problem(400, 'invalid-input', `${name} length must be ${min}-${max}`);
  return trimmed;
}
