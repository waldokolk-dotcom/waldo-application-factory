// v0.1.0 — server-only adapter for an official Supabase client.
 // Never use a service-role client here; supply a request-scoped public-key client.
export function createAuthenticator(client) {
  if (typeof client?.auth?.getUser !== 'function') throw new TypeError('Supabase auth client required');
  return async function authenticate(header) {
    if (typeof header !== 'string' || header.length > 8192) return null;
    const match = /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i.exec(header);
    if (!match) return null;
    try {
      const {data,error} = await client.auth.getUser(match[1]);
      if (error || typeof data?.user?.id !== 'string' || !data.user.id.trim()) return null;
      return Object.freeze({userId:data.user.id});
    } catch { return null; }
  };
}
// Ownership is derived from the verified identity, never request metadata.
export function ownsResource(identity, ownerId) {
  return typeof identity?.userId === 'string' && identity.userId.length > 0 &&
    typeof ownerId === 'string' && identity.userId === ownerId;
}
