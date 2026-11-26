// v0.1.0 — database-neutral tenant boundary helpers.
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;

export function requireTenantIdentity(identity) {
  const userId = identity?.userId;
  if (typeof userId !== 'string' || !ID.test(userId)) throw new TypeError('Verified user identity required');
  return Object.freeze({ userId });
}

export function tenantRow(identity, values = {}) {
  const { userId } = requireTenantIdentity(identity);
  const { owner_id: ignored, ...safeValues } = values;
  return Object.freeze({ ...safeValues, owner_id: userId });
}

export function filterOwnedRows(identity, rows) {
  const { userId } = requireTenantIdentity(identity);
  if (!Array.isArray(rows)) throw new TypeError('Rows must be an array');
  return rows.filter(row => row?.owner_id === userId);
}
