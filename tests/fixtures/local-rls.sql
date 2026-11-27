-- Test-only RLS fixture. Never deploy to a linked or hosted database.
CREATE TABLE public.waf_test_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  value text NOT NULL CHECK (char_length(value) BETWEEN 1 AND 200)
);
ALTER TABLE public.waf_test_records ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.waf_test_records TO authenticated;
CREATE POLICY waf_test_select ON public.waf_test_records FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = owner_id);
CREATE POLICY waf_test_insert ON public.waf_test_records FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id);
CREATE POLICY waf_test_update ON public.waf_test_records FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);
CREATE POLICY waf_test_delete ON public.waf_test_records FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = owner_id);
