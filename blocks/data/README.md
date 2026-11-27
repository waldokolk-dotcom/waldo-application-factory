# Data block 0.1.0 (approved)

`tenant.mjs` derives ownership exclusively from a verified server identity. `migration.mjs` generates a deterministic PostgreSQL/Supabase migration for an owner-scoped JSON record table. Schema, table and policy identifiers accept lowercase SQL identifiers only; values are never interpolated.

The generated table has a UUID primary key, an `auth.users` owner foreign key with cascade cleanup, object-only JSON payload, timestamps, RLS, least-privilege authenticated grants and explicit SELECT/INSERT/UPDATE/DELETE policies. UPDATE has both `USING` and `WITH CHECK`; no `anon` grant is emitted. Apply each generated migration once through the consumer repository's versioned migration workflow and retain its exact generated SQL in version control.

Acceptance combines unit tests, disposable local GoTrue/PostgREST two-user CRUD, hosted migration history and a rollback-only production transaction using owner and non-owner JWT claims. Never use production rows as fixtures and never use `service_role` in a client. Roll back by reverting the consumer migration according to its data-retention plan; do not drop a populated table automatically.
