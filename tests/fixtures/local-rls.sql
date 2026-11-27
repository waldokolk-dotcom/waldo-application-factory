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

CREATE TABLE public.waf_test_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 80),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.waf_test_profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.waf_test_profiles TO authenticated;
CREATE POLICY waf_profile_select ON public.waf_test_profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);
CREATE POLICY waf_profile_insert ON public.waf_test_profiles FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY waf_profile_update ON public.waf_test_profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY waf_profile_delete ON public.waf_test_profiles FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);
