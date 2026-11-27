// v0.1.0 — deterministic PostgreSQL/Supabase owner-table migration.
const IDENTIFIER = /^[a-z][a-z0-9_]{0,62}$/;

function identifier(value, label) {
  if (typeof value !== 'string' || !IDENTIFIER.test(value)) throw new TypeError(`${label} must be a lowercase SQL identifier`);
  return `"${value}"`;
}

export function createOwnerTableMigration({ schema = 'public', table } = {}) {
  const s = identifier(schema, 'schema');
  const t = identifier(table, 'table');
  const relation = `${s}.${t}`;
  const policy = name => identifier(`${table}_${name}`, 'policy');
  const sql = [
    `create table ${relation} (\n  id uuid primary key default gen_random_uuid(),\n  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,\n  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n)`,
    `alter table ${relation} enable row level security`,
    `grant select, insert, update, delete on ${relation} to authenticated`,
    `grant select, insert, update, delete on ${relation} to service_role`,
    `create policy ${policy('select')} on ${relation} for select to authenticated using ((select auth.uid()) = owner_id)`,
    `create policy ${policy('insert')} on ${relation} for insert to authenticated with check ((select auth.uid()) = owner_id)`,
    `create policy ${policy('update')} on ${relation} for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)`,
    `create policy ${policy('delete')} on ${relation} for delete to authenticated using ((select auth.uid()) = owner_id)`
  ].join(';\n') + ';\n';
  return Object.freeze({ version: '0.1.0', schema, table, sql });
}
