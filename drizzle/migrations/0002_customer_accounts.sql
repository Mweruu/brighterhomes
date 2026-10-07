ALTER TABLE public.reservations ADD COLUMN user_id uuid;
CREATE INDEX reservations_user_id_idx ON public.reservations(user_id);

DROP POLICY "Visitors can submit a reservation" ON public.reservations;
CREATE POLICY "Guests submit unowned reservations" ON public.reservations FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "Signed-in users submit own reservations" ON public.reservations FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Customers read own reservations" ON public.reservations FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  phone text,
  address text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());